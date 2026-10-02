const { Client, GatewayIntentBits, messageLink, ClientVoiceManager } = require('discord.js');
const { token } = require('./config.json');
const { getCfContest } = require('./cf');
const { getLcContest } = require('./lc');
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
			const contestDictCF = await getCfContest();
			if (!contestDictCF || contestDictCF.length === 0) {
				await interaction.editReply("Could not fetch contests or no upcoming contests available.");
				break;
			}
			let replyTextCF = "**Upcoming Codeforces Contests:**\n";
			const entriesCF = Object.entries(contestDictCF).slice(0, 5);
			
			for (const [title, dateTime] of entriesCF) {
				replyTextCF += `- **${title}**: ${dateTime}\n`;
			}
			await interaction.editReply(replyTextCF);
			break;
			
		case 'contest_lc':
			await interaction.deferReply();
			const contestDictLC = await getLcContest();
			if (!contestDictLC || contestDictLC.length === 0) {
				await interaction.editReply("Could not fetch contests or no upcoming contests available.");
				break;
			}
			let replyTextLC = "**Upcoming Leetcode Contests:**\n";
			const entriesLC = Object.entries(contestDictLC).slice(0, 5);
			for (const [title, dateTime] of entriesLC) {
				replyTextLC += `- **${title}**: ${dateTime}\n`;
			}
			await interaction.editReply(replyTextLC);
			break;
		default:
			interaction.reply("INVALID COMMAND");
			break;
	}
})

client.login(token);