// From: https://github.com/nikolaischunk/discord-phishing-links
import { request } from 'undici';
import { set } from '../database';
import * as log from '../utils/log';

const url = 'https://raw.githubusercontent.com/nikolaischunk/discord-phishing-links/main/domain-list.json';

export default async () => {
    try {
        const blacklist = await request(url).then((res) => res.body.json());
        await set('domains:nikolaischunk', JSON.stringify(blacklist.domains.filter((el) => !el.includes('/') && el.length)));
        await set('links:nikolaischunk', JSON.stringify(blacklist.links.filter((el) => el.includes('/') && el.length)));
        log.info('Updated discord-phishing-links by nikolaischunk');
    } catch (err) {
        log.error('Error! disocrd-phishing-links by nikolaischunk', err);
    }
};