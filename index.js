const toml = require('toml');
const CONFIG_ENV = process.env
const CONFIG_TOML = 'credential.toml'
const fs = require('fs');
const http = require("http");
const url = require("url");
const {IncomingWebhook} = require("@slack/webhook");

let parsed = [];

if(!fs.existsSync(CONFIG_TOML)) {
    console.log("File not found, skip config file");
} else {
    parsed = toml.parse(fs.readFileSync(CONFIG_TOML, 'utf8'));
}

const CONFIG = { ...CONFIG_ENV, ...parsed }

http.createServer(function (req, res) {
    const reqUrl = url.parse(req.url).pathname
    if (req.method === "POST") {
        if (reqUrl === "/sentry_call_back") {
            //let pathname = new URL(req.headers);
            if (req.headers["sentry-trace"] === undefined){
                res.write("not ok")
                res.end()
            }
            //if (req.headers.referer!== "localhost" || req.headers.referer!== "localhost"){}
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                data = JSON.parse(data);
                let json = JSON.parse('{}');
                if (data.event?.exception?.values !== null
                    && data.event?.exception?.values.length > 0) {
                // if (data.event.exception.values[0] !== null){
                    json["exception"] = data.event.exception.values[0]
                    json["exception"].stacktrace = undefined
                    json["exception"].raw_stacktrace = undefined
                }

                let alert = [
                    {
                        "mrkdwn_in": ["text"],
                        "color": "#7a0012",
                        "pretext": data?.message,
                        "author_name": "Movey Sentry",
                        "author_link": "",
                        "author_icon": "",
                        "title": `*${data?.level}*`,
                        "title_link": data?.url,
                        "text": `*${data?.event.type}*`,
                        "fields": [
                            {
                                "title": data?.culprit,
                                "value": `\`\`\`${JSON.stringify(json)}\`\`\``,
                                "short": false
                            },
                            {
                                "title": "Environment",
                                "value": data?.event.tags[0][1],
                                "short": true
                            }
                        ],
                        "thumb_url": "",
                        "footer": "",
                        "footer_icon": "",
                        "ts": data?.event.timestamp
                    }
                ]
                let err = sendToWebhooks(alert, CONFIG?.DEFAULT_WEBHOOK)
                err ? res.write(err) : res.write("Done")
                res.end()
            });
        }
    } else if (req.method === "GET") {
        if (reqUrl === "/") {
            res.write("hello world")
            res.end()
        }
    }
}).listen(CONFIG.PORT || 8000); //the server object listens on port 8080

function sendToWebhooks(data, webhook) {
    if (!webhook) {
        return "no webhook"
    }
    let url;
    if (CONFIG.SLACK_WEBHOOK_URL) {
        url = CONFIG.SLACK_WEBHOOK_URL;
    } else {
        url = webhook;
    }
    // Initialize
    const slackWebhook = new IncomingWebhook(url);

    // Send the notification
    (async () => {
        await slackWebhook.send({
            //text: tableMdString
            text: "",
            "attachments": data
        });
    })(
    );
}
