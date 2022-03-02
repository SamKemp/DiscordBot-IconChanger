const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('changeicon')
		.setDescription('Changes the current server icon!')
		.addStringOption(option =>
			option.setName('url')
			.setDescription('Icon url to change to')
			.setRequired(true)),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		const iconURL = interaction.options.getString('url', true);

		interaction.guild.setIcon(iconURL).then(updated => {
			return interaction.reply('Icon changed.')
		}).catch(error => {
			console.log(error);
			return interaction.reply('Something went wrong changing the icon')
		});
	},
};