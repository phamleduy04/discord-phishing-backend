import { Injectable, BadRequestException } from '@nestjs/common';
import { getAll, get, set } from '../database';
import * as _ from 'lodash';
import { parseDomain, fromUrl } from 'parse-domain';

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!';
    }

    async getAllLinksAndDomain(): Promise<string[]> {
        const links = await getAll('links:*');
        const domains = await getAll('domains:*');
        return _.uniq(_.merge(links, domains));
    }

    async getAllLinks(): Promise<string[]> {
        return await getAll('links:*');
    }

    async getAllDomains(): Promise<string[]> {
        return await getAll('domains:*');
    }

    async addDomain(url: string): Promise<string> {
        const urlParsed = parseDomain(fromUrl(url));
        if (urlParsed.type === 'LISTED') url = urlParsed.domain + '.' + urlParsed.topLevelDomains.join('.');
        const customData = JSON.parse(await get('domains:custom')) || [];
        const newData = _.uniq([...customData, url]);
        if (newData.length == customData.length) throw new BadRequestException('Domain already exists!');
        await set(`domains:custom`, JSON.stringify(newData));
        return 'Domain added!';
    }

    async addLink(url: string): Promise<string> {
        const urlParsed = parseDomain(fromUrl(url));
        if (urlParsed.type !== 'LISTED') throw new BadRequestException('URL is not a valid domain!');
        const customData = JSON.parse(await get('links:custom')) || [];
        const newData = _.uniq([...customData, url]);
        if (newData.length == customData.length) throw new BadRequestException('Domain already exists!');
        await set(`links:custom`, JSON.stringify(newData));
        return 'Link added!';
    }
}
