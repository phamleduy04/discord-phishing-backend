// From Official Discord: https://cdn.discordapp.com/bad-domains/hashes.json
// Hashed with sha256
import { request } from 'undici';
import { set } from '../database';
import * as log from '../utils/log';

const hashes = 'https://cdn.discordapp.com/bad-domains/hashes.json';

export default async () => {
    try {
        const response = await request(hashes).then((res) => res.body.json());
        await set('hashes:discord', JSON.stringify(response));
        log.info('Updated bad domain hashes from Discord');
    } catch (err) {
        log.error('Error! bad domain hashes from Discord', err);
    }
};
