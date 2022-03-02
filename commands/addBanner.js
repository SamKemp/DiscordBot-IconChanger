const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addbanner')
		.setDescription('Adds a banner to the list!')
		.addStringOption(option =>
			option.setName('url')
			.setDescription('Banner url to add to list')
			.setRequired(true)),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		const bannerURL = interaction.options.getString('url', true);

		try {
			interaction.client.tables.get('banners').create({
				url: bannerURL,
			});

			await interaction.reply('URL `' + bannerURL + '` added');
		}
		catch (error) {

			if (error.name === 'SequelizeUniqueConstraintError') {
				return interaction.reply('That tag already exists.');
			}

			console.log(error);
			return interaction.reply('Something went wrong with adding a tag.');
		}
	},
};