// From: https://github.com/phamleduy04/discord-phishing-backend
// Get: blacklist-links.json and blacklist-domains.json
import { Pool } from 'undici';
import { set } from '../database';
import * as log from '../utils/log';

const requestPool = new Pool('https://raw.githubusercontent.com');

export default async () => {
    try {
        const links = await requestPool.request({ method: 'GET', path: '/phamleduy04/discord-phishing-backend/main/blacklist-links.json' }).then(res => res.body.json());
        await set('links:phamleduy04', JSON.stringify(links));
        const domains = await requestPool.request({ method: 'GET', path: '/phamleduy04/discord-phishing-backend/main/blacklist-domains.json' }).then(res => res.body.json());
        await set('domains:phamleduy04', JSON.stringify(domains));
        log.info('Updated discord-phishing-backend by phamleduy04');
    } catch (err) {
        log.error('Error! bad domain hashes from Discord', err);
    }
};
