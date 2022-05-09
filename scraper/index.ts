import discordHashes from './discord-hashes';
import discordPhishingBackend from './discord-phishing-backend';
import discordPhishingLinks from './discord-phishing-links';
import discordScamLinks from './discord-scam-links';
import hyperphish from './hyperphish';
import sinkingYachts from './sinking-yachts';

import sinkingYachtsWebSocket from '../websocket/sinking-yatcht';

const executeScraper = async () => {
    // eslint-disable-next-line prettier/prettier
    return await Promise.all([
        discordHashes(),
        discordPhishingBackend(),
        discordPhishingLinks(),
        discordScamLinks(),
        hyperphish(),
        sinkingYachts(),
        sinkingYachtsWebSocket(),
    ]);
};

export default executeScraper;
