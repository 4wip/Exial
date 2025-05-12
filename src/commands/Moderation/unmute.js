const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

exports.commandBase = {
    prefixData: {
        name: 'unmute',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('unmute a member')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to unmute')
                .setRequired(true)),
    cooldown: 3000,
    ownerOnly: false,
    async prefixRun(client, message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply('You do not have permission to unmute members.');
        }

        const user = message.mentions.users.first();

        if (!user) {
            return message.reply('Please mention a valid user to unmute.');
        }

        const member = message.guild.members.cache.get(user.id);

        if (!member) {
            return message.reply('The user is not a member of this server.');
        }

        try {
            await member.timeout(null);
            const embed = new EmbedBuilder()
                .setDescription(`<@${user.id}> has been unmuted by <@${message.author.id}>.`)
                .setColor('#f9c0f7');
            return message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return message.reply('There was an error trying to unmute the user.');
        }
    },
    async slashRun(client, interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply('You do not have permission to unmute members.');
        }

        const user = interaction.options.getUser('user');
        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply('The user is not a member of this server.');
        }

        try {
            await member.timeout(null);
            const embed = new EmbedBuilder()
                .setDescription(`<@${user.id}> has been unmuted by <@${interaction.user.id}>.`)
                .setColor('#f9c0f7');
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.reply('There was an error trying to unmute the user.');
        }
    },
};
