const { EmbedBuilder } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { readdirSync, statSync } = require('fs');
const path = require('path');
const os = require('os');

exports.commandBase = {
    prefixData: {
        name: 'info',
        aliases: [],
    },
    slashData: new SlashCommandBuilder()
        .setName('info')
        .setDescription('shows info'),
    cooldown: 3000, // Cooldown of 3 seconds
    ownerOnly: false, // Not restricted to the owner
    async prefixRun(client, message, args) {
        const embed = await embedinfo(client);
        return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    },
    async slashRun(client, interaction) {
        const embed = await embedinfo(client);
        return interaction.reply({ embeds: [embed], ephemeral: false });
    },
};

function time(ms) {
    let seconds = Math.floor(ms / 1000);
    let days = Math.floor(seconds / (3600 * 24));
    let hours = Math.floor((seconds % (3600 * 24)) / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    return `${days} days ${hours} hours ${minutes} minutes`;
}

function commandnumber() {
    const commandPath = path.join(__dirname, '..'); 
    let totalFiles = 0;

    function readCommands(dir) {
        const files = readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (statSync(fullPath).isDirectory()) {
                readCommands(fullPath); 
            } else if (file.endsWith('.js')) {
                totalFiles++;
            }
        }
    }

    readCommands(commandPath);
    return totalFiles;
}

async function embedinfo(client) {
    const totalServers = client.guilds.cache.size; 
    const totalCommands = commandnumber(); 
    const shardId = client.shard ? client.shard.ids[0] : 0; 
    const totalShards = client.shard ? client.shard.count : 1; 
    const uptime = time(client.uptime); 
    const totalThreads = os.cpus().length;
    const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2); 
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2); 
    const ramPercentage = ((ramUsage / totalRam) * 100).toFixed(1); 

    const embed = new EmbedBuilder()
    .setTitle('Info')
    .addFields(
        { name: 'Stats', value: 
            `Servers: **${totalServers}**\n` +
            `Bot Commands: **${totalCommands}**\n` +
            `Shards (Offline): **${totalShards} (${shardId})**\n` +
            `Uptime: **${uptime}**\n` +
            `This Shard: **${shardId}**\n` +
            `Threads: **${totalThreads}**\n` +
            `RAM Usage: **${ramPercentage}%**\n` +
            `\n[Support Server](https://discord.gg/8xjtJPeVa6)`
        }
    )
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .setColor('#f9c0f7');

    return embed;
}
