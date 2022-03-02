const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delicon')
		.setDescription('Deletes an icon from the list!')
		.addStringOption(option =>
			option.setName('url')
			.setDescription('Icon url to remove')
			.setRequired(true)),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		const iconURL = interaction.options.getString('url', true);

		// equivalent to: DELETE from tags WHERE name = ?;
		const rowCount = await interaction.client.tables.get('icons').destroy({ where: { url: iconURL } });

		if (!rowCount) return interaction.reply('That icon doesn\'t exist.');
		if(rowCount == 1) return interaction.reply('Icon deleted.');
		if(rowCount > 1) return interaction.reply('Icons deleted.');
		
	},
};