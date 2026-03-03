const { SlashCommandBuilder, EmbedBuilder, version: djsVersion } = require('discord.js');

function buildInfoEmbed(client) {
    const uptime = formatUptime(client.uptime);

    return new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('Groovy')
        .setDescription('A Discord Music Bot')
        .addFields(
            { name: 'Developer', value: 'kingpindev', inline: true },
            { name: 'Servers', value: `${client.guilds.cache.size}`, inline: true },
            { name: 'Users', value: `${client.users.cache.size}`, inline: true },
            { name: 'Uptime', value: uptime, inline: true },
            { name: 'Discord.js', value: `v${djsVersion}`, inline: true },
            { name: 'Node.js', value: process.version, inline: true },
        )
        .setFooter({ text: 'Groovy Music Bot by kingpindev' });
}

function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    parts.push(`${seconds}s`);

    return parts.join(' ');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Show bot information'),
    name: 'info',
    aliases: ['about', 'botinfo'],
    description: 'Show bot information',

    async execute(interaction) {
        const embed = buildInfoEmbed(interaction.client);
        return interaction.reply({ embeds: [embed] });
    },

    async executePrefix(message) {
        const embed = buildInfoEmbed(message.client);
        return message.reply({ embeds: [embed] });
    },
};
