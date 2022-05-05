import * as moment from 'moment-timezone';
import * as chalk from 'chalk';

const timeNow = () =>
  moment()
    .tz(process.env.TZ || 'America/Chicago')
    .format('MM/DD/YYYY hh:mm:ss');

const msg = (func, message: string) =>
  func(chalk.yellow(`[${timeNow()}]`) + ' ' + chalk.green(message));

const error = (message = 'Unknown error', err: Error) => {
  console.error(chalk.yellow(timeNow()) + ' Error: ' + chalk.red(message));
  console.error(err);
};

const info = (message: string) => {
  console.log(message);
  msg(console.info, message);
};
const warn = (message: string) =>
  msg(console.warn, `${chalk.yellow('WARNING ->')} -> ${message}`);

export { error, info, warn };
