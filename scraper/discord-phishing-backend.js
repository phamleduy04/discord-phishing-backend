// From: https://github.com/phamleduy04/discord-phishing-backend
const blacklistLinks = 'https://raw.githubusercontent.com/phamleduy04/discord-phishing-backend/main/blacklist-links.json';
const blacklistDomains = 'https://raw.githubusercontent.com/phamleduy04/discord-phishing-backend/main/blacklist-domains.json';
const axios = require('axios');
const { set } = require('../handler/database');
const logger = require('../log');

module.exports = async () => {
    try {
        const links = await axios.get(blacklistLinks);
        const domains = await axios.get(blacklistDomains);
        await set(`links:phamleduy04`, JSON.stringify(links.data.filter(el => el.includes('/') && el.length)));
        await set(`domains:phamleduy04`, JSON.stringify(domains.data.filter(el => !el.includes('/') && el.length)));
        logger.info('Updated discord-phishing-backend by phamleduy04');
    } catch (err) {
        logger.err('Error! discord-phishing-backend by phamleduy04', err);
    }
};