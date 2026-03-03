const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function handleQueue(guildId, client) {
    const queue = client.queues.get(guildId);
    if (!queue || queue.songs.length === 0) {
        return { error: 'The queue is empty.' };
    }

    const current = queue.songs[0];
    const upcoming = queue.songs.slice(1, 11);

    let description = `**Now Playing:**\n[${current.title}](${current.url}) - \`${current.duration}\`\n`;

    if (upcoming.length > 0) {
        description += '\n**Up Next:**\n';
        upcoming.forEach((song, index) => {
            description += `\`${index + 1}.\` [${song.title}](${song.url}) - \`${song.duration}\`\n`;
        });
    }

    if (queue.songs.length > 11) {
        description += `\n...and ${queue.songs.length - 11} more`;
    }

    return { description, total: queue.songs.length };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Show the current song queue'),
    name: 'queue',
    aliases: ['q'],
    description: 'Show the current song queue',

    async execute(interaction) {
        const result = handleQueue(interaction.guildId, interaction.client);
        if (result.error) {
            return interaction.reply({ content: result.error, ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x7289DA)
            .setTitle('Song Queue')
            .setDescription(result.description)
            .setFooter({ text: `${result.total} song(s) in queue` });
        return interaction.reply({ embeds: [embed] });
    },

    async executePrefix(message) {
        const result = handleQueue(message.guild.id, message.client);
        if (result.error) {
            return message.reply(result.error);
        }

        const embed = new EmbedBuilder()
            .setColor(0x7289DA)
            .setTitle('Song Queue')
            .setDescription(result.description)
            .setFooter({ text: `${result.total} song(s) in queue` });
        return message.reply({ embeds: [embed] });
    },
};
