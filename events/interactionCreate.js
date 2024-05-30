const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {

        if (!interaction.isChatInputCommand()) return;
    
        const command = interaction.client.commands.get(interaction.commandName);
    
        // checks if slash command interaction has been registered
        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }
    
        // tries to execute interaction, if there is an issue with the bot it will fail
        try {
            await command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({content: 'There was an error while executing this commmand!', ephemeral: true});
            }
            else {
                await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
            }
        }
    },
};