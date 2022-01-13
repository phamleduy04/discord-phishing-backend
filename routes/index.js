const router = require('express').Router();
const isURL = require('is-url');
const { getAll, get, set } = require('../handler/database');
const _ = require('lodash');
const { parseDomain } = require('parse-domain');
const { config } = require('../config');
const traceRedirect = require('../traceRedirect');
/* GET home page. */
router.get('/', (req, res, next) => {
  res.status(200).send('Home page!');
});

router.get('/all', async (req, res, next) => {
  const result = await getAll();
  res.status(200).send(_.uniq(result));
});

router.get('/links', async (req, res, next) => {
  const result = await getAll('links:*');
  res.status(200).send(_.uniq(result.filter(el => el.length).sort()));
});

router.get('/domains', async (req, res, next) => {
  const data = await getAll('domains:*');
  res.status(200).send(_.uniq(data.filter(el => !el.includes('/') && el.length).sort()));
});

router.get('/check', async (req, res, next) => {
  let url = req.query.url;
  if (!url) return res.status(400).send({ message: 'No URL provided!' });
  if (isURL(url)) url = new URL(url).hostname;
  else url = url.split('/')[0];
  const parseDomainURL = parseDomain(url);
  if (parseDomainURL.type == 'LISTED') url = `${parseDomainURL.labels.filter(el => !parseDomainURL.subDomains.includes(el)).join('.')}`;
  const all = await getAll();
  let blacklist = all.includes(url) ? true : false;
  if (isURL(req.query.url)) {
    const urlParsed = new URL(req.query.url);
    const link = urlParsed.hostname + urlParsed.pathname;
    if (all.includes(link)) {
      blacklist = true;
      url = link;
    }
  }
  else if (all.includes(req.query.url)) {
    blacklist = true;
    url = req.query.url;
  }
  res.status(200).json({ blacklist, domain: url });
});

router.post('/add', async (req, res, next) => {
  if (req.headers.authorization !== config.authorization) return res.status(400).send({ message: 'Unauthorized!' });
  let url = req.body.url;
  if (!url) return res.status(400).send({ message: 'No URL provided!' });
  if (isURL(url)) url = new URL(url).hostname;
  else url = url.split('/')[0];
  const parseDomainURL = parseDomain(url);
  if (parseDomainURL.type == 'LISTED') url = `${parseDomainURL.labels.filter(el => !parseDomainURL.subDomains.includes(el)).join('.')}`;
  const all = await getAll();
  if (all.includes(url)) return res.status(409).send({ message: 'URL already exists on others database!' });
  const customData = JSON.parse(await get(`domains:custom`)) || [];
  const newData = _.uniq([...customData, url]);
  if (customData.length == newData.length) return res.status(409).send({ message: 'URL already exists on customdb!' });
  await set(`domains:custom`, JSON.stringify(newData));
  res.status(200).send({ message: 'URL added!' });
});

router.post('/addlink', async (req, res, next) => {
  if (req.headers.authorization !== config.authorization) return res.status(400).send({ message: 'Unauthorized!' });
  let url = req.body.url;
  const urlParsed = new URL(url);
  if (!url) return res.status(400).send({ message: 'No URL provided!' });
  if (isURL(url)) url = `${urlParsed.hostname}${urlParsed.pathname}`;
  const all = await getAll();
  if (all.includes(url)) return res.status(409).send({ message: 'URL already exists on others database!' });
  const customData = JSON.parse(await get(`links:custom`)) || [];
  const newData = _.uniq([...customData, url]);
  if (customData.length == newData.length) return res.status(409).send({ message: 'URL already exists on customdb!' });
  await set(`links:custom`, JSON.stringify(newData));
  res.status(200).send({ message: 'URL added!' });
});

router.get('/trace-redirect', async (req, res, next) => {
  const url = req.query.url;
  if (!url || !isURL(url)) return res.status(400).send({ message: 'Invalid URL!' });
  try {
    const traceData = await traceRedirect(url);
    res.status(200).json(traceData);
  } catch(err) {
    console.error(err);
    res.status(500).send({ message: "error, please try again later" });
  }
});

module.exports = router;
