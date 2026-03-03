const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function handleNowPlaying(guildId, client) {
    const queue = client.queues.get(guildId);
    if (!queue || queue.songs.length === 0) {
        return { error: 'There is nothing playing right now.' };
    }

    return { song: queue.songs[0], playing: queue.playing };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Show the currently playing song'),
    name: 'nowplaying',
    aliases: ['np'],
    description: 'Show the currently playing song',

    async execute(interaction) {
        const result = handleNowPlaying(interaction.guildId, interaction.client);
        if (result.error) {
            return interaction.reply({ content: result.error, ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x7289DA)
            .setTitle('Now Playing')
            .setDescription(`**[${result.song.title}](${result.song.url})**`)
            .addFields(
                { name: 'Duration', value: result.song.duration, inline: true },
                { name: 'Requested by', value: result.song.requestedBy, inline: true },
                { name: 'Status', value: result.playing ? 'Playing' : 'Paused', inline: true },
            );
        return interaction.reply({ embeds: [embed] });
    },

    async executePrefix(message) {
        const result = handleNowPlaying(message.guild.id, message.client);
        if (result.error) {
            return message.reply(result.error);
        }

        const embed = new EmbedBuilder()
            .setColor(0x7289DA)
            .setTitle('Now Playing')
            .setDescription(`**[${result.song.title}](${result.song.url})**`)
            .addFields(
                { name: 'Duration', value: result.song.duration, inline: true },
                { name: 'Requested by', value: result.song.requestedBy, inline: true },
                { name: 'Status', value: result.playing ? 'Playing' : 'Paused', inline: true },
            );
        return message.reply({ embeds: [embed] });
    },
};
