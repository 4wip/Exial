const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

exports.commandBase = {
    prefixData: {
        name: 'kick',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('kick a member')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason')
                .setRequired(false)),
    cooldown: 3000, 
    ownerOnly: false, 
    async prefixRun(client, message, args) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return message.reply('You do not have permission to kick members.');
        }

        const user = message.mentions.users.first();
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!user) {
            return message.reply('Please mention a valid user to kick.');
        }

        const member = message.guild.members.cache.get(user.id);

        if (!member) {
            return message.reply('The user is not a member of this server.');
        }

        try {
            await member.kick(reason);
            const embed = new EmbedBuilder()
                .setDescription(`${user.tag} was kicked for \`${reason}\` by <@${message.author.id}>.`)
                .setColor('#f9c0f7')
            return message.reply({ embeds: [embed] });
        } catch (error) {
            return message.reply('There was an error trying to kick the user.');
        }
    },
    async slashRun(client, interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply('You do not have permission to kick members.');
        }

        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!user) {
            return interaction.reply('Please mention a valid user to kick.');
        }

        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply('The user is not a member of this server.');
        }

        try {
            await member.kick(reason);
            const embed = new EmbedBuilder()
                .setDescription(`${user.tag} was kicked for \`${reason}\` by <@${interaction.user.id}>.`)
                .setColor('#f9c0f7')
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            return interaction.reply('An error occurred while trying to kick the user.');
        }
    },
};

