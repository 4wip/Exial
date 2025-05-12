const {ActivityType, Events} = require('discord.js');
const {REST} = require('@discordjs/rest');
const {Routes} = require('discord-api-types/v10');

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		const rest = new REST({version: '10'}).setToken(client.token);

		client.user.presence.set({
			status: 'idle',
		});

		client.log(`${client.user.username} has just woken up`);

		try {
			await rest.put(Routes.applicationCommands(client.user.id), {
				body: client.slashDatas,
			});
		} catch (error) {
			console.error(error);
		}
	},
};
