const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Add an item to your watchlist')
		.addStringOption(option =>
			option.setName('itemId')
				.setDescription('The item ID')
				.setRequired(true))
};