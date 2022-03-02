const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('A help command, obvs!'),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		let helpText = 'I am a simple music bot!';
		helpText += '\nMy commands are as follows';
		helpText += '\n/help - shows this help command';
		helpText += '\n/addicon <icon url> - Adds an icon to the list';
		helpText += '\n/delicon <icon url> - Deletes an icon from the list';
		helpText += '\n/showicons - Shows the icons in the list';
		helpText += '\n/changeicon <icon url> - Changes the current server icon';
		helpText += '\n/addbanner <banner url> - Adds a banner to the list';
		helpText += '\n/delbanner <banner url> - Deletes a banner from the list';
		helpText += '\n/showbanners - Shows the banners in the list';
		helpText += '\n/changebanner <banner url> - Changes the current server banner';

		await interaction.reply(helpText);
	},
};