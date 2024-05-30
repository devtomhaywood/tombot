const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');

// Create a client instance, GatewayIntentBits.Guilds intent is necessary for discord.js client.
const client = new Client({intents: [GatewayIntentBits.Guilds]});

client.commands = new Collection();

/*
This section here is for reading all of the commands in the commands/[subdir] directories
It finds any file type of .js
A check is done to see if the files are properly assembled
Once checked, the commands are assigned to the client
*/
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missng a required "data" or "execute" property.`)
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath);


/*
This section here is for reading all of the events in the events directory
It will find the events and import them
It will check whether the event needs to be run once or not.
*/
for (const file of eventFiles){
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    }
    else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

dotenv.config();
const token = process.env.DISCORD_TOKEN;
client.login(token);