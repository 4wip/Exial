const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

exports.commandBase = {
    prefixData: {
        name: 'mute',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('mute a member')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user to mute')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('The duration (e.g., 10m, 1h, 1d)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('The reason for the mute')
                .setRequired(false)),
    cooldown: 3000,
    ownerOnly: false,
    async prefixRun(client, message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return message.reply('You do not have permission to mute members.');
        }

        const user = message.mentions.users.first();
        const durationInput = args[1];
        const reason = args.slice(2).join(' ') || 'No reason provided';

        if (!user) {
            return message.reply('Please mention a valid user to mute.');
        }

        const member = message.guild.members.cache.get(user.id);

        if (!member) {
            return message.reply('The user is not a member of this server.');
        }

        const durationMs = parseDuration(durationInput);
        if (!durationMs) {
            return message.reply('Invalid duration format. Use "10m", "1h", or "1d".');
        }

        try {
            await member.timeout(durationMs, reason);
            const embed = new EmbedBuilder()
                .setDescription(`<@${user.id}> has been muted for \`${durationInput}\` by <@${message.author.id}>.\nReason: \`${reason}\``)
                .setColor('#f9c0f7');
            return message.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return message.reply('There was an error trying to mute the user.');
        }
    },
    async slashRun(client, interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply('You do not have permission to mute members.');
        }

        const user = interaction.options.getUser('user');
        const durationInput = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const member = interaction.guild.members.cache.get(user.id);

        if (!member) {
            return interaction.reply('The user is not a member of this server.');
        }

        const durationMs = parseDuration(durationInput);
        if (!durationMs) {
            return interaction.reply('Invalid duration format. Use "10m", "1h", or "1d".');
        }

        try {
            await member.timeout(durationMs, reason);
            const embed = new EmbedBuilder()
                .setDescription(`<@${user.id}> has been muted for \`${durationInput}\` by <@${interaction.user.id}>.\nReason: \`${reason}\``)
                .setColor('#f9c0f7');
            return interaction.reply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            return interaction.reply('There was an error trying to mute the user.');
        }
    },
};

function parseDuration(input) {
    const match = input.match(/^(\d+)([smhd])$/);
    if (!match) return null;

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case 's': return value * 1000; 
        case 'm': return value * 60 * 1000; 
        case 'h': return value * 60 * 60 * 1000; 
        case 'd': return value * 24 * 60 * 60 * 1000; 
        default: return null;
    }
}
