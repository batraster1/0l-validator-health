const discordNotifier = require("./discordNotifier.js")

const validatorErrorMap = new Map()
const GREEN = "#00FF00"
const RED = "#FF0000"
const ORANGE = "#FFA500"

function sendNotification(validator, newErrors){
    let errorKey = validator.ipAddress + validator.description
    const hasErrors = validatorErrorMap.has(errorKey);
    if(newErrors.length == 0 && hasErrors){  
        discordNotifier.sendToWebhooks(validator, [], GREEN)
        validatorErrorMap.delete(errorKey)
    }
    else if(newErrors.length > 0 && !hasErrors ){   
        discordNotifier.sendToWebhooks(validator, [{key : 'Errors:' , value: newErrors.join("\n")}], RED)
        validatorErrorMap.set(errorKey, newErrors)
    }
    else if(newErrors.length > 0 && hasErrors){
        let errorsCleared = validatorErrorMap.get(errorKey).filter(error => !newErrors.includes(error))
        if(errorsCleared.length >0){
            discordNotifier.sendToWebhooks(validator, [{key : 'Errors:' , value: newErrors.join("\n")}, {key : 'Errors cleared:' , value: errorsCleared.join("\n")}], ORANGE)
        }
        validatorErrorMap.set(errorKey, newErrors)
    }    
}

module.exports = {sendNotification}
