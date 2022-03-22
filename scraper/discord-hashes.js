// From Official Discord: https://cdn.discordapp.com/bad-domains/hashes.json
// Hashed with sha256
const hashes = 'https://cdn.discordapp.com/bad-domains/hashes.json';
const { request } = require('undici');
const { set } = require('../handler/database');
const logger = require('../log');

module.exports = async () => {
    try {
        const links = await request(hashes).then(el => el.body.json());
        await set(`hashes:discord`, JSON.stringify(links));
        logger.info('Updated bad domain hashes from Discord');
    } catch (err) {
        logger.err('Error! bad domain hashes from Discord', err);
    }
};