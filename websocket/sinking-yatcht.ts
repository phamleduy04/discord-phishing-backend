// From: https://phish.sinking.yachts/
// Get realtime blacklist from sinking-yachts

import WebSocket from 'ws';
import { get, set } from '../database';
import config from '../config';
import * as log from '../utils/log';
import * as _ from 'lodash';

const createWSConnection = async () => {
    try {
        const ws = new WebSocket('wss://phish.sinking.yachts/feed', { headers: { 'X-Identity': config.identity } });
        ws.on('open', () => console.log('Connected to phish.sinking.yachts websocket server!'));

        ws.on('message', async (data) => {
            data = JSON.parse(data.toString());
            const domains = JSON.parse(await get(`domains:sinking-yachts`));
            if (data.type === 'add') await set('domains:sinking-yachts', JSON.stringify(_.uniq(_.merge(domains, data.domains))));
            else await set('domains:sinking-yachts', JSON.stringify(_.uniq(_.difference(domains, data.domains))));
            log.info(`${data.type} ${data.domains.join(', ')} to sinking-yachts`);
        });

        // renew connection every 1 hours
        setTimeout(() => {
            ws.terminate();
            createWSConnection();
        }, 3_600_000);
    } catch (err) {
        log.error('Error! sinking-yachts websocket', err);
    }
};

export default createWSConnection;
