const slackNotifier = require("./slackNotifier.js")

const validatorErrorMap = new Map()
const GREEN = "#00FF00"
const RED = "#FF0000"
const ORANGE = "#FFA500"

function sendNotification(validator, newErrors){
    let errorKey = validator.ipAddress + validator.description
    console.log(newErrors)
    const hasErrors = validatorErrorMap.has(errorKey);
    if( newErrors.length === 0 && hasErrors){
        slackNotifier.sendToWebhooks(validator, [])
        validatorErrorMap.delete(errorKey)
    }
    else if(newErrors.length > 0 && !hasErrors ){   
        slackNotifier.sendToWebhooks(validator, [{key : 'Errors:' , value: newErrors.join("\n")}])
        validatorErrorMap.set(errorKey, newErrors)
    }
    else if(newErrors.length > 0 && hasErrors){
        let errorsCleared = validatorErrorMap.get(errorKey).filter(error => !newErrors.includes(error))
        if(errorsCleared.length >0){
            slackNotifier.sendToWebhooks(validator, [{key : 'Errors:' , value: newErrors.join("\n")}, {key : 'Errors cleared:' , value: errorsCleared.join("\n")}])
        }
        validatorErrorMap.set(errorKey, newErrors)
    }    
}

module.exports = {sendNotification}
