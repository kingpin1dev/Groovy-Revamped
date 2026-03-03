const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message) {
        if (message.author.bot) return;
        if (!message.guild) return;

        const prefix = message.client.prefix;
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = message.client.commands.get(commandName)
            || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command || !command.executePrefix) return;

        try {
            await command.executePrefix(message, args);
        } catch (error) {
            console.error(`Error executing ${prefix}${commandName}:`, error);
            await message.reply('An error occurred while executing this command.');
        }
    },
};
