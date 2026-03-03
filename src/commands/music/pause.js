const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

function handlePause(guildId, client) {
    const queue = client.queues.get(guildId);
    if (!queue) return { error: 'There is nothing playing right now.' };

    if (queue.player.state.status === AudioPlayerStatus.Paused) {
        return { error: 'The music is already paused.' };
    }

    queue.player.pause();
    queue.playing = false;

    return { title: queue.songs[0]?.title || 'Unknown' };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pause the current song'),
    name: 'pause',
    aliases: [],
    description: 'Pause the current song',

    async execute(interaction) {
        const result = handlePause(interaction.guildId, interaction.client);
        if (result.error) {
            return interaction.reply({ content: result.error, ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x7289DA)
            .setDescription(`Paused **${result.title}**`);
        return interaction.reply({ embeds: [embed] });
    },

    async executePrefix(message) {
        const result = handlePause(message.guild.id, message.client);
        if (result.error) {
            return message.reply(result.error);
        }

        const embed = new EmbedBuilder()
            .setColor(0x7289DA)
            .setDescription(`Paused **${result.title}**`);
        return message.reply({ embeds: [embed] });
    },
};
