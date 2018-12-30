const Discord = require("discord.js");
const ytdl = require("ytdl-core");
const { Client, Util } = require('discord.js');
const fs = require('fs');
const getYoutubeID = require('get-youtube-id');
const moment = require('moment');
const db = require('quick.db');
const client = new Discord.Client();  
const giphy = require('giphy-api')();    
const googl = require('goo.gl');  
const translate = require('google-translate-api');  
const UserBlocked = new Set();
const jimp = require('jimp');  
const math = require('math-expression-evaluator');
const stripIndents = require('common-tags').stripIndents;
const figlet = require('figlet');
const google = require('google-it');
const queue = new Map();
const zalgo = require('zalgolize');  
const fetchVideoInfo = require('youtube-info');
const YouTube = require('simple-youtube-api');
const youtube = new YouTube("AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8");
const sql = require("sqlite");
 const dateFormat = require('dateformat');
 const pretty = require('pretty-ms')
const sWlc = {}
 
 
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`in ${client.guilds.size} servers `)
    console.log(`[Codes] ${client.users.size}`)
    client.user.setStatus("idle")
});
//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
const prefix = "Z"
client.on('message', async msg => { // eslint-disable-line
    if (msg.author.bot) return undefined;
    //by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    if (!msg.content.startsWith(prefix)) return undefined;
    const args = msg.content.split(' ');
    const searchString = args.slice(1).join(' ');
    //by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';
    const serverQueue = queue.get(msg.guild.id);
//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    let command = msg.content.toLowerCase().split(" ")[0];
    command = command.slice(prefix.length)
//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    if (command === `play`) {
        const voiceChannel = msg.member.voiceChannel;
        if (!voiceChannel) return msg.channel.send('يجب توآجد حضرتك بروم صوتي .');
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has('CONNECT')) {
            //by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
            return msg.channel.send('لا يتوآجد لدي صلاحية للتكلم بهذآ الروم');
        }//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        if (!permissions.has('SPEAK')) {
            return msg.channel.send('لا يتوآجد لدي صلاحية للتكلم بهذآ الروم');
        }//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
 
        if (!permissions.has('EMBED_LINKS')) {
            return msg.channel.sendMessage("**يجب توآفر برمشن `EMBED LINKS`لدي **")
        }
 
        if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await youtube.getPlaylist(url);
            const videos = await playlist.getVideos();
            //by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
            for (const video of Object.values(videos)) {
                const video2 = await youtube.getVideoByID(video.id); // eslint-disable-line no-await-in-loop
                await handleVideo(video2, msg, voiceChannel, true); // eslint-disable-line no-await-in-loop
            }//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
            return msg.channel.send(` **${playlist.title}** تم الإضآفة إلى قأئمة التشغيل`);
        } else {
            try {//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
 
                var video = await youtube.getVideo(url);
            } catch (error) {
                try {//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
                    var videos = await youtube.searchVideos(searchString, 5);
                    let index = 0;
                    const embed1 = new Discord.RichEmbed()
                    .setDescription(`**الرجآء من حضرتك إختيآر رقم المقطع** :
${videos.map(video2 => `[**${++index} **] \`${video2.title}\``).join('\n')}`)
//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
                    .setFooter("Galaxy")
                    msg.channel.sendEmbed(embed1).then(message =>{message.delete(20000)})
                   
                    // eslint-disable-next-line max-depth
                    try {
                        var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {
                            maxMatches: 1,
                            time: 15000,
                            errors: ['time']
                        });//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
                    } catch (err) {
                        console.error(err);
                        return msg.channel.send('لم يتم إختيآر مقطع صوتي');
                    }
                    const videoIndex = parseInt(response.first().content);
                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
                } catch (err) {
                    console.error(err);
                    return msg.channel.send(':X: لا يتوفر نتآئج بحث ');
                }
            }//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
 
            return handleVideo(video, msg, voiceChannel);
        }//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    } else if (command === `skip`) {
        if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .');
        if (!serverQueue) return msg.channel.send('لا يتوفر مقطع لتجآوزه');
        serverQueue.connection.dispatcher.end('تم تجآوز هذآ المقطع');
        return undefined;
    } else if (command === `stop`) {//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .');
        if (!serverQueue) return msg.channel.send('لا يتوفر مقطع لإيقآفه');
        serverQueue.songs = [];
        serverQueue.connection.dispatcher.end('تم إيقآف هذآ المقطع');
        return undefined;
    } else if (command === `vol`) {
        if (!msg.member.voiceChannel) return msg.channel.send('أنت لست بروم صوتي .');
        if (!serverQueue) return msg.channel.send('لا يوجد شيء شغآل.');
        if (!args[1]) return msg.channel.send(`:loud_sound: مستوى الصوت **${serverQueue.volume}**`);
        serverQueue.volume = args[1];//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 50);
        return msg.channel.send(`:speaker: تم تغير الصوت الي **${args[1]}**`);
    } else if (command === `np`) {
        if (!serverQueue) return msg.channel.send('لا يوجد شيء حالي ف العمل.');
        const embedNP = new Discord.RichEmbed()
    .setDescription(`:notes: الان يتم تشغيل : **${serverQueue.songs[0].title}**`)
        return msg.channel.sendEmbed(embedNP);
    } else if (command === `queue`) {
        //by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        if (!serverQueue) return msg.channel.send('لا يوجد شيء حالي ف العمل.');
        let index = 0;
        //by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        const embedqu = new Discord.RichEmbed()
//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
.setDescription(`**Songs Queue**
${serverQueue.songs.map(song => `**${++index} -** ${song.title}`).join('\n')}
**الان يتم تشغيل** ${serverQueue.songs[0].title}`)
        return msg.channel.sendEmbed(embedqu);
    } else if (command === `pause`) {
        if (serverQueue && serverQueue.playing) {
            serverQueue.playing = false;
            serverQueue.connection.dispatcher.pause();
            return msg.channel.send('تم إيقاف الموسيقى مؤقتا!');
        }//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        return msg.channel.send('لا يوجد شيء حالي ف العمل.');
    } else if (command === "resume") {
        if (serverQueue && !serverQueue.playing) {
            serverQueue.playing = true;
            serverQueue.connection.dispatcher.resume();
            return msg.channel.send('استأنفت الموسيقى بالنسبة لك !');
        }//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        return msg.channel.send('لا يوجد شيء حالي في العمل.');
    }
 
    return undefined;
});
//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
async function handleVideo(video, msg, voiceChannel, playlist = false) {
    const serverQueue = queue.get(msg.guild.id);
    console.log(video);
    //by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
//  console.log('yao: ' + Util.escapeMarkdown(video.thumbnailUrl));
    const song = {
        id: video.id,
        title: Util.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`
    };//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    if (!serverQueue) {
        const queueConstruct = {
            textChannel: msg.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        queue.set(msg.guild.id, queueConstruct);
//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        queueConstruct.songs.push(song);
//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            play(msg.guild, queueConstruct.songs[0]);
        } catch (error) {
            console.error(`I could not join the voice channel: ${error}`);
            queue.delete(msg.guild.id);
            return msg.channel.send(`لا أستطيع دخول هذآ الروم ${error}`);
        }
    } else {//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        serverQueue.songs.push(song);
        console.log(serverQueue.songs);
        if (playlist) return undefined;
        else return msg.channel.send(` **${song.title}** تم اضافه الاغنية الي القائمة!`);
    }
    return undefined;
}//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
 
function play(guild, song) {
    const serverQueue = queue.get(guild.id);
 
    if (!song) {//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    }//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    console.log(serverQueue.songs);
//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', reason => {//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
            if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
            else console.log(reason);
            serverQueue.songs.shift();//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
            play(guild, serverQueue.songs[0]);
        })//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
        .on('error', error => console.error(error));//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
 
    serverQueue.textChannel.send(`بدء تشغيل : **${song.title}**`);
}//by ,$ ReBeL ء , 🔕#4777 'CODES SERVER'
 
 
const adminprefix = "Z";
const devs = ['434666573370753024' , '434666573370753024' , ''];
client.on('message', message => {//for dev
  var argresult = message.content.split(` `).slice(1).join(' ');
    if (!devs.includes(message.author.id)) return;
 
if (message.content.startsWith(adminprefix + 'playing')) {
  client.user.setGame(argresult);
    message.channel.sendMessage(`**${argresult} تم تغيير بلاينق البوت إلى **`)
} else
  if (message.content.startsWith(adminprefix + 'name')) {
client.user.setUsername(argresult).then
    message.channel.sendMessage(`**${argresult}** : تم تغيير أسم البوت إلى`)
return message.reply("**لا يمكنك تغيير الاسم يجب عليك الانتظآر لمدة ساعتين . **");
} else
  if (message.content.startsWith(adminprefix + 'avatar')) {
client.user.setAvatar(argresult);
  message.channel.sendMessage(`**${argresult}** : تم تغير صورة البوت`);
      } else
if (message.content.startsWith(adminprefix + 'twitch')) {
  client.user.setGame(argresult, "https://www.twitch.tv/faresgameryt");
    message.channel.sendMessage(`**تم تغيير تويتش البوت إلى  ${argresult}**`)
}
 
 
    });
 
   
   
 
 
 client.on('ready',async () => {
  client.channels.find(ch => ch.id === "525398892116836371" && ch.type === 'voice').join();
});
 
 
 
 
 




client.on("guildMemberAdd", member => {
    member.createDM().then(function (channel) {
        return channel.send(`:rose:  ولكم نورت السيرفر :rose:
        :crown: اسم العضو  ${member}:crown:  
        انت العضو رقم ${member.guild.memberCount} `)
    }).catch(console.error)
})




 
 
 client.on('message', message => {
              if(!message.channel.guild) return;
    if(message.content.startsWith('Zbc')) {
    if(!message.channel.guild) return message.channel.send('**هذا الأمر فقط للسيرفرات**').then(m => m.delete(5000));
  if(!message.member.hasPermission('ADMINISTRATOR')) return      message.channel.send('**للأسف لا تمتلك صلاحية** `ADMINISTRATOR`' );  //7md
    let args = message.content.split(" ").join(" ").slice(2 + prefix.length);
    let copy = "ZinoBC";
    let request = `Requested By ${message.author.username}`;  //7md
    if (!args) return message.reply('**يجب عليك كتابة كلمة او جملة لإرسال البرودكاست**');message.channel.send(`**هل أنت متأكد من إرسالك البرودكاست؟ \nمحتوى البرودكاست:** \` ${args}\``).then(msg => {
    msg.react('✅')
    .then(() => msg.react('❌'))  //7md
    .then(() =>msg.react('✅'))  //7md



    let reaction1Filter = (reaction, user) => reaction.emoji.name === '✅' && user.id === message.author.id;
    let reaction2Filter = (reaction, user) => reaction.emoji.name === '❌' && user.id === message.author.id;
       let reaction1 = msg.createReactionCollector(reaction1Filter, { time: 12000 });  //7md
    let reaction2 = msg.createReactionCollector(reaction2Filter, { time: 12000 });  //7md
    reaction1.on("collect", r => {
    message.channel.send(`☑ |   ${message.guild.members.size} يتم ارسال البرودكاست الى عضو `).then(m => m.delete(5000));  //7md
    message.guild.members.forEach(m => {
    var bc = new  
       Discord.RichEmbed()
       .setColor('RANDOM')
       .setTitle('البرودكاست') .addField('السيرفر', message.guild.name) .addField('المرسل', message.author.username)  //7md
       .addField('الرساله', args)  //7md
       .setThumbnail(message.author.avatarURL)  //7md
       .setFooter(copy, client.user.avatarURL); //7md
    m.send({ embed: bc })
    msg.delete();  //7md
    })
    })
    reaction2.on("collect", r => {  //7md
    message.channel.send(`**Broadcast Canceled.**`).then(m => m.delete(5000));   //7md
    msg.delete();  //7md  
    })  //7md
    }) //7md
    }  //7md
    }) //7md
   

client.on('message',async message => {
  if(message.content === 'فك الباند عن الجميع') {
    var user = message.mentions.users.first();
    if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send('❌|**\`ADMINISTRATOR\`لا توجد لديك صلاحية `**');
    if(!message.guild.member(client.user).hasPermission("BAN_MEMBERS")) return message.reply("**I Don't Have ` BAN_MEMBERS ` Permission**");
    const guild = message.guild;

  message.guild.fetchBans().then(ba => {
  ba.forEach(ns => {
  message.guild.unban(ns);
  const embed= new Discord.RichEmbed()
        .setColor("RANDOM")
        .setAuthor("Succes!", "https://images-ext-1.discordapp.net/external/vp2vj9m0ieU5J6SHg6ObIsGpTJyoZnGAebrd0_vi848/https/i.imgur.com/GnR2unD.png?width=455&height=455")
        .setDescription(`**:white_check_mark: Has Been Unban For All**`)
    .setFooter('Requested by '+message.author.username, message.author.avatarURL)
  message.channel.sendEmbed(embed);
  guild.owner.send(`سيرفر : ${guild.name}
  **تم فك الباند عن الجميع بواسطة** : <@${message.author.id}>`) 
  });
  });
  }
  });

    client.on('message', message => {
                        let args = message.content.split(" ").slice(1).join(" ")
if(message.content.startsWith(prefix + 'color')) {
    if(!args) return message.channel.send('`يرجي اختيار كم لون `');
             if (!message.member.hasPermission('MANAGE_ROLES')) return message.channel.sendMessage('`**⚠ | `[MANAGE_ROLES]` لا يوجد لديك صلاحية**'); 
             message.channel.send("**✅ | تم عمل الالوان**");
                  setInterval(function(){})
                    let count = 0;
                    let ecount = 0;
          for(let x = 1; x < `${parseInt(args)+1}`; x++){
            message.guild.createRole({name:x,
              color: 'RANDOM'})
              }
            }
       });





client.login(process.env.BOT_TOKEN);
