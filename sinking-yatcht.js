// From: https://phish.sinking.yachts/
const { set, get } = require('./handler/database');
const logger = require('./log');
const WebSocket = require('ws');
const _ = require('lodash');

module.exports = createWebsocket;

async function createWebsocket() {
    const ws = new WebSocket('wss://phish.sinking.yachts/feed', {
        headers: {
            'X-Identity': process.env.IDENTITY || 'phamleduy04/discord-phishing-backend',
        },
    });

    ws.on('open', () => console.log('Connected to phish.sinking.yachts websocket server!'));

    ws.on('message', async (data) => {
        data = JSON.parse(data.toString());
        const doaminsList = JSON.parse(await get(`domains:sinking-yachts`));
        if (data.type === 'add')
            await set(`domains:sinking-yachts`, JSON.stringify(_.uniq(_.merge(doaminsList, data.domains))));
        else
            await set(`domains:sinking-yachts`, JSON.stringify(_.uniq(_.difference(doaminsList, data.domains))));
        logger.info(`${data.type} ${data.domains.join(', ')} to sinking-yachts`);
    });

    // renew connection every 1 hours
    setTimeout(() => {
        ws.terminate();
        createWebsocket();
    }, 3600000);
};