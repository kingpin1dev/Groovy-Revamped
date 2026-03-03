const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function handleStop(guildId, client) {
    const queue = client.queues.get(guildId);
    if (!queue) return { error: 'There is nothing playing right now.' };

    queue.songs = [];
    queue.player.stop();
    queue.connection.destroy();
    client.queues.delete(guildId);

    return { success: true };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Stop the music and leave the voice channel'),
    name: 'stop',
    aliases: ['dc', 'leave', 'disconnect'],
    description: 'Stop the music and leave the voice channel',

    async execute(interaction) {
        const result = handleStop(interaction.guildId, interaction.client);
        if (result.error) {
            return interaction.reply({ content: result.error, ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x7289DA)
            .setDescription('Stopped the music and left the channel.');
        return interaction.reply({ embeds: [embed] });
    },

    async executePrefix(message) {
        const result = handleStop(message.guild.id, message.client);
        if (result.error) {
            return message.reply(result.error);
        }

        const embed = new EmbedBuilder()
            .setColor(0x7289DA)
            .setDescription('Stopped the music and left the channel.');
        return message.reply({ embeds: [embed] });
    },
};
