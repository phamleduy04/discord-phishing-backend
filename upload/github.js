const { config } = require('../config');
const { getAll } = require('../handler/database');
const logger = require('../log');
const axios = require('axios');
const _ = require('lodash');

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
    };
    const url = `https://api.github.com/repos/${config.github.repo}/contents/${fileName}`;
    const fileData = await axios.get(url, { headers }).catch(() => null);

    const data = JSON.stringify({
        message: `Automatic update ${fileName}`,
        content: Buffer.from(content, 'utf-8').toString('base64'),
        sha: fileData ? fileData.data.sha : null,
    });

    const request = {
        method: 'put',
        url: `https://api.github.com/repos/${config.github.repo}/contents/${fileName}`,
        headers,
        data,
    };

    try {
        await axios(request);
        logger.info(`Uploaded ${fileName} to github!`);
    }
    catch(err) {
        logger.err(`Error uploading ${fileName} to github!`, err);
    }
};