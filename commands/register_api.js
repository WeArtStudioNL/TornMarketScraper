const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('register_api')
		.setDescription('Registers your Torn API key.')
		.addStringOption(option =>
			option.setName('api')
				.setDescription('The input to echo back')
				.setRequired(true))
};