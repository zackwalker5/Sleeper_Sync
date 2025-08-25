# Sleeper → GitHub Single JSON Sync

This repo writes **all Sleeper data into one file**: `/data/sleeper.json`

## Setup
1. Create a GitHub repo and upload these files.
2. Add repo → Settings → Secrets/Variables → Actions:
   - `SLEEPER_LEAGUE_ID` = your league ID
   - (optional) `SLEEPER_WEEK` = force week
3. Run workflow in Actions.

## Link
Share this single URL with ChatGPT:
```
https://raw.githubusercontent.com/USER/REPO/main/data/sleeper.json
```
