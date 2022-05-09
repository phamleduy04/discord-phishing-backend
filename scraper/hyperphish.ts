// From: api.hyperphish.com
import { request } from 'undici';
import { set } from '../database';
import * as log from '../utils/log';

const url = 'https://api.hyperphish.com/gimme-domains';

export default async () => {
    try {
        const blacklist = await request(url).then(res => res.body.json());
        await set('domains:hyperphish', JSON.stringify(blacklist));
        log.info('Updated hyperphish');
    } catch (err) {
        log.error('Error! hyperphish', err);
    }
};
