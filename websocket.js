const WebSocket = require('ws');
const ws = new WebSocket('wss://phish.sinking.yachts/feed', {
    headers: {
        'X-Identity': 'duiprovjp#0001',
    },
});

ws.on('open', () => console.log('Connected to Phish.Sinking.Yachts'));

ws.on('message', (data) => console.log(data));
