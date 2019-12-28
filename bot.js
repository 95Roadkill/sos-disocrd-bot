const Settings = require("./bot-settings.json");
const Discord = require("discord.js");
const SourceQuery = require("sourcequery");

const prefix = Settings.prefix;
const token = process.env.token;

const bot = new Discord.Client({disbledEveryone: true});

let CommandUsed = false;

var Activities = {
	"Dabbing on them haters.",
	"Glassing reach.",
	"Kamuji is dead.",
	"Sometimes I dream about cheese.",
	"WORT WORT WORT."
}

var SQ = new SourceQuery(1000); // 1000ms timeout
SQ.open(Settings.IP, Settings.Port);



function Timeout(time){
	if (CommandUsed) return;
	CommandUsed = true
	setTimeout(() => {
		CommandUsed = false
	},time);
}

function FormatTime(Seconds){
	var hours = Math.floor(Seconds / 60 / 60);
	var minutes = Math.floor(Seconds / 60) - (hours * 60);
	return hours+"h : "+minutes+"m"
}

bot.on("ready", async () => {
	console.log(`Bot is online. ${bot.user.username}.`);
	
	setInterval(() => {
        const index = Math.floor(Math.random() * (Activities.length - 1) + 1); // generates a random number between 1 and the length of the activities array list (in this case 5).
        bot.user.setActivity(Activities[index], { type: "STREAMING", url: "https://www.twitch.tv/somethingluulop"}); // sets bot's activities to one of the phrases in the arraylist.
    }, 5000)

});

bot.on("message", async message => {
	if(message.author.bot) return;
	if(message.channel.type  === "dm") return;

	let messageArray = message.content.split(" ");
	let command = messageArray[0].toLowerCase();
	let args = messageArray.slice(1);

	if(!command.startsWith(prefix)) return;
	if (CommandUsed) return;

	if (message.channel.id != Settings.Channel){ // Command not in the right channel.
		message.channel.send(`Only use the bot commands in: <#${Settings.Channel}>. <@${message.author.id}>`);
		Timeout(Settings.Timeout);
		return;
	}

	if(command === `${prefix}help`){ // All the bot commands.
		const Embed = new Discord.RichEmbed()
    		.setTitle("Bot Commands")
    		.setColor('#800080')
    		.setThumbnail('https://revivalservers.com/home/assets/media/logos/main.png')
    		.addField(`${prefix}Help`,"Info on all the available commands.")
    		.addField(`${prefix}info`,"Get the HaloRPs server info.")
    		.addField(`${prefix}players`,"Get the details of every connected player.");
    	message.channel.send(Embed);
    	Timeout(Settings.Timeout);
	}

	if(command === `${prefix}info`){ // Server Info
		SQ.getInfo(function(err, info){
    		const Embed = new Discord.RichEmbed()
    		    .setTitle(info.name)
    			.setColor('#800080')
    			.setThumbnail('https://revivalservers.com/home/assets/media/logos/main.png')
    			.addField('Map',info.map, true)
    			.addField('Players', info.players +"/"+ info.maxplayers, true)
    			.setFooter(Settings.IP+":"+Settings.Port, 'https://revivalservers.com/home/assets/media/logos/main.png');
    		message.channel.send(Embed);
    		Timeout(Settings.Timeout);
		});
	}

	if(command === `${prefix}players`){ // Players Info
		var Players = ""
		var PlayerScore = ""
		var PlayerTime = ""
		SQ.getPlayers(function(err, info){
			for(var i=0; i < info.length - 1; i++){
				if (info[i].name != ""){
					Players = Players + info[i].name + "\n";
					PlayerScore = PlayerScore + info[i].score + "\n";
					PlayerTime = PlayerTime + FormatTime(info[i].online) + "\n";
				}
			}
			const Embed = new Discord.RichEmbed()
				.setTitle("Connected Players.")
    			.setColor('#800080')
    			.setThumbnail('https://revivalservers.com/home/assets/media/logos/main.png')
    			.addField('Players',Players, true)
    			.addField('Score', PlayerScore, true)
    			.addField('Time', PlayerTime, true);
    		message.channel.send(Embed);
    		Timeout(Settings.Timeout);
		});
	}
});

bot.login(token).catch(err => console.log(err));
//bot.login(Settings.token);
