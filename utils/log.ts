import dayjs from 'dayjs';
import dayjsTZ from 'dayjs/plugin/timezone';
import dayjsUTC from 'dayjs/plugin/utc';

dayjs.extend(dayjsTZ);
dayjs.extend(dayjsUTC);
import { yellow, green, red } from 'colorette';

const timeNow = () =>
    dayjs()
        .tz(process.env.TZ || 'America/Chicago')
        .format('MM/DD/YYYY hh:mm:ss');

const msg = (func, message: string) => func(yellow(`[${timeNow()}]`) + ' ' + green(message));

const error = (message = 'Unknown error', err: Error) => {
    console.error(yellow(timeNow()) + ' Error: ' + red(message));
    console.error(err);
};

const info = (message: string) => msg(console.info, message);
const warn = (message: string) => msg(console.warn, `${yellow('WARNING ->')} -> ${message}`);

export { error, info, warn };
