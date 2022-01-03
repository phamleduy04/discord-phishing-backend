const moment = require('moment-timezone');
const chalk = require('chalk');
const { config } = require('../config');

const timeNow = () => moment().tz(config.timezone).format("MM-DD-YYYY hh:mm:ss");
const msg = (func, message) => func(chalk.yellow(`[${timeNow()}]`) + ' ' + chalk.green(message));

const err = (message = 'Unkown Err!', err) => {
    console.error(chalk.yellow(timeNow()) + ' Error: ' + chalk.red(message));
    console.error(err);
};

const info = (message) => msg(console.info, message);
const warn = (message) => msg(console.warn, `${chalk.yellow('WARNING ->')} -> ${message}`);


module.exports = {
    err,
    info,
    warn,
};