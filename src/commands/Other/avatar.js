const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

exports.commandBase = {
	prefixData: {
		name: 'avatar',
		aliases: [],
	},
	slashData: new SlashCommandBuilder()
		.setName('avatar')
		.setDescription('shows a user\'s profile picture')
		.addUserOption(option => 
			option.setName('user')
				.setDescription('shh')
				.setRequired(false) // Option is not required, defaults to the command user if none provided
		),
	cooldown: 3000, // 1 second = 1000 ms / type 0 if you don't want it to be cooldown.
	ownerOnly: false, // Change to true if you want the command to be available only to the developer
	async prefixRun(client, message, args) {
		let user = message.mentions.users.first() || (args[0] ? await client.users.fetch(args[0]).catch(() => null) : message.author);

		if (!user) {
			return message.reply({ content: "The user doesn't exist", allowedMentions: { repliedUser: false } });
		}
		const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });
	
		const embed = new EmbedBuilder()
			.setTitle(`${user.username}`)
			.setImage(avatarURL)
			.setColor("#f9c0f7");

		return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
	},
	async slashRun(client, interaction) {
		let user = interaction.options.getUser('user') || interaction.user;

		const avatarURL = user.displayAvatarURL({ dynamic: true, size: 1024 });
	
		const embed = new EmbedBuilder()
			.setTitle(`${user.username}`)
			.setImage(avatarURL)
			.setColor("#f9c0f7");

		return interaction.reply({ embeds: [embed], ephemeral: false });
	},
};
