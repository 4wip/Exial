const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

exports.commandBase = {
	prefixData: {
		name: 'test',
		aliases: [],
	},
	slashData: new SlashCommandBuilder()
		.setName('name')
		.setDescription('description'),
	// If you want to improve the command guide: https://discordjs.guide/slash-commands/advanced-creation.html
	cooldown: 3000, // 1 second = 1000 ms / type 0 if you don't want it to be cooldown.
	ownerOnly: false, // Change to true if you want the command to be available only to the developer
	async prefixRun(client, message, args) {

	},
	async slashRun(client, interaction) {

	},
};
