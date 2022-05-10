import { Injectable, BadRequestException } from '@nestjs/common';
import { getAll, get, set, hasHash } from '../database';
import _ from 'lodash';
import { parseDomain, fromUrl } from 'parse-domain';
import { createHash } from 'crypto';
import jaroWinkler from 'jaro-winkler';
const testList = ['steam', 'discord', 'steamcommunity'];
import { request } from 'undici';

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

    async check(url: string): Promise<CheckResult> {
        const urlParsed = parseDomain(fromUrl(url));
        if (urlParsed.type === 'LISTED') url = urlParsed.domain + '.' + urlParsed.topLevelDomains.join('.');
        const hash = createHash('sha256').update(url).digest('hex');
        if (await hasHash(hash)) return { blacklist: true, domain: url, type: 'discord-hash' };
        const blacklistDomains = await getAll('domains:*');
        const blacklistLinks = await getAll('links:*');
        const domainCheck = filterAndReturn(url, blacklistDomains);
        if (domainCheck.blacklist) return { blacklist: true, domain: url, type: 'domains' };
        const linkCheck = filterLinks(url, blacklistLinks);
        if (linkCheck.blacklist) return { blacklist: true, domain: url, type: 'links' };
        else return { blacklist: false, domain: url };
    }

    async rapidreport(url: string, message = 'N/A'): Promise<string> {
        const urlParsed = parseDomain(fromUrl(url));
        if (urlParsed.type === 'LISTED') url = urlParsed.domain + '.' + urlParsed.topLevelDomains.join('.');
        const domainCheck = testList.map(name => ({ name, score: jaroWinkler(name, url) })).sort((a, b) => b.score - a.score)[0];
        if (domainCheck.score > 0.7) {
            console.log(`${domainCheck.name} - ${domainCheck.score}`);
            await request(`${process.env.REPORT_URL}/report`, {
                method: 'POST',
                headers: {
                    authorization: process.env.REPORT_TOKEN,
                    'content-type': 'application/json',
                },
                body: JSON.stringify({
                    url: url,
                    content: message || `${domainCheck.name} is linked to ${url}`,
                    userID: '00000000000',
                    userTag: 'Rapid Report#0000',
                }),
            });
        }
        return 'Rapid Report sent!';
    }
}

export interface CheckResult {
    blacklist: boolean;
    domain: string;
    type?: string;
}

const filterDomains = (url, urlToCheck) => url == urlToCheck;

function filterAndReturn(url, list) {
    const filtered = list.filter(item => filterDomains(item, url));
    if (filtered.length !== 0) return { url, blacklist: true, data: filtered[0] };
    else return { url, blacklist: false };
}

function filterLinks(url, list) {
    let blacklist = false;
    for (let i = 0; i < list.length; i++)
        if (list[i] == url) {
            blacklist = true;
            break;
        }
    return { url, blacklist };
}
