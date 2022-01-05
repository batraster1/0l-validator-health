# 0l-validator-health

A Node project that tracks the health of 0L validator nodes and publishes notifications to Discord [Telegram ....]

  

## Health Checks

 1. Node Offline
 2. Not in Sync
 3. Not in validator set
 4. Not running
 5. Votes in epoch unchanged in the last 5 min
 6. Proofs in epoch unchanged - If the proofs submitted by a validator is less than 8 and no new proofs have been submitted in the last 3 hours.
 
![11d9f8d52f78.png\]](https://user-images.githubusercontent.com/36015640/148246687-a2193d44-da74-47de-aa74-11d9f8d52f78.png)

## Adding monitoring for your validator node
To get monitoring for free, submit a PR to add your details to the [validators.json](./vaidators.json)

    [
	    {
	    "ipAddress": "52.36.30.8",
	    "discordIds": ["916109984847253525"],
	    "notifyFor": [
	    "ALL"
	    ],
	    "webhookUrls": ["DEFAULT"]
	    }
    ]

 - ipAddress : IP address of your validator node. Ensure the monitor is running and port 3030 is open
 - discordIds: The list of discordsIds to 'mention' in the notification. [This is](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-) how you can get your discordId
 - notifyFor: OFFLINE,  NOT_IN_SYNC, NOT_IN_VALIDATOR_SET, NOT_RUNNING, VOTES_IN_EPOCH_UNCHANGED, PROOFS_IN_EPOCH_UNCHANGED described above. Or just specify ALL if you want notifications for all these conditions.
 - weebhookUrls: DEFAULT if you'd like notifications to go to the canonical discord channel (#validator_health). If you'd like notifications to go to another channel, follow the steps [here](https://www.digitalocean.com/community/tutorials/how-to-use-discord-webhooks-to-get-notifications-for-your-website-status-on-ubuntu-18-04). You should end up with a URL that looks like: https://discord.com/api/webhooks/927400691201372170/bY_U-pUMESzl0MHJ3fXisVU1gbYYrvZI1cwiAGL9yMuObKzsoevGYbv8gAZ5D8KoeSsm
### Standalone mode
If you'd like to run the script yourself:

    clone repo
    npm install
    edit validators.json
    node index.js
