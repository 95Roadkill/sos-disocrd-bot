const Settings = require("./bot-settings.json");
const Ranks = require("./sos-ranks.json");
const Discord = require("discord.js");
const SourceQuery = require("sourcequery");

const prefix = Settings.prefix;
const token = process.env.token;

const bot = new Discord.Client({disbledEveryone: true});

let CommandUsed = false;

var Activities = [
	"Dabbing on them haters.",
	"Glassing reach.",
	"Kamuji is dead.",
	"Sometimes I dream about cheese.",
	"WORT WORT WORT.",
	"Carnifex for Arbiter",
	"Raiding the Generator room.",
	"Entering SS bunks.",
	"Throwing Wallets at William.",
	"Spanking some Monkeys.",
	"Stealing Mreze's wives.",
	"Searching for Chesquik",
	"Eating ice cubes.",
	"Cooking Humans.",
	"Healing in the FFA.",
	"Watching ONI eat babies.",
	"Killing Civilians",
	"Surrendering the AI.",
	"Blood dueling a Minor.",
	"Killing Recruits.",
	"Asking for promotions",
	"Eating Ramen.",
	"Deleting Vel'ket.",
	"Feeding Flood."
]

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
    }, 10000)

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
    		.addField(`${prefix}players`,"Get the details of every connected player.")
    		.addField(`${prefix}ranks`,"See all Species ranks.");
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
	
	if(command === `${prefix}ranks`) { 
		const filter = (reaction,user)=> [`🦎`,'🐒','🐛','🐝','🦃','🦥'].includes(reaction.emoji.name) && user.id === message.author.id;
		let myembed = new Discord.RichEmbed() 
			.setTitle('Ranks') 
			.setColor('#800080') 
			.setDescription('Click a reaction for the respected ranks.') 
			.addField("Species", "Sangheili \n Jiralhanae \n Mgalekgolo \n Yanme'e \n Kig-Yar \n Unngoy",true)
			.addField("Reactions", ":lizard: \n :monkey: \n :bug: \n :bee: \n :turkey: \n :sloth:",true) 
			.setThumbnail("https://revivalservers.com/home/assets/media/logos/main.png") 
		message.channel.send(myembed).then(async msg =>{
			await msg.react(`🦎`);
			await msg.react(`🐒`);
			await msg.react(`🐛`);
			await msg.react(`🐝`);
			await msg.react(`🦃`);
			await msg.react(`🦥`);

			msg.awaitReactions(filter, {
				max: 1,
				time: 15000,
				errors: [`time`]
			}).then(collected => {
				const reaction = collected.first();
				switch (reaction.emoji.name){
					case '🦎':
						let Sang = new Discord.RichEmbed() 
							.setTitle('Sangheili Ranks.')
							.setColor('#800080')
							.setThumbnail('https://www.halopedia.org/images/7/73/H2A_Sangheili_Ultra_2.png')
							.addField("Ranks",Ranks.SangheiliRanks,true)
							.addField("Cooldowns",Ranks.SangheiliCooldown,true);
						message.channel.send(Sang);
						msg.delete();
					break;
					case '🐒':
						let Jiral = new Discord.RichEmbed() 
							.setTitle('Jiralhanae Ranks.')
							.setColor('#800080')
							.setThumbnail('https://www.halopedia.org/images/thumb/9/93/H2A_Jiralhanae.png/338px-H2A_Jiralhanae.png')
							.addField("Ranks",Ranks.JiralhanaeRanks,true)
							.addField("Cooldowns",Ranks.JiralhanaeCooldown,true);
						message.channel.send(Jiral);
						msg.delete();
					break;
					case '🐛':
						let Mgal = new Discord.RichEmbed() 
							.setTitle('Mgalekgolo Ranks.')
							.setColor('#800080')
							.setThumbnail('https://www.halopedia.org/images/thumb/c/c3/H5G-MgalekgoloHunter.png/486px-H5G-MgalekgoloHunter.png')
							.addField("Ranks",Ranks.MgalekgoloRanks,true)
							.addField("Cooldowns",Ranks.MgalekgoloCooldown,true);
						message.channel.send(Mgal);
						msg.delete();
					break;
					case '🐝':
						let Yanm = new Discord.RichEmbed() 
							.setTitle("Yanme'e Ranks.")
							.setColor('#800080')
							.setThumbnail('https://www.halopedia.org/images/thumb/e/e5/Yanmee_H2A.png/617px-Yanmee_H2A.png')
							.addField("Ranks",Ranks.YanmeeRanks,true)
							.addField("Cooldowns",Ranks.YanmeeCooldown,true);
						message.channel.send(Yanm);
						msg.delete();
					break;
					case '🦃':
						let Kigyar = new Discord.RichEmbed() 
							.setTitle("Kig-Yar Ranks.")
							.setColor('#800080')
							.setThumbnail('https://www.halopedia.org/images/thumb/7/72/JackalMinor.png/387px-JackalMinor.png')
							.addField("Ranks",Ranks.KigYarRanks,true)
							.addField("Cooldowns",Ranks.KigYarCooldown,true);
						message.channel.send(Kigyar);
						msg.delete();
					break;
					case '🦥':
						let Unngoy = new Discord.RichEmbed() 
							.setTitle("Unngoy Ranks.")
							.setColor('#800080')
							.setThumbnail('https://www.halopedia.org/images/thumb/0/0b/H2A_Unggoy.png/554px-H2A_Unggoy.png')
							.addField("Ranks",Ranks.UnngoyRanks,true)
							.addField("Cooldowns",Ranks.UnngoyCooldown,true);
						message.channel.send(Unngoy);
						msg.delete();
					break;
				}
			}).catch(() => {
				msg.delete();
			});
		});
		Timeout(Settings.Timeout);
	}

	if(command === `${prefix}players`){ // Players Info
		var Players = "```"
		var PlayerScore = "```"
		var PlayerTime = "```"
		SQ.getPlayers(function(err, info){
			for(var i=0; i < info.length - 1; i++){
				if (info[i].name != ""){
					Players = Players + (i+1) + " : " + info[i].name + "\n";
					PlayerScore = PlayerScore + info[i].score + "\n";
					PlayerTime = PlayerTime + FormatTime(info[i].online) + "\n";
				}
			}
			
			Players = Players + "````"
			PlayerScore = PlayerScore + "````"
			PlayerTime = PlayerTime + "````"

			const Embed = new Discord.RichEmbed()
				.setTitle("Connected Players:")
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
