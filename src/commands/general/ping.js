const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Show bot latency'),
    name: 'ping',
    aliases: [],
    description: 'Show bot latency',

    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        const roundtrip = sent.createdTimestamp - interaction.createdTimestamp;

        const embed = new EmbedBuilder()
            .setColor(0x7289DA)
            .setTitle('Pong!')
            .addFields(
                { name: 'Bot Latency', value: `${roundtrip}ms`, inline: true },
                { name: 'API Latency', value: `${Math.round(interaction.client.ws.ping)}ms`, inline: true },
            );
        return interaction.editReply({ content: null, embeds: [embed] });
    },

    async executePrefix(message) {
        const sent = await message.reply('Pinging...');
        const roundtrip = sent.createdTimestamp - message.createdTimestamp;

        const embed = new EmbedBuilder()
            .setColor(0x7289DA)
            .setTitle('Pong!')
            .addFields(
                { name: 'Bot Latency', value: `${roundtrip}ms`, inline: true },
                { name: 'API Latency', value: `${Math.round(message.client.ws.ping)}ms`, inline: true },
            );
        return sent.edit({ content: null, embeds: [embed] });
    },
};
