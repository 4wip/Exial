const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

const categoryDescriptions = {
    info: "Description: info commands",
    other: "Description: special commands",
    moderation: "Description: moderation commands",
};

exports.commandBase = {
    prefixData: {
        name: 'help',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('help')
        .setDescription("shows help for commands"),
    cooldown: 3000,
    ownerOnly: false,

    async prefixRun(bot, message, args, config) {
        const commandsPath = path.join(__dirname, '../'); 
        const categories = fs.readdirSync(commandsPath); 

        const fields = categories.map(category => {
            const categoryPath = path.join(commandsPath, category);
            if (!fs.statSync(categoryPath).isDirectory()) return null; 

            const commands = fs.readdirSync(categoryPath)
                .filter(file => file.endsWith('.js'))
                .map(file => file.replace('.js', '')); 

            const description = categoryDescriptions[category.toLowerCase()] || " ";

            return {
                name: `**${(category)}**`,
                value: `${description}\n${commands.length ? `\`${commands.join('`, `')}\`` : " "}`,
            };
        }).filter(field => field !== null);

        const embed = new EmbedBuilder()
            .setTitle('Exial - Commands')
            .addFields(fields) 
            .setColor("#f9c0f7");

        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    },
    
    async slashRun(bot, interaction, config) {
        const commandsPath = path.join(__dirname, '../');
        const categories = fs.readdirSync(commandsPath);  

        const fields = categories.map(category => {
            const categoryPath = path.join(commandsPath, category);
            if (!fs.statSync(categoryPath).isDirectory()) return null; 

            const commands = fs.readdirSync(categoryPath)
                .filter(file => file.endsWith('.js'))
                .map(file => file.replace('.js', ''));

            const description = categoryDescriptions[category.toLowerCase()] || " ";

            return {
                name: `**${(category)}**`, 
                value: `${description}\n${commands.length ? `\`${commands.join('`, `')}\`` : " "}`,
            };
        }).filter(field => field !== null); 

        const embed = new EmbedBuilder()
            .setTitle('Exial - Commands')
            .addFields(fields) 
            .setColor("#f9c0f7");

        interaction.reply({ embeds: [embed] });
    },
};

