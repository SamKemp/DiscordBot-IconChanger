require("dotenv").config();

const Discord = require("discord.js");
const client = new Discord.Client();

// Command prefix
var prefix = '¬';

// Server ID to change icon/banner of
var AssignedServer = "555188113840799747";
// Number of seconds before icon changes (set 0 to disable)
var ICON_ChangeDelay = 600;
// Number of seconds before banner changes (set 0 to disable)
var BANNER_ChangeDelay = 0;

const IconArray = [];
var SetIcon = 0;

const BannerArray = [];
var SetBanner = 0;

var BoostCount = 0;

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);

    if(IconArray.length < 1) IconArray.push(client.guilds.cache.get(AssignedServer)?.iconURL());

    BoostCount = client.guilds.cache.get(AssignedServer)?.premiumSubscriptionCount;
    console.log("Server has " + BoostCount + " boosts");

    if(ICON_ChangeDelay > 0)
    {
        setInterval(ChangeIcon_Timer, ICON_ChangeDelay*1000);
    }
    if(BANNER_ChangeDelay > 0)
    {
        setInterval(ChangeBanner_Timer, BANNER_ChangeDelay*1000);
    }
})

client.on("message", msg => {

    // Ignore DM's
    if(!msg.guild) return;

    // Ignore self
    if(msg.author.id == client.user.id) return;

    if(msg.author.id == msg.guild.ownerID)
    {
        // Icon Commands
        if (msg.content === prefix + "showIcons")
        {
            msg.reply("```" + IconArray.join("\n") + "```");
            return;
        }
        else if (msg.content.startsWith(prefix + "addIcon"))
        {
            const args = msg.content.split(' ').slice(1);

            IconArray.push(args[0]);
            return;
        }
        else if (msg.content.startsWith(prefix + "delIcon"))
        {
            const args = msg.content.split(' ').slice(1);

            IconArray.splice(args[0], 1);
            return;
        }
        else if (msg.content.startsWith(prefix + "changeIcon"))
        {
            const args = msg.content.split(' ').slice(1);

            msg.guild.setIcon(IconArray[args[0]])
            //.then(updated => console.log('Updated the guild icon'))
            .catch(console.error);
            return;
        }

        // Banner Commands
        else if (msg.content === prefix + "showBanner")
        {
            BoostCount = client.guilds.cache.get(AssignedServer)?.premiumSubscriptionCount;
            msg.reply("Boost count: " + BoostCount + "\n```" + BannerArray.join("\n") + "```");
            return;
        }
        else if (msg.content.startsWith(prefix + "addBanner"))
        {
            BoostCount = client.guilds.cache.get(AssignedServer)?.premiumSubscriptionCount;

            const args = msg.content.split(' ').slice(1);

            BannerArray.push(args[0]);
            return;
        }
        else if (msg.content.startsWith(prefix + "delBanner"))
        {
            BoostCount = client.guilds.cache.get(AssignedServer)?.premiumSubscriptionCount;

            const args = msg.content.split(' ').slice(1);

            BannerArray.splice(args[0], 1);
            return;
        }
        else if (BoostCount >= 15 && msg.content.startsWith(prefix + "changeBanner"))
        {
            const args = msg.content.split(' ').slice(1);

            msg.guild.setIcon(BannerArray[args[0]])
            .then(updated => console.log('Updated the guild banner'))
            .catch(console.error);
            return;
        }
    }
})

client.login(process.env.BOT_TOKEN);

function ChangeIcon_Timer()
{
    client.guilds.cache.get(AssignedServer)?.setIcon(IconArray[SetIcon])
    //.then(updated => console.log('Updated the guild icon | ' + SetIcon + " | " + IconArray.length))
    .catch(console.error);

    SetIcon++;
    if(SetIcon >= IconArray.length)
    {
        SetIcon = 0;
    }
}

function ChangeBanner_Timer()
{
    if(BoostCount >= 15)
    {
        client.guilds.cache.get(AssignedServer)?.setBanner(BannerArray[SetBanner])
        .then(updated => console.log('Updated the guild banner'))
        .catch(console.error);

        SetBanner++;
        if(SetBanner >= BannerArray.length)
        {
            SetBanner = 0;
        }
    }
    else
    {
        return;
    }
}