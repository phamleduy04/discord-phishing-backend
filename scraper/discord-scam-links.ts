// From: https://github.com/BuildBot42/discord-scam-links
import { request } from 'undici';
import { set } from '../database';
import * as log from '../utils/log';

const url = 'https://raw.githubusercontent.com/BuildBot42/discord-scam-links/main/list.txt';

export default async () => {
    try {
        const blacklist = await request(url).then(res => res.body.text());
        await set('domains:buildbot42', JSON.stringify(blacklist.split('\n').filter(el => !el.includes('/') && el.length)));
        log.info('Updated discord-scam-links by buildbot42');
    } catch (err) {
        log.error('Error! discord-scam-links by buildbot42', err);
    }
};
