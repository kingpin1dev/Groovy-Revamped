const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function handleSkip(guildId, client) {
    const queue = client.queues.get(guildId);
    if (!queue) return { error: 'There is nothing playing right now.' };
    if (queue.songs.length === 0) return { error: 'There are no more songs in the queue.' };

    const skipped = queue.songs[0];
    queue.player.stop();

    return { skipped };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skip the current song'),
    name: 'skip',
    aliases: ['s'],
    description: 'Skip the current song',

    async execute(interaction) {
        const result = handleSkip(interaction.guildId, interaction.client);
        if (result.error) {
            return interaction.reply({ content: result.error, ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor(0x7289DA)
            .setDescription(`Skipped **${result.skipped.title}**`);
        return interaction.reply({ embeds: [embed] });
    },

    async executePrefix(message) {
        const result = handleSkip(message.guild.id, message.client);
        if (result.error) {
            return message.reply(result.error);
        }

        const embed = new EmbedBuilder()
            .setColor(0x7289DA)
            .setDescription(`Skipped **${result.skipped.title}**`);
        return message.reply({ embeds: [embed] });
    },
};
