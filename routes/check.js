const router = require('express').Router();
const isURL = require('is-url');
const { getAll, hasHash } = require('../handler/database');
const { parseDomain, fromUrl } = require('parse-domain');
const { createHash } = require('crypto');
const filterLink = (url, urlToCheck) => urlToCheck.includes(url);

router.get('/', async (req, res, next) => {
    const url = req.query.url;
    let urlToCheck, domain = url;
    if (!url) return res.status(400).send({ message: 'No URL provided!' });
    if (await hashCheck(url)) return res.json({ blacklist: true, domain: url });
    const blacklistDomains = await getAll('domains:*');
    const blacklistLinks = await getAll('links:*');
    const parsedURL = parseDomain(fromUrl(url));
    if (parsedURL.type === 'LISTED') domain = parsedURL.domain + '.' + parsedURL.topLevelDomains[0];
    if (isURL(url)) urlToCheck = new URL(url).hostname;
    else urlToCheck = req.query.url.split('/')[0];
    let linkCheck = filterAndReturn(url, blacklistDomains);
    if (linkCheck.blacklist) return res.json({ blacklist: true, domain: domain });
    linkCheck = filterAndReturn(url, blacklistLinks);
    if (linkCheck.blacklist) res.json({ blacklist: true, domain: url });
    else res.json({ blacklist: false, domain: url });
});

async function hashCheck(url) {
    if (isURL(url)) url = new URL(url).hostname + new URL(url).pathname;
    const hash = createHash('sha256').update(url).digest('hex');
    if (await hasHash(hash)) return true;
    return false;
}

function filterAndReturn(url, list) {
    const filtered = list.filter(item => filterLink(item, url));
    if (filtered.length !== 0) return { url, blacklist: true, data: filtered[0] };
    else return { url, blacklist: false };
}

module.exports = router;