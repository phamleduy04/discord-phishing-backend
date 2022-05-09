// From: https://phish.sinking.yachts/
import { Pool } from 'undici';
import { set } from '../database';
import config from '../config';
import * as log from '../utils/log';

const requestPool = new Pool('https://phish.sinking.yachts/');

export default async () => {
    try {
        const blacklist = await requestPool
            .request({
                method: 'GET',
                path: process.uptime() < 300 ? '/v2/all' : '/v2/recent/1200',
                headers: { 'X-Identity': config.identity },
            })
            .then(res => res.body.json());
        await set('domains:sinking-yachts', JSON.stringify(blacklist));
        log.info('Updated sinking-yachts');
    } catch (err) {
        log.error('Error! sinking-yachts', err);
    }
};
