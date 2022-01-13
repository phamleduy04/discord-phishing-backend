// From: https://github.com/BuildBot42/discord-scam-links
const url = 'https://raw.githubusercontent.com/BuildBot42/discord-scam-links/main/list.txt';
const { request } = require('undici');
const { set } = require('../handler/database');
const logger = require('../log');

module.exports = async () => {
    try {
        const blacklist = await request(url).then(el => el.body.text());
        await set(`domains:BuildBot42`, JSON.stringify(blacklist.split('\n').filter(el => !el.includes('/') && el.length)));
        logger.info('Updated discord-scam-links by BuildBot42');
    } catch (err) {
        logger.err('Error! discord-scam-links by BuildBot42', err);
    }
};