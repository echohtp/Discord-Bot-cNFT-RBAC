const { Client, Partials, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const path = require('path');

require('dotenv').config()

const TOKEN = process.env.BOT_TOKEN;
const PREFIX = '!';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMembers],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Load commands
client.commands = new Map();
const commandFiles = fs.readdirSync(path.join(__dirname, '/commands')).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    const commandName = file.split(".")[0];
    client.commands.set(commandName, command);
}

client.once('ready', () => {
    console.log('Bot is online!');
});

client.on('messageCreate', async message => {
    
    if (message.author.bot) return;

    // This is where we stick points/level tracking
    //

    if (!message.content.startsWith(PREFIX)) return;

    const commandBody = message.content.slice(PREFIX.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    // Call the corresponding command if it exists
    if (client.commands.has(command)) {
        try {
            client.commands.get(command)(message, args);
        } catch (error) {
            console.error(error);
            message.reply('there was an error trying to execute that command!');
        }
    }
});

client.on('messageReactionAdd', require('./events/messageReactionAdd'));
client.on('messageReactionRemove', require('./events/messageReactionRemove'));
client.on('guildMemberUpdate', require('./events/guildMemberUpdate'))

client.login(TOKEN);
