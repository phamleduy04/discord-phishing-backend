// From: api.hyperphish.com
const { request } = require('undici');
const { set } = require('../handler/database');
const logger = require('../log');
const url = "https://api.hyperphish.com/gimme-domains";

module.exports = async () => {
    try {
        const blacklist = await request(url).then(el => el.body.json());
        await set(`domains:hyperphish`, JSON.stringify(blacklist));
        logger.info('Updated hyperphish');
    } catch (err) {
        logger.err('Error! hyperphish', err);
    }
};