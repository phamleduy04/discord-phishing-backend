// From: https://phish.sinking.yachts/
const url = 'https://phish.sinking.yachts/v2/all';
const { request } = require('undici');
const { set } = require('../handler/database');
const logger = require('../log');

module.exports = async () => {
    try {
        const blacklist = await request(url).then(el => el.body.json());
        await set(`domains:sinking-yachts`, JSON.stringify(blacklist));
        logger.info('Updated sinking-yachts');
    } catch (err) {
        logger.err('Error! sinking-yachts', err);
    }
};