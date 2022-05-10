import dotenv from 'dotenv';

if (dotenv.config().error) {
    if (!process.env.DOCKER) console.error('Failed to load enviroment variables');
    console.log('Using default config');
} else console.log('Using settings from .env file');

const config: backendConfig = {
    redis: {
        host: process.env.REDIS_HOST || (process.env.DOCKER ? 'redis' : 'localhost'),
        port: parseInt(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD || '',
    },
    github: {
        token: process.env.GITHUB_TOKEN || null,
        repo: process.env.GITHUB_REPO || null,
    },
    timezone: process.env.TIMEZONE || 'America/Chicago',
    authorization: process.env.AUTHORIZATION || 'secret',
    identity: process.env.IDENTITY || 'phamleduy04/discord-phishing-backend',
    port: parseInt(process.env.PORT) || 3000,
};

export default config;

export interface backendConfig {
    redis: {
        host: string;
        port: number;
        password: string;
    };
    github: {
        token: string | null;
        repo: string | null;
    },
    timezone: string;
    authorization: string;
    identity: string;
    port: number;
}
