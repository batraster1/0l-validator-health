# 0l-validator-health

A Node project that tracks the health of 0L validator nodes and publishes notifications to Discord [Telegram ....]

  

## Health Checks

 1. Node Offline
 2. Not in Sync
 3. Not in validator set
 4. Not running
 5. Votes in epoch unchanged in the last 5 min
 6. Proofs in epoch unchanged - If the proofs submitted by a validator is less than 8 and no new proofs have been submitted in the last 3 hours.
