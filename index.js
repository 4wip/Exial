const {Client, GatewayIntentBits, Partials} = require('discord.js');
const online = require('./http.js')
const client = new Client({
	intents: Object.values(GatewayIntentBits),
	partials: Object.values(Partials),
	shards: 'auto',
});
const config = require('./src/config.js');
const {readdirSync} = require('node:fs');

const {token} = config;

readdirSync('./src/utils').map(async file => {
	const util = await require(`./src/utils/${file}`);
	util.execute(client);
});

client.login(token);
