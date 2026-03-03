const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { AudioPlayerStatus } = require('@discordjs/voice');

function handleResume(guildId, client) {
    const queue = client.queues.get(guildId);
    if (!queue) return { error: 'There is nothing playing right now.' };

    if (queue.player.state.status !== AudioPlayerStatus.Paused) {
        return { error: 'The music is not paused.' };
    }

    queue.player.unpause();
    queue.playing = true;

    return { title: queue.songs[0]?.title || 'Unknown' };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resume the paused song'),
    name: 'resume',
    aliases: ['r'],
    description: 'Resume the paused song',

    async execute(interaction) {
        const result = handleResume(interaction.guildId, interaction.client);
        if (result.error) {
            return interaction.reply({ content: result.error, ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x7289DA)
            .setDescription(`Resumed **${result.title}**`);
        return interaction.reply({ embeds: [embed] });
    },

    async executePrefix(message) {
        const result = handleResume(message.guild.id, message.client);
        if (result.error) {
            return message.reply(result.error);
        }

        const embed = new EmbedBuilder()
            .setColor(0x7289DA)
            .setDescription(`Resumed **${result.title}**`);
        return message.reply({ embeds: [embed] });
    },
};
