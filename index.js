const { Client, GatewayIntentBits, messageLink, ClientVoiceManager } = require('discord.js');
const { token } = require('./config.json');
const { getCfContest } = require('./cf');
const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds, 
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent
	] 
});
// intent ka matlab hota hai ki hum bot ko kis prakar ke conditions dere hain

// client.on('messageCreate', (message) => {
// 	// console.log(message.content);
// 	if(message.author.bot) return;
// 	message.reply({
// 		content: "Hii from TLEminder"
// 	})
// })

client.on('interactionCreate', async (interaction) => {
	console.log(interaction.commandName);
	switch(interaction.commandName){
		case 'ping':
			interaction.reply("PONG!");
			break;
			case 'contest_cf':
				await interaction.deferReply();
			const contestDict = await getCfContest();
			if (!contestDict || contestDict.length === 0) {
                await interaction.editReply("Could not fetch contests or no upcoming contests available.");
                break;
            }
			let replyText = "**Upcoming Codeforces Contests:**\n";
			const entries = Object.entries(contestDict).slice(0, 5);
            
            for (const [title, dateTime] of entries) {
				replyText += `- **${title}**: ${dateTime}\n`;
            }
			await interaction.editReply(replyText);
			break;
			default:
				interaction.reply("INVALID COMMAND");
			break;
	}
})

client.login(token);