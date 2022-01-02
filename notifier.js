const discordNotifier = require("./discordNotifier.js")

const validatorErrorMap = new Map()
const GREEN = "#00FF00"
const RED = "#FF0000"
const ORANGE = "#FFA500"

function sendNotification(validator, newErrors){
    let validatorIpAddress = validator.ipAddress
    const hasErrors = validatorErrorMap.has(validatorIpAddress);
    if(newErrors.length == 0 && hasErrors){  
        discordNotifier.sendToWebhooks(validator, [], GREEN)
        validatorErrorMap.delete(validatorIpAddress)
    }
    else if(newErrors.length > 0 && !hasErrors ){   
        discordNotifier.sendToWebhooks(validator, [{key : 'Errors:' , value: newErrors.join("\n")}], RED)
        validatorErrorMap.set(validator.ipAddress, newErrors)
    }
    else if(newErrors.length > 0 && hasErrors){
        let errorsCleared = validatorErrorMap.get(validatorIpAddress).filter(error => !newErrors.includes(error))
        if(errorsCleared.length >0){
            discordNotifier.sendToWebhooks(validator, [{key : 'Errors:' , value: newErrors.join("\n")}, {key : 'Errors cleared:' , value: errorsCleared.join("\n")}], ORANGE)
        }
        validatorErrorMap.set(validator.ipAddress, newErrors)
    }    
}

module.exports = {sendNotification}