const  eventSource = require('eventsource');
const fs = require('fs');

const errorChecker = require("./errorChecker.js")
const notifier = require("./notifier.js")

const FIVE_MIN_IN_MS = 0.1 * 60000
const CONFIG = process.env.CONFIG || 'validators.json'

function getValidatorStats() {
    let validators = JSON.parse(fs.readFileSync(CONFIG))
    for(const validator of validators){
        let uri = `http://${validator.ipAddress}:3030/vitals`
        try {
            const sse = new eventSource(uri)
            sse.onmessage = async (msg) => {
              sse.close()
              let response = JSON.parse(msg.data)
              let errors = await errorChecker.checkForErrors(validator, response)
              validator.address = response.account_view.address
              notifier.sendNotification(validator, errors)              
            }
            sse.onerror = (err) => {
                sse.close()   
                notifier.sendNotification(validator, ['OFFLINE'])
            }
          } catch (err) {
            console.log('error')
            notifier.sendNotification(validator, ['OFFLINE'])
          }
    }
       
}

console.log('Starting 0l validator health ...')
getValidatorStats()
setInterval(getValidatorStats, FIVE_MIN_IN_MS)

