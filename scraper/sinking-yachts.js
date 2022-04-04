// From: https://phish.sinking.yachts/
const { request } = require('undici');
const { set } = require('../handler/database');
const logger = require('../log');

module.exports = async () => {
    const url = process.uptime() < 300 ? 'https://phish.sinking.yachts/v2/all' : 'https://phish.sinking.yachts/v2/recent/1200';
    try {
        const blacklist = await request(url, {
            method: 'GET',
            headers: {
                'X-Identity': process.env.IDENTITY || 'phamleduy04/discord-phishing-backend',
            },
        }).then(el => el.body.json());
        await set(`domains:sinking-yachts`, JSON.stringify(blacklist));
        logger.info('Updated sinking-yachts');
    } catch (err) {
        logger.err('Error! sinking-yachts', err);
    }
};