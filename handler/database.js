const ioRedis = require('ioredis');
const { config } = require('../config');
const db = new ioRedis(config.redis.host, {
    password: config.redis.password,
    port: config.redis.port,
});
const logger = require('../log');
const _ = require('lodash');

db.on('error', err => logger.err('Connection Error', err));

module.exports = {
    get: async (key) => {
        if (!key) return new Error('Key is required');
        return await db.get(key);
    },
    set: async (key, value, time = null) => {
        if (!key) return new Error('Key is required');
        if (!time) return await db.set(key, value);
        return await db.set(key, value, 'PX', time);
    },
    clearPattern: async (pattern) => {
        if (!pattern) return new Error('No pattern provided');
        const keys = await db.keys(pattern);
        for (let i = 0; i < keys.length; i++) {
            await db.del(keys[i]);
        }
        console.log(`Cleared pattern ${pattern}!`);
        return true;
    },
    del: async (key) => {
        if (!key) return new Error('Key is required');
        return await db.del(key);
    },
    remove: async (key) => {
        return module.exports.del(key);
    },
    mget: async (keys) => {
        if (!keys || !Array.isArray(keys)) return new Error('Keys is required');
        return await db.mget(keys);
    },
    getAll: async (pattern = '*') => {
        const keys = await db.keys(pattern);
        if (keys.length == 0) return [];
        const values = await db.mget(keys);
        return _.uniq(values.map(v => JSON.parse(v)).flat());
    },
    hasHash: async (hash) => {
        if (!hash) return new Error('Hash is required');
        const data = await db.get('hashes:discord');
        return data.includes(hash);
    },
};