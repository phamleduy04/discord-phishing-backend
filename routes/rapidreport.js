const router = require('express').Router();
const jaroWinkler = require('jaro-winkler');
const { parseDomain, fromUrl } = require('parse-domain');
const { request } = require('undici');
const testList = [
    "steam",
    "discord",
    "steamcommunity",
];

router.get('/', async (req, res) => {
    const url = req.query.url;
    const msgContent = req.query.message;
    if (!url) return res.status(400).send({ message: 'No URL provided!' });
    let domain;
    const parsedURL = parseDomain(fromUrl(url));
    if (parsedURL.type === 'LISTED') domain = parsedURL.domain;
    try {
        domain = new URL(url).hostname.split('.')[0];
    }
    catch { domain = req.query.url.split('/')[0].split('.')[0]; };
    const domainCheck = testList.map(name => ({ name, score: jaroWinkler(name, domain) })).sort()[0];
    // report to other backend service
    if (domainCheck.score > 0.5) {
        console.log('High Score');
        await request(`${process.env.REPORT_URL}/report`, {
            method: 'POST',
            headers: {
                "authorization": process.env.REPORT_TOKEN,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                url: url,
                content: msgContent || `${domainCheck.name} is linked to ${url}`,
                userID: '00000000000',
                userTag: 'Rapid Report#0000',
            }),
        });
    }
    return res.sendStatus(200);
});

module.exports = router;