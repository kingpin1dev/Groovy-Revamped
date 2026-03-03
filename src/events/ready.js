const { Events, REST, Routes } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`Groovy is online as ${client.user.tag}!`);

        const commands = client.commands.map(cmd => cmd.data.toJSON());

        const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

        try {
            if (process.env.GUILD_ID) {
                await rest.put(
                    Routes.applicationGuildCommands(client.user.id, process.env.GUILD_ID),
                    { body: commands },
                );
                console.log(`Registered ${commands.length} slash commands for guild ${process.env.GUILD_ID}.`);
            } else {
                await rest.put(
                    Routes.applicationCommands(client.user.id),
                    { body: commands },
                );
                console.log(`Registered ${commands.length} slash commands globally.`);
            }
        } catch (error) {
            console.error('Failed to register slash commands:', error);
        }
    },
};
