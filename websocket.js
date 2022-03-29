const WebSocket = require('ws');
const ws = new WebSocket('wss://phish.sinking.yachts/feed', {
    headers: {
        'X-Identity': process.env.IDENTITY || 'phamleduy04/discord-phishing-backend',
    },
});

ws.on('open', () => console.log('Connected to phish.sinking.yachts websocket server!'));

ws.on('message', (data) => console.log(data));
