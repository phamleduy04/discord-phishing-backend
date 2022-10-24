import dayjs from 'dayjs';
import dayjsTZ from 'dayjs/plugin/timezone';
import dayjsUTC from 'dayjs/plugin/utc';

dayjs.extend(dayjsTZ);
dayjs.extend(dayjsUTC);
import chalk from 'chalk';

const timeNow = () =>
    dayjs()
        .tz(process.env.TZ || 'America/Chicago')
        .format('MM/DD/YYYY hh:mm:ss');

const msg = (func, message: string) => func(chalk.yellow(`[${timeNow()}]`) + ' ' + chalk.green(message));

const error = (message = 'Unknown error', err: Error) => {
    console.error(chalk.yellow(timeNow()) + ' Error: ' + chalk.red(message));
    console.error(err);
};

const info = (message: string) => {
    msg(console.info, message);
};
const warn = (message: string) => msg(console.warn, `${chalk.yellow('WARNING ->')} -> ${message}`);

export { error, info, warn };
