import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import config from '../config';
import scraper from '../scraper';
import morgan from 'morgan';
import uploadToGithub from '../upload/github';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
    app.use(morgan('dev'));
    await app.listen(config.port, '0.0.0.0');
    console.log(`Server running on port ${config.port}`);
}

scraper();
bootstrap();
setInterval(uploadToGithub, 1000 * 60 * 60 * 12);
