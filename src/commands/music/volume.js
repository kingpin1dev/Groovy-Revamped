const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

function handleVolume(guildId, client, level) {
    const queue = client.queues.get(guildId);
    if (!queue) return { error: 'There is nothing playing right now.' };

    if (level === undefined || level === null) {
        return { current: queue.volume };
    }

    if (level < 0 || level > 150) {
        return { error: 'Volume must be between 0 and 150.' };
    }

    queue.volume = level;
    if (queue.player.state.resource) {
        queue.player.state.resource.volume?.setVolume(level / 100);
    }

    return { volume: level };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('volume')
        .setDescription('Set or show the playback volume')
        .addIntegerOption(option =>
            option.setName('level')
                .setDescription('Volume level (0-150)')
                .setMinValue(0)
                .setMaxValue(150)),
    name: 'volume',
    aliases: ['vol'],
    description: 'Set or show the playback volume',

    async execute(interaction) {
        const level = interaction.options.getInteger('level');
        const result = handleVolume(interaction.guildId, interaction.client, level);

        if (result.error) {
            return interaction.reply({ content: result.error, ephemeral: true });
        }

        const embed = new EmbedBuilder().setColor(0x7289DA);

        if (result.current !== undefined) {
            embed.setDescription(`Current volume: **${result.current}%**`);
        } else {
            embed.setDescription(`Volume set to **${result.volume}%**`);
        }

        return interaction.reply({ embeds: [embed] });
    },

    async executePrefix(message, args) {
        const level = args[0] ? parseInt(args[0], 10) : undefined;

        if (args[0] && isNaN(level)) {
            return message.reply('Please provide a valid number for volume.');
        }

        const result = handleVolume(message.guild.id, message.client, level);

        if (result.error) {
            return message.reply(result.error);
        }

        const embed = new EmbedBuilder().setColor(0x7289DA);

        if (result.current !== undefined) {
            embed.setDescription(`Current volume: **${result.current}%**`);
        } else {
            embed.setDescription(`Volume set to **${result.volume}%**`);
        }

        return message.reply({ embeds: [embed] });
    },
};
