const { Webhook, MessageBuilder } = require('discord-webhook-node');

const WEBHOOK_NAME = "ValidatorHealth"
const DEFAULT_WEBHOOK = "https://discord.com/api/webhooks/928379458400972821/5r3YseN-HhYKa797aOWtg8s5_BW6iZVCkY82l6Z0sU0bZC4S5C-d6m-S3NQhatJaSkJX"
const TEST_WEBHOOK = "https://discord.com/api/webhooks/929581478222901329/Q_dtP9v0t-dwyzpNdbFDQbLCrrSjSbzXN9Y6LLV2Ls_aqWBq9z0nRInBh6El9Z4meiHB"
const PROD_WEBHOOK = "https://discord.com/api/webhooks/929582767828795463/WY_qk-_IAJ7oiFxtWqCXTnN_3f7sohkL5MBsj_xETNnlHAnIirtMHNnoahocVGPLyLU_"

function sendToWebhooks(validator, fields, color){
    if(validator.webhookUrls && validator.webhookUrls.length >0){
        const embed = new MessageBuilder().setColor(color)

        let footer = `IP: ${maskCharacter(validator.ipAddress)}`   
        if(validator.address){
            footer += `\nAddress: ${maskCharacter(validator.address)}`
        }
        for(let webhookUrl of validator.webhookUrls){
            if(webhookUrl === "DEFAULT"){
                webhookUrl = DEFAULT_WEBHOOK
            }
            if(webhookUrl == "TEST"){
                webhookUrl = TEST_WEBHOOK
            }
            if(webhookUrl == "PROD"){
                webhookUrl = PROD_WEBHOOK
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
            embed.setText(description)
            embed.setFooter(footer)
            const hook = new Webhook(webhookUrl)
            hook.setUsername(WEBHOOK_NAME)
            
            hook.send(embed)
            .then(() => console.log('Sent webhook successfully!'))
            .catch(err => console.log(`Error sending to webhook: ${validator.description} ${webhookUrl} \n ${err}`))            
        }
    }
}

function maskCharacter(str, mask = '#', n = 4) {
  
    // Slice the string and replace with
    // mask then add remaining string
    return ('' + str).slice(0, -n)
        .replace(/./g, mask)
        + ('' + str).slice(-n);
}

module.exports = {sendToWebhooks}
