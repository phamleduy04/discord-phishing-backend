import ioRedis from 'ioredis';
import config from '../config';
import * as log from '../utils/log';
import _ from 'lodash';
console.log(_.VERSION);

const db = new ioRedis(config.redis.host, {
    password: config.redis.password,
    port: config.redis.port,
});

db.on('error', err => log.error('Redis connection error', err));

const get = async (key: string) => {
    if (!key) throw new Error('Key is required');
    return await db.get(key);
};

const set = async (key: string, value: string, time: number | null = null) => {
    if (!key) throw new Error('Key is required');
    if (!value) throw new Error('Value is required');
    if (!time) return await db.set(key, value);
    return await db.set(key, value, 'PX', time);
};

const del = async (key: string) => {
    if (!key) throw new Error('Key is required');
    return await db.del(key);
};

const getAll = async (pattern = '*'): Promise<string[]> => {
    const keys = await db.keys(pattern);
    if (keys.length == 0) return [];
    const values = await db.mget(keys);
    return _.uniq(values.map(v => JSON.parse(v)).flat());
};

const hasHash = async (hash: string) => {
    if (!hash) return new Error('Hash is required');
    const hashes = await db.get('hashes:discord');
    return hashes.includes(hash);
};

export { get, set, del, getAll, hasHash };
