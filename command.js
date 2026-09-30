const { REST, Routes } = require('discord.js');
const { token, clientId } = require('./config.json');

const commands = [
    {
        name: "ping",
        description: "Replies with pong",
    },
	{
		name: "contest_cf",
		description: "Lists out upcoming contests",	
	},
];

const rest = new REST({version: "10"}).setToken(token);

(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(Routes.applicationCommands(clientId), { body: commands });
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();