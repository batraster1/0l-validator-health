const { Webhook, MessageBuilder } = require('discord-webhook-node');

const WEBHOOK_NAME = "ValidatorHealth"
const DEFAULT_WEBHOOK = "https://discord.com/api/webhooks/927288583151296532/ZjcekL1NaAb_meAmP0jkxGDmASg8ZGYHMKgufaP0mLtkGdtqYUAL7Z6pvjCdxFWwTQi3"
const TEST_WEBHOOK = "https://discord.com/api/webhooks/927288013657083925/5uZnbqQNqegkOBdKJdv1VWO9prieJaGR7FPpB2r4MVLsxTEjsTAFM0HA8jdDo-8yud73"

function sendToWebhooks(validator, fields, color){
    if(validator.webhookUrls && validator.webhookUrls.length >0){
        const embed = new MessageBuilder().setColor(color)

        let footer = `IP: ${validator.ipAddress}`   
        if(validator.address){
            footer += `\nAddress: ${validator.address}`
        }
        for(let webhookUrl of validator.webhookUrls){
            if(webhookUrl === "DEFAULT"){
                webhookUrl = DEFAULT_WEBHOOK
            }
            if(webhookUrl == "TEST"){
                webhookUrl = TEST_WEBHOOK
            }

            if(fields && fields.length > 0){
                for(const field of fields){
                    embed.addField(field.key, field.value)
                }
            }
            let description = ""
            if(validator.discordIds && validator.discordIds.length > 0){
                for(const discordId of validator.discordIds){
                    description += `<@${discordId}> `
                }
            }
            embed.setDescription(description)
            embed.setFooter(footer)
            const hook = new Webhook(webhookUrl)
            hook.setUsername(WEBHOOK_NAME)
            hook.send(embed)
        }
    }
}

module.exports = {sendToWebhooks}