const express = require('express');
const logger = require('morgan');

const indexRouter = require('./routes/index');
require('dotenv').config();
const app = express();
const ms = require('ms');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).send('404 Not Found');
});

async function exectueScraper() {
  require('./scraper/discord-phishing-links')();
  require('./scraper/discord-scam-links')();
};

exectueScraper();
setInterval(exectueScraper, ms('30m'));

function uploadToGithub() {
  require('./upload/github')();
}

setInterval(uploadToGithub, ms('6h'));


module.exports = app;
