const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

exports.commandBase = {
    prefixData: {
        name: 'unban',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('unban a member')
        .addStringOption(option =>
            option.setName('userid')
                .setDescription('The ID of the user to unban')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the unban')
                .setRequired(false)),
    cooldown: 3000,
    ownerOnly: false,
    async prefixRun(client, message, args) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('You do not have permission to unban members.');
        }

        const userId = args[0];
        const reason = args.slice(1).join(' ') || 'No reason provided';

        if (!userId) {
            return message.reply('Please provide the ID of the user to unban.');
        }

        try {
            const bannedUsers = await message.guild.bans.fetch();
            const bannedUser = bannedUsers.get(userId);

            if (!bannedUser) {
                return message.reply('This user is not banned.');
            }

            await message.guild.members.unban(userId, reason);
            const embed = new EmbedBuilder()
                .setDescription(`<@${userId}> was unbanned for \`${reason}\` by <@${message.author.id}>.`)
                .setColor('#f9c0f7');
            return message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return message.reply('There was an error trying to unban the user. Please ensure the ID is valid.');
        }
    },
    async slashRun(client, interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply('You do not have permission to unban members.');
        }

        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        if (!userId) {
            return interaction.reply('Please provide the ID of the user to unban.');
        }

        try {
            const bannedUsers = await interaction.guild.bans.fetch();
            const bannedUser = bannedUsers.get(userId);

            if (!bannedUser) {
                return interaction.reply('This user is not banned.');
            }

            await interaction.guild.members.unban(userId, reason);
            const embed = new EmbedBuilder()
                .setDescription(`<@${userId}> was unbanned for \`${reason}\` by <@${interaction.user.id}>.`)
                .setColor('#f9c0f7');
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.reply('There was an error trying to unban the user. Please ensure the ID is valid.');
        }
    },
};
