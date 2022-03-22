const express = require('express');
const logger = require('morgan');

const indexRouter = require('./routes/index');
require('dotenv').config();
const app = express();
const ms = require('ms');
const fs = require('fs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).send('404 Not Found');
});

const exectueScraper = () => fs.readdirSync('./scraper/').forEach(file => require(`./scraper/${file}`)());

exectueScraper();
setInterval(exectueScraper, ms('30m'));

function uploadToGithub() {
  require('./upload/github')();
}

setInterval(uploadToGithub, ms('6h'));


module.exports = app;
