const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delbanner')
		.setDescription('Deletes a banner from the list!')
		.addStringOption(option =>
			option.setName('url')
			.setDescription('Banner url to remove')
			.setRequired(true)),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		const bannerURL = interaction.options.getString('url', true);

		// equivalent to: DELETE from tags WHERE name = ?;
		const rowCount = await interaction.client.tables.get('banners').destroy({ where: { url: bannerURL } });

		if (!rowCount) return interaction.reply('That banner doesn\'t exist.');
		if(rowCount == 1) return interaction.reply('Banner deleted.');
		if(rowCount > 1) return interaction.reply('Banners deleted.');
		
	},
};