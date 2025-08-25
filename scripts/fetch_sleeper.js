
// One-file Sleeper sync → data/sleeper.json

import fs from 'fs/promises';
import path from 'path';
import process from 'process';

const DATA_DIR = 'data';

function env(name, fallback = undefined) {
  const v = process.env[name];
  return (v && v.trim().length > 0) ? v.trim() : fallback;
}

const LEAGUE_ID = env('SLEEPER_LEAGUE_ID');
const FORCED_WEEK = env('SLEEPER_WEEK', null);

if (!LEAGUE_ID) {
  console.error('Missing SLEEPER_LEAGUE_ID env var');
  process.exit(1);
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function writeJSON(file, data) {
  const fp = path.join(DATA_DIR, file);
  await fs.writeFile(fp, JSON.stringify(data, null, 2));
  console.log('Wrote', fp);
}

async function getJSON(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'sleeper-github-sync' } });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.json();
}

async function main() {
  await ensureDir(DATA_DIR);

  const state = await getJSON('https://api.sleeper.app/v1/state/nfl');
  const week = FORCED_WEEK ? parseInt(FORCED_WEEK, 10) : (state.week ?? 1);

  const league = await getJSON(`https://api.sleeper.app/v1/league/${LEAGUE_ID}`);
  const users = await getJSON(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/users`);
  const rosters = await getJSON(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/rosters`);

  let matchups = [];
  try {
    matchups = await getJSON(`https://api.sleeper.app/v1/league/${LEAGUE_ID}/matchups/${week}`);
  } catch (err) {
    console.warn('Skipping matchups:', err.message);
  }

  const combined = { state, league, users, rosters, week, matchups };
  await writeJSON('sleeper.json', combined);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
