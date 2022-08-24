const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription('Greets you!'),
	execute: async (interaction) =>
	{
		await interaction.reply('Hello!');
	},
};
