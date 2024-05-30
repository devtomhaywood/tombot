
/*
node deploy-commands.js

run only when updating and creating new slash commands
*/

const dotenv = require('dotenv');
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

// acquire tokens from .env
dotenv.config();
const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const commands = [];

// obatins directory names
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);


// for loop which deploys all the commands found in  the "commands/[subdir] folder"
for (const folder of commandFolders) {

    // obtain all the javascript files which are found within the commands subfolders
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
        // read the names of the files and import them
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);

        // check to see if the files are created properly, with data or execute properties
		if ('data' in command && 'execute' in command) {
            // push json data to commands array made earlier
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(token);

// rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
// 	.then(() => console.log('Successfully deleted all guild commands.'))
// 	.catch(console.error);

// check if slash commands have correctly been created.
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands},
        );
        console.log(`Succesfully reload ${data.length} application (/) commands.`);
    }
    catch (error) {
        console.error(error);
    }
})();



