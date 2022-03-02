const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addicon')
		.setDescription('Adds an icon to the list!')
		.addStringOption(option =>
			option.setName('url')
			.setDescription('Icon url to add to list')
			.setRequired(true)),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		const iconURL = interaction.options.getString('url', true);

		try {
			interaction.client.tables.get('icons').create({
				url: iconURL,
			});

			await interaction.reply('URL `' + iconURL + '` added');
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