// From: https://github.com/nikolaischunk/discord-phishing-links
const url = 'https://raw.githubusercontent.com/nikolaischunk/discord-phishing-links/main/domain-list.json';
const { request } = require('undici');
const { set } = require('../handler/database');
const logger = require('../log');

module.exports = async () => {
    try {
        const blacklist = await request(url).then(el => el.body.json());
        await set(`domains:nikolaischunk`, JSON.stringify(blacklist.domains.filter(el => !el.includes('/') && el.length)));
        await set(`links:nikolaischunk`, JSON.stringify(blacklist.domains.filter(el => el.includes('/') && el.length)));
        logger.info('Updated discord-phishing-links by nikolaischunk');
    } catch (err) {
        logger.err('Error! discord-phishing-links by nikolaischunk', err);
    }
};