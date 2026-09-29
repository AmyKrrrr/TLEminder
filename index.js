const { Client, GatewayIntentBits, messageLink, ClientVoiceManager } = require('discord.js');
const { token } = require('./config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds, 
									  GatewayIntentBits.GuildMessages,
									  GatewayIntentBits.MessageContent] });
// intent ka matlab hota hai ki hum bot ko kis prakar ke conditions dere hain

// client.on('messageCreate', (message) => {
// 	// console.log(message.content);
// 	if(message.author.bot) return;
// 	message.reply({
// 		content: "Hii from TLEminder"
// 	})
// })

client.on('interactionCreate', (interaction) => {
	console.log(interaction.commandName);
	switch(interaction.commandName){
		case 'ping':
			interaction.reply("PONG!");
			break;
		default:
			interaction.reply("INVALID COMMAND");
			break;
	}
})

client.login(token);