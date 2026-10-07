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

let cachedCfContests = null;
let cachedLcContests = null;

async function cacheRefresh() {
	cachedCfContests = await getCfContest();
	cachedLcContests = await getLcContest();
	console.log("Cache updated.");
}

async function sendDailyAnnouncements() {
	await cacheRefresh();
	
	const now = new Date();
	const date = now.getDate();
	const month = now.getMonth();
	const year = now.getFullYear();
		
	let msgCf = "";
	let msgLc = "";

	if(cachedCfContests){
		for(const [cName, cDate] of Object.entries(cachedCfContests)){
			if(
				cDate.getDate() === date &&
				cDate.getMonth() === month &&
				cDate.getFullYear() === year
			){
				msgCf += `\n- **${cName}** -- ${cDate.toLocaleString()}`;
			}
		}
	}
	
	if(cachedLcContests){
		for(const [cName, cDate] of Object.entries(cachedLcContests)){
			if(
				cDate.getDate() === date &&
				cDate.getMonth() === month &&
				cDate.getFullYear() === year
			){
				msgLc += `\n**${cName}** -- ${cDate.toLocaleString()}`;
			}
		}
	}	

	let finalMsg = "";

	if(msgCf !== "")
		finalMsg += `**Codeforces Contests Today**\n---${msgCf}\n\n`;
	if (msgLc !== "")
        finalMsg += `**Leetcode Contests Today**\n---${msgLc}\n`;

	if (finalMsg !== "") {
        client.guilds.cache.forEach(async (guild) => {
            const channel = guild.systemChannel || guild.channels.cache.find(c => c.type === 0);
            if (channel) {
                await channel.send(finalMsg);
            }
        });
    } 
	else {
        console.log("No contests today on either platform. No message sent.");
    }
}

client.once('ready', async () => {
	await sendDailyAnnouncements();

	setInterval(async () => {
		const now = new Date();
		const arr = now.toString().split(' ');
		
		if (arr[4] === "00:00:00") {
            await sendDailyAnnouncements();
    	}
    }, 1000);
})

client.on('interactionCreate', async (interaction) => {
	console.log(interaction.commandName);
	switch(interaction.commandName){
		case 'ping':
			interaction.reply("PONG!");
			break;

		case 'contest_cf':
			await interaction.deferReply();
			if (!cachedCfContests ||cachedCfContests.length === 0) {
				await interaction.editReply("Could not fetch contests or no upcoming contests available.");
				break;
			}
			let replyTextCF = "**Upcoming Codeforces Contests:**\n";
			const entriesCF = Object.entries(cachedCfContests).slice(0, 5);
			
			for (const [title, dateTime] of entriesCF) {
				replyTextCF += `- **${title}**: ${dateTime.toLocaleString()}\n`;
			}
			await interaction.editReply(replyTextCF);
			break;
			
		case 'contest_lc':
			await interaction.deferReply();
			if (!cachedLcContests || cachedLcContests.length === 0) {
				await interaction.editReply("Could not fetch contests or no upcoming contests available.");
				break;
			}
			let replyTextLC = "**Upcoming Leetcode Contests:**\n";
			const entriesLC = Object.entries(cachedLcContests).slice(0, 5);
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