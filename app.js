const express = require('express');
const logger = require('morgan');
require('dotenv').config();
const app = express();
const ms = require('ms');
const fs = require('fs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/check', require('./routes/check'));
app.use('/', require('./routes/index'));
app.use('/rapidreport', (require('./routes/rapidreport')));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).send('404 Not Found');
});

const exectueScraper = () => fs.readdirSync('./scraper/').forEach(file => require(`./scraper/${file}`)());

exectueScraper();
setInterval(exectueScraper, ms('20m'));

const uploadToGithub = () => require('./upload/github')();
setInterval(uploadToGithub, ms('12h'));

require('./sinking-yatcht')();

module.exports = app;
