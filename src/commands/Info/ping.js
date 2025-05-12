const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

exports.commandBase = {
	prefixData: {
		name: 'ping',
		aliases: [],
	},
	slashData: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('shows bot latency'),
	cooldown: 3000, // 1 second = 1000 ms
	ownerOnly: false, // Set to true if you want the command to be available only to the developer
	async prefixRun(client, message, args) {

		const msg = await message.reply('Pong!');

		const latency = msg.createdTimestamp - message.createdTimestamp;
		const apiLatency = Math.round(client.ws.ping);

		msg.edit(`Pong! ${latency}ms`);
	},
	async slashRun(client, interaction) {
		const msg = await interaction.reply({ content: 'Pong!', fetchReply: true });
		const latency = msg.createdTimestamp - interaction.createdTimestamp;
		const apiLatency = Math.round(client.ws.ping);

		interaction.editReply(`Pong! ${latency}ms`);
	},
};
