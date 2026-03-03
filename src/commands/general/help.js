const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function buildHelpEmbed(client) {
    const embed = new EmbedBuilder()
        .setColor(0x7289DA)
        .setTitle('Groovy - Command List')
        .setDescription(`Use slash commands or prefix \`${client.prefix}\` to run commands.`)
        .setFooter({ text: 'Groovy Music Bot by kingpindev' });

    const musicCmds = [];
    const generalCmds = [];

    client.commands.forEach(cmd => {
        const aliases = cmd.aliases && cmd.aliases.length > 0 ? ` (${cmd.aliases.join(', ')})` : '';
        const line = `\`${cmd.name}${aliases}\` - ${cmd.description}`;

        if (['play', 'skip', 'stop', 'queue', 'pause', 'resume', 'nowplaying', 'volume'].includes(cmd.name)) {
            musicCmds.push(line);
        } else {
            generalCmds.push(line);
        }
    });

    if (musicCmds.length > 0) {
        embed.addFields({ name: 'Music', value: musicCmds.join('\n') });
    }
    if (generalCmds.length > 0) {
        embed.addFields({ name: 'General', value: generalCmds.join('\n') });
    }

    return embed;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all available commands'),
    name: 'help',
    aliases: ['h', 'commands'],
    description: 'Show all available commands',

    async execute(interaction) {
        const embed = buildHelpEmbed(interaction.client);
        return interaction.reply({ embeds: [embed] });
    },

    async executePrefix(message) {
        const embed = buildHelpEmbed(message.client);
        return message.reply({ embeds: [embed] });
    },
};
