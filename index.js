const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = 'your_verify_token'; // Token bạn nhập trong Facebook Developer

app.use(bodyParser.json());

// VERIFY ENDPOINT (dùng để Facebook gọi tới xác minh webhook)
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
    } else {
        res.sendStatus(403);
    }
});

// NHẬN SỰ KIỆN TỪ FACEBOOK
app.post('/webhook', (req, res) => {
    console.log("Payload received from Facebook:", JSON.stringify(req.body, null, 2));

    const body = req.body;
    if (body.object === 'page') {
        body.entry.forEach(entry => {
            const event = entry.messaging[0];
            const senderId = event.sender.id;
            const messageText = event.message?.text;
            console.log('Received message:', messageText, 'from:', senderId);
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
