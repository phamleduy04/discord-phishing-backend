const router = require('express').Router();
const isURL = require('is-url');
const { getAll, get, set } = require('../handler/database');
const _ = require('lodash');
const { parseDomain } = require('parse-domain');
const { config } = require('../config');
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
  res.status(200).send(_.uniq(result));
});

router.get('/domains', async (req, res, next) => {
  const data = await getAll('domains:*');
  res.status(200).send(_.uniq(data.filter(el => !el.includes('/'))));
});

router.get('/check', async (req, res, next) => {
  let url = req.query.url;
  if (!url) return res.status(400).send({ message: 'No URL provided!' });
  if (isURL(url)) url = new URL(url).hostname;
  else url = url.split('/')[0];
  const parseDomainURL = parseDomain(url);
  if (parseDomainURL.type == 'LISTED') url = `${parseDomainURL.labels.filter(el => !parseDomainURL.subDomains.includes(el)).join('.')}`;
  const all = await getAll();
  res.status(200).json({ blacklist: all.includes(url), domain: url });
});

router.post('/add', async (req, res, next) => {
  if (req.headers.authorization !== config.authorization) return res.status(400).send({ message: 'Unauthorized!' });
  let url = req.body.url;
  if (!url) return res.status(400).send({ message: 'No URL provided!' });
  if (isURL(url)) url = new URL(url).hostname;
  else url = url.split('/')[0];
  const parseDomainURL = parseDomain(url);
  if (parseDomainURL.type == 'LISTED') url = `${parseDomainURL.labels.filter(el => !parseDomainURL.subDomains.includes(el)).join('.')}`;
  const customData = JSON.parse(await get(`domains:custom`)) || [];
  const newData = _.uniq([...customData, url]);
  if (customData.length == newData.length) return res.status(409).send({ message: 'URL already exists!' });
  await set(`domains:custom`, JSON.stringify(newData));
  res.status(200).send({ message: 'URL added!' });
});

module.exports = router;
