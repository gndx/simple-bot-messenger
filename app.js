'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('Hello World!')
})

app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === process.env.TOKEN) {
        res.send(req.query['hub.challenge']);
    } else {
        res.send('chewiekie_says_bye');
    }
});

app.post('/webhook', function (req, res) {
    const data = req.body;
    if (data.object == 'page') {
        data.entry.forEach(function (pageEntry) {
            pageEntry.messaging.forEach(function (messagingEvent) {
                receiveAttachments(messagingEvent);
            });
        });
        res.sendStatus(200);
    }
});

const receiveMessage = (event) => {
    const senderId = event.sender.id;
    const messageText = event.message.text;
    const messageData = {
		recipient : {
			id : recipientId
		},
		message: {
			text: messageText
		}
    };
    sendMessage(messageData);
}

const sendMessage = (messageData) => {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: env.APP_TOKEN
        },
        method: 'POST',
        json: messageData
    }, function (error, response, data) {
        if (error) {
            console.log('No es posible enviar el mensaje');
        } else {
            console.log("Mensaje enviado...");
        }
    });
}

app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});