const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('showbanners')
		.setDescription('Shows the banners in the list!'),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		const tagList = await interaction.client.tables.get('banners').findAll({ attributes: ['url'] });
		const tagString = tagList.map(t => t.url).join('\n') || 'No banners set.';

		return interaction.reply('List of banners:\n```' + tagString + '```');
	},
};