const dotenv = require('dotenv').config();
const config = { redis: {}, github: {} };

if (dotenv.error) {
	if (!process.env.DOCKER) console.error('Failed to load environment variables');
    console.log('Using default settings');
} else console.log('Using settings from .env file');

config.redis.host = process.env.REDIS_HOST || (process.env.DOCKER ? 'redis' : 'localhost');
config.redis.port = process.env.REDIS_PORT || 6379;
config.redis.password = process.env.REDIS_PASSWORD || '';

config.timezone = process.env.TIMEZONE || 'America/New_York';
config.authorization = process.env.AUTHORIZATION || 'secret';
config.github.token = process.env.GITHUB_TOKEN || null;
config.github.repo = process.env.GITHUB_REPO || null;
module.exports = {
    config,
};