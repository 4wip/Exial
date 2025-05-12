const {Collection, Events, InteractionType} = require('discord.js');
const cooldown = new Collection();
const config = require('../config.js');

module.exports = {
	name: Events.InteractionCreate,

	async execute(interaction) {
		const {client} = interaction;
		if (interaction.type === InteractionType.ApplicationCommand) {
			if (interaction.user.bot) {
				return;
			}

			try {
				const command = client.slashCommands.get(interaction.commandName);
				if (command.ownerOnly && interaction.user.id !== config.owner) {
					return interaction.reply({content: 'This command is not available.', ephemeral: true});
				}

				if (command.cooldown) {
					if (cooldown.has(`${command.name}-${interaction.user.id}`)) {
						const nowDate = interaction.createdTimestamp;
						const waitedDate = cooldown.get(`${command.name}-${interaction.user.id}`) - nowDate;
						return interaction.reply({
							content: `Try again in <t:${Math.floor(new Date(nowDate + waitedDate).getTime() / 1000)}:R>`,
							ephemeral: true,
						}).then(() => setTimeout(() => interaction.deleteReply(), cooldown.get(`${command.name}-${interaction.user.id}`) - Date.now() + 2000));
					}

					command.slashRun(client, interaction);

					cooldown.set(`${command.name}-${interaction.user.id}`, Date.now() + command.cooldown);

					setTimeout(() => {
						cooldown.delete(`${command.name}-${interaction.user.id}`);
					}, command.cooldown + 1000);
				} else {
					command.slashRun(client, interaction);
				}
			} catch (e) {
				console.error(e);
				interaction.reply({content: 'A problem was encountered while executing the command! Please try again.', ephemeral: true});
			}
		}
	},
};

