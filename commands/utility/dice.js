const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Dice roller.')
        .addIntegerOption(option =>
            option.setName('value')
            .setDescription('max num of dice')
        ),
    async execute(interaction){
        const value = interaction.options.getInteger('value') ?? 6;
        const roll = Math.floor(Math.random() * value) + 1;
        
        await interaction.reply(`You rolled a ${roll}!`)
    }
}