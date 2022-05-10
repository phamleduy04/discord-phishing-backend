import { Controller, Get, Post, Headers, BadRequestException, Body, Query, UnauthorizedException } from '@nestjs/common';
import { AppService } from './app.service';
import config from '../config';

import type { addRemoveLinkResponse } from './app.service';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('all')
    async getAll(): Promise<string[]> {
        return await this.appService.getAllLinksAndDomain();
    }

    @Get('links')
    async getAllLinks(): Promise<string[]> {
        return await this.appService.getAllLinks();
    }

    @Get('domains')
    async getAllDomains(): Promise<string[]> {
        return await this.appService.getAllDomains();
    }

    @Post('adddomain')
    async addDomain(@Headers() header: { authorization: string }, @Body() body: { url: string }): Promise<addRemoveLinkResponse> {
        if (header.authorization !== config.authorization) throw new UnauthorizedException('Unauthorized!');
        const url = body?.url;
        if (!url) throw new BadRequestException('No url provided!');
        return await this.appService.addDomain(url);
    }

    @Post('addlink')
    async addLink(@Headers() header: { authorization: string }, @Body() body: { url: string }): Promise<addRemoveLinkResponse> {
        if (header.authorization !== config.authorization) throw new UnauthorizedException('Unauthorized!');
        const url = body?.url;
        if (!url) throw new BadRequestException('No url provided!');
        return await this.appService.addLink(url);
    }

    @Get('check')
    async check(@Query() query: { url: string }) {
        const url = query?.url;
        if (!url) throw new BadRequestException('No url provided!');
        return await this.appService.check(url);
    }

    @Get('rapidreport')
    async rapidreport(@Query() query: { url: string; message: string | null }) {
        const url = query?.url;
        if (!url) throw new BadRequestException('No url provided!');
        return await this.appService.rapidreport(url, query?.message);
    }
}
