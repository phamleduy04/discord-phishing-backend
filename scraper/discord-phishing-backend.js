// From: https://github.com/phamleduy04/discord-phishing-backend
const blacklistLinks = 'https://raw.githubusercontent.com/phamleduy04/discord-phishing-backend/main/blacklist-links.json';
const blacklistDomains = 'https://raw.githubusercontent.com/phamleduy04/discord-phishing-backend/main/blacklist-domains.json';
const { request } = require('undici');
const { set } = require('../handler/database');
const logger = require('../log');

module.exports = async () => {
    try {
        const links = await request(blacklistLinks).then(el => el.body.json());
        const domains = await request(blacklistDomains).then(el => el.body.json());
        await set(`links:phamleduy04`, JSON.stringify(links.filter(el => el.includes('/') && el.length)));
        await set(`domains:phamleduy04`, JSON.stringify(domains.filter(el => !el.includes('/') && el.length)));
        logger.info('Updated discord-phishing-backend by phamleduy04');
    } catch (err) {
        logger.err('Error! discord-phishing-backend by phamleduy04', err);
    }
};