const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

exports.commandBase = {
    prefixData: {
        name: 'purge',
        aliases: ['clear'],
    },
    slashData: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Delete messages from a channel')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('How many messages to delete ?')
                .setRequired(true)
        ),
    cooldown: 5000, 
    ownerOnly: false, 
    async prefixRun(client, message, args) {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return message.channel.send("You don't have permission to manage messages.");
        }

        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 1 || amount > 1000) {
            return message.channel.send("The number of messages must be between 1 and 1000.");
        }

        try {
            await message.delete(); 
            const fetchedMessages = await message.channel.bulkDelete(amount, true); 
            return message.channel.send(`${fetchedMessages.size} messages have been deleted.`).then(msg => {setTimeout(() => msg.delete(), 3000);});

        } catch (error) {
            console.error(error);
            return message.channel.send("An error has occurred while deleting messages.");
        }
    },
    async slashRun(client, interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: "You don't have permission to manage messages.", ephemeral: true });
        }

        const amount = interaction.options.getInteger('amount');
        if (amount < 1 || amount > 1000) {
            return interaction.reply({ content: "The number of messages must be between 1 and 1000.", ephemeral: true });
        }

        try {
            const fetchedMessages = await interaction.channel.bulkDelete(amount, true); 
            return interaction.reply({ content: `${fetchedMessages.size} messages have been deleted.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            return interaction.reply({ content: "An error has occurred while deleting messages.", ephemeral: true });
        }
    },
};

