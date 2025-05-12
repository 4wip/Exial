const { PermissionsBitField, SlashCommandBuilder } = require('discord.js');

exports.commandBase = {
    prefixData: {
        name: 'renew',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('renew')
        .setDescription('recreate the channel'),
    cooldown: 3000, 
    ownerOnly: false,
    async prefixRun(client, message, args) {

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return message.reply("You don't have permission to Manage channels.");
        }

        const channel = message.channel;

        try {
            const cloned = await channel.clone({
                name: channel.name,
                permissions: channel.permissionOverwrites.cache,
                topic: channel.topic,
                nsfw: channel.nsfw,
                bitrate: channel.bitrate,
                userLimit: channel.userLimit,
                parent: channel.parent,
                position: channel.position,
                rateLimitPerUser: channel.rateLimitPerUser,
                reason: `Renewed by ${message.author.tag}`,
            });

            await cloned.setPosition(channel.position);

            await channel.delete(`Renewed by ${message.author.tag}`);

            return cloned.send(`Renewed by ${message.author}.`);
        } catch (error) {
            console.error(error);
            return message.reply("An error occurred while renew the channel");
        }
    },
    async slashRun(client, interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: "You don't have permission to Manage channels.", ephemeral: true });
        }

        const channel = interaction.channel;

        try {
            const cloned = await channel.clone({
                name: channel.name,
                permissions: channel.permissionOverwrites.cache,
                topic: channel.topic,
                nsfw: channel.nsfw,
                bitrate: channel.bitrate,
                userLimit: channel.userLimit,
                parent: channel.parent,
                position: channel.position,
                rateLimitPerUser: channel.rateLimitPerUser,
                reason: `Renewed by ${interaction.user.tag}`,
            });

            await cloned.setPosition(channel.position);

            await channel.delete(`Renewed by ${interaction.user.tag}`);

            return cloned.send(`Renewed by ${interaction.user}.`);
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: "An error occurred while renew the channel", ephemeral: true });
        }
    },
};
