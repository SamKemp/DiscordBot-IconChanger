require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();


client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
})
client.on("message", msg => {

  // Ignore DM's
  if(!msg.guild) return;

  // Ignore self
  if(msg.author.id == client.user.id) return;

})

client.login(process.env.BOT_TOKEN);