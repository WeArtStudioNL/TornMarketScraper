require('dotenv').config()
const token = process.env.TOKEN;
const guildId = process.env.GUILD;
const clientId = process.env.CLIENT;
const Keyv = require('keyv');



const { REST } = require('@discordjs/rest');
const fs = require('node:fs');
const path = require('node:path');
const { Client, GatewayIntentBits, Collection, Routes, SlashCommandBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages] });

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

client.on('messageCreate', function (message) {
	console.log(message);
	if (message.content === 'start') {
		message.author.send("Your message here.");
	}
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction === "start") {
		
	}

	if (interaction.commandName === 'echo') {
		const string = interaction.options.getString('input');
		await interaction.reply("You typed: " + string);
	}
	//if add item
	if (interaction.commandName === 'add') {
		const itemId = interaction.options.getString('itemid'); 
		await interaction.reply({ content: "Adding to watchlist: " + itemId, ephemeral: true });
		(async () => {
			var userdata = keyv.get(interaction.user.id);
			userdata.then(user => {
				user = JSON.parse(String(user));
				if (!user.watchlist) {
					user.watchlist = itemId;
				}
				console.log(user);
				const newWatchlist = keyv.set(interaction.user.id, JSON.stringify(user));
				console.log("Watchlist updated for user:" + interaction.user.id);
			}).catch(err => {
				console.log(err);
			});

		})();

	}

	if (interaction.commandName === 'register_api') {
		const api = interaction.options.getString('api');
		const dbUser = new Object();
		dbUser.api = api;
		dbUser.watchlist = new Object();
		await interaction.user.send("Trying to set api... " + api);
		(async () => {
			

			const newapi = keyv.set(interaction.user.id, dbUser);
				console.log("api for user " + interaction.user.id + " set.");

				var userdata = keyv.get(interaction.user.id);
				userdata.then(user => {
					user = user;
					console.log(user);
				}).catch(err => {
					console.log(err);
				});
			})();

	}
});

client.login(token);
