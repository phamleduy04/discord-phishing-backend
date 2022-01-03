// From: https://github.com/BuildBot42/discord-scam-links
const url = 'https://raw.githubusercontent.com/BuildBot42/discord-scam-links/main/list.txt';
const axios = require('axios');
const { set } = require('../handler/database');
const logger = require('../log');

module.exports = async () => {
    try {
        const { data } = await axios.get(url);
        await set(`domains:BuildBot42`, JSON.stringify(data.split('\n').filter(el => !el.includes('/') && Boolean)));
        logger.info('Updated discord-scam-links by BuildBot42');
    } catch (err) {
        logger.err('Error! discord-scam-links by BuildBot42', err);
    }
};