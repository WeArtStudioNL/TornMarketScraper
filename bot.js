require('dotenv').config()
const { REST } = require('@discordjs/rest');
const fs = require('node:fs');
const { Client, GatewayIntentBits, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const token = process.env.TOKEN;
const guildId = process.env.GUILD;
const clientId = process.env.CLIENT;

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(token);

client.once('ready', () => {
	console.log('Ready!');
});

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

client.login(token);
