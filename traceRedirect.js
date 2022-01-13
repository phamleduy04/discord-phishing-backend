const tls = require('tls');
const util = require('util');
const parser = require('http-string-parser');
const resolve = util.promisify(getRedirect);

module.exports = async (url) => {
    const urlList = [];
    let redirectCount = 0;
    let timeRequested = 0;
    while (timeRequested < 10) {
        const res = await resolve(url);
        const location = res.headers[Object.keys(res.headers).find(key => key.toLowerCase() === 'location')];
        if (res.statusCode == 302 || res.statusCode == 301) {
            redirectCount++;
            url = location;
            urlList.push(url);
        }
        else break;
        timeRequested++;
    }
    return { urlList, lastURL: urlList[urlList.length - 1], redirectCount };
};

function getRedirect(url, callback) {
    const { host } = new URL(url);
    const raw_request = `GET ${url} HTTP/1.1\r\nUser-Agent: Mozilla 5.0\r\nHost: ${host}\r\nCookie: \r\ncontent-length: 0\r\n\n`;
    const socket = tls.connect({
        highWaterMark: 16384,
        servername: host,
        port: 443,
        host,
    }, () => socket.write(raw_request));

    socket.on('data', (data) => {
        socket.destroy();
        const parsed = parser.parseResponse(data.toString());
        callback(null, parsed);
    });
}