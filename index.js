const { bot_token, clientId, guildId, Icon_delay, Banner_delay } = require('./config.json');

const { Client, Collection, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const Sequelize = require('sequelize');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();
client.menus = new Collection();
client.buttons = new Collection();

// Initialize database
client.sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});
client.tables = new Collection();

client.tables.set('icons', client.sequelize.define('icons', {
	id: {
		type: Sequelize.INTEGER,
		unique: true,
		primaryKey: true,
		autoIncrement: true
	},
	url: {
		type: Sequelize.STRING,
		unique: false
	}
}))
var SetIcon = 0;

client.tables.set('banners', client.sequelize.define('banners', {
	id: {
		type: Sequelize.INTEGER,
		unique: true,
		primaryKey: true,
		autoIncrement: true
	},
	url: {
		type: Sequelize.STRING,
		unique: false
	}
}))
var SetBanner = 0;

// Scan for and register commands
ScanCommands('commands', client.commands, true, false);

// Scan for and register events
ScanEvents('events', client);

// Bot Login
console.log(' ');
client.login(bot_token);

if(Icon_delay > 0)
{
	setInterval(ChangeIcon_Timer, Icon_delay*1000);
}
if(Banner_delay > 0)
{
	setInterval(ChangeBanner_Timer, Banner_delay*1000);
}

function ScanFor(dir, clientSet) {
	const files = fs.readdirSync('./' + dir).filter(file => file.endsWith('.js'));

	for (const file of files) {
		const item = require('./' + dir + '/' + file);
		// Set a new item in the Collection
		// With the key as the menu name and the value as the exported module
		clientSet.set(item.data.name, item);
	}
}

function ScanCommands(dir, clientSet, devel = true, prod = false) {
	const commands = [];

	const files = fs.readdirSync('./' + dir).filter(file => file.endsWith('.js'));
	
	for (const file of files) {
		const item = require('./' + dir + '/' + file);
		// Set a new item in the Collection
		// With the key as the command name and the value as the exported module
		clientSet.set(item.data.name, item);
		commands.push(item.data.toJSON());
	}

	const rest = new REST({ version: '9' }).setToken(bot_token);

	// Register (/) commands
	(async () => {
		try {
			console.log('Started refreshing application (/) commands.');

			// Development guild commands
			if(devel) {
				await rest.put(
					Routes.applicationGuildCommands(clientId, guildId),
					{ body: commands },
				);
			}

			// Production global commands
			if(prod) {
				await rest.put(
					Routes.applicationCommands(clientId),
					{ body: commands },
				);
			}

			console.log('Successfully reloaded application (/) commands.');
		}
		catch (error) {
			console.error(error);
		}
	})();
}

function ScanEvents(dir, client) {
	const files = fs.readdirSync('./' + dir).filter(file => file.endsWith('.js'));

	for (const file of files) {
		const item = require('./' + dir + '/' + file);
		if (item.once) {
			client.once(item.name, (...args) => item.execute(...args));
		}
		else {
			client.on(item.name, (...args) => item.execute(...args));
		}
	}
}

async function ChangeIcon_Timer()
{
	const { count, rows } = await client.tables.get('icons').findAndCountAll();
	if(count == 0) return;

    client.guilds.cache.get(guildId)?.setIcon(rows[SetIcon].url)
    .catch(console.error);

    SetIcon++;
    if(SetIcon >= count)
    {
        SetIcon = 0;
    }
}

async function ChangeBanner_Timer()
{
	const BoostCount = client.guilds.cache.get(guildId)?.premiumSubscriptionCount;
	if(BoostCount < 7) return;

	const { count, rows } = await client.tables.get('banners').findAndCountAll();
	if(count == 0) return;

	client.guilds.cache.get(guildId)?.setBanner(rows[SetBanner].url)
	.catch(console.error);

	SetBanner++;
	if(SetBanner >= count)
	{
		SetBanner = 0;
	}
}