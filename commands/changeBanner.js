const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('changebanner')
		.setDescription('Changes the current server banner!')
		.addStringOption(option =>
			option.setName('url')
			.setDescription('Banner url to change to')
			.setRequired(true)),
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		const BoostCount = interaction.guild.premiumSubscriptionCount;
		if(BoostCount < 7) return;

		const bannerURL = interaction.options.getString('url', true);

		interaction.guild.setBanner(bannerURL).then(updated => {
			return interaction.reply('Icon changed.')
		}).catch(error => {
			console.log(error);
			return interaction.reply('Something went wrong changing the banner')
		});
	},
};