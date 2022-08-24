require('dotenv').config()
const token = process.env.TOKEN;
const guildId = process.env.GUILD;
const clientId = process.env.CLIENT;
const Keyv = require('keyv');


const { REST } = require('@discordjs/rest');
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages] });

client.commands = new Collection();

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const keyv = new Keyv('mysql://' + process.env.DBUSER + ':' + process.env.DBPASS + '@glennhofman.nl:3306/tmsd_');

keyv.on('error', err => console.error('Keyv connection error:', err));


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

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === 'echo') {
		const string = interaction.options.getString('input');
		await interaction.reply("You typed: " + string);
	}
});

client.login(token);
