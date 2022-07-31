import config from '../config';
import { getAll } from '../database';
import _ from 'lodash';
import { request } from 'undici';
import * as log from '../utils/log';

const uploadFile = async (content: string, fileName: string): Promise<void> => {
    const headers = {
        Authorization: `Bearer ${config.github.token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'undici',
    };
    const url = `https://api.github.com/repos/${config.github.repo}/contents/${fileName}`;
    const fileData = await request(url, { headers })
        .then(el => el.body.json())
        .catch(() => null);
    const contentEncoded = Buffer.from(content).toString('base64');
    if (contentEncoded == fileData.content) return;

    const data = JSON.stringify({
        message: `[skip actions] Automatic update ${fileName}`,
        content: contentEncoded,
        sha: fileData ? fileData.sha : null,
    });

    try {
        await request(url, {
            headers,
            method: 'PUT',
            body: data,
        });
        log.info(`Uploaded ${fileName} to github!`);
    } catch (err) {
        log.error(`Error uploading ${fileName} to github!`, err);
    }
};

export default async () => {
    if (!config.github) return;
    const links = await getAll('links:*');
    const domains = await getAll('domains:*');
    console.log(links);
    // eslint-disable-next-line prettier/prettier
    await uploadFile(JSON.stringify(_.uniq(links).filter(v => v.length).sort(), null, 5), 'blacklist-links.json');
    // eslint-disable-next-line prettier/prettier
    await uploadFile(JSON.stringify(_.uniq(domains).filter(v => v.length).sort(), null, 5), 'blacklist-domains.json');
};