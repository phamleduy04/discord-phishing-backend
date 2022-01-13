const { config } = require('../config');
const { getAll } = require('../handler/database');
const logger = require('../log');
const _ = require('lodash');
const { request } = require('undici');

module.exports = async () => {
    if (!config.github) return;
    const links = await getAll('links:*');
    const domains = await getAll('domains:*');

    await uploadFile(JSON.stringify(_.uniq(links).filter(v => v.length).sort(), null, 5), 'blacklist-links.json');
    await uploadFile(JSON.stringify(_.uniq(domains).filter(v => v.length).sort(), null, 5), 'blacklist-domains.json');
};

async function uploadFile(content, fileName) {
    const headers = {
        'Authorization': `Bearer ${config.github.token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'undici',
    };
    const url = `https://api.github.com/repos/${config.github.repo}/contents/${fileName}`;
    const fileData = await request(url, { headers }).then(el => el.body.json()).catch(() => null);
    const contentEncoded = Buffer.from(content).toString('base64');
    if (contentEncoded == fileData.content) return;

    const data = JSON.stringify({
        message: `Automatic update ${fileName}`,
        content: contentEncoded,
        sha: fileData ? fileData.sha : null,
    });

    const reuqestOptions = {
        method: 'PUT',
        headers,
        body: data,
    };

    try {
        await request(url, reuqestOptions);
        logger.info(`Uploaded ${fileName} to github!`);
    }
    catch(err) {
        logger.err(`Error uploading ${fileName} to github!`, err);
    }
};