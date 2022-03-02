const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('showicons')
		.setDescription('Shows the icons in the list!'),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		const tagList = await interaction.client.tables.get('icons').findAll({ attributes: ['url'] });
		const tagString = tagList.map(t => t.url).join('\n') || 'No icons set.';

		return interaction.reply('List of icons:\n```' + tagString + '```');
	},
};