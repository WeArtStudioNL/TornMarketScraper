const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add')
		.setDescription('Add an item to your watchlist')
		.addStringOption(option =>
			option.setName('itemid')
				.setDescription('The item ID')
				.setRequired(true))
};