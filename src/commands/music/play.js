const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
const playdl = require('play-dl');
const YouTube = require('youtube-sr').default;

async function playSong(queue, message, retries = 0) {
    if (queue.songs.length === 0) {
        queue.connection.destroy();
        message.client.queues.delete(message.guildId || message.guild.id);
        return;
    }

    const song = queue.songs[0];

    try {
        const stream = await playdl.stream(song.url);
        const resource = createAudioResource(stream.stream, { inputType: stream.type, inlineVolume: true });
        resource.volume.setVolume(queue.volume / 100);

        queue.player.play(resource);
        queue.connection.subscribe(queue.player);

        const embed = new EmbedBuilder()
            .setColor(0x7289DA)
            .setTitle('Now Playing')
            .setDescription(`**[${song.title}](${song.url})**`)
            .addFields(
                { name: 'Duration', value: song.duration, inline: true },
                { name: 'Requested by', value: song.requestedBy, inline: true },
            );

        if (queue.textChannel?.send) {
            await queue.textChannel.send({ embeds: [embed] });
        }
    } catch (error) {
        console.error('Error playing song:', error);
        if (retries < 3) {
            playSong(queue, message, retries + 1);
        } else {
            queue.songs.shift();
            playSong(queue, message, 0);
        }
    }
}

async function handlePlay(guildId, voiceChannel, textChannel, query, requestedBy, client) {
    let song;

    if (playdl.yt_validate(query) === 'video') {
        const info = await playdl.video_info(query);
        song = {
            title: info.video_details.title,
            url: info.video_details.url,
            duration: info.video_details.durationRaw || 'Unknown',
            requestedBy,
        };
    } else {
        const results = await YouTube.searchOne(query);
        if (!results || !results.id) {
            return null;
        }
        song = {
            title: results.title,
            url: results.url,
            duration: results.durationFormatted || 'Unknown',
            requestedBy,
        };
    }

    let queue = client.queues.get(guildId);

    if (queue) {
        queue.songs.push(song);
        return { song, queued: true };
    }

    const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: guildId,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    const player = createAudioPlayer();

    queue = {
        songs: [song],
        connection,
        player,
        textChannel,
        volume: 100,
        playing: true,
    };

    client.queues.set(guildId, queue);

    player.on(AudioPlayerStatus.Idle, () => {
        queue.songs.shift();
        playSong(queue, { guildId, guild: { id: guildId }, client });
    });

    player.on('error', (error) => {
        console.error('Audio player error:', error);
        queue.songs.shift();
        playSong(queue, { guildId, guild: { id: guildId }, client });
    });

    connection.on(VoiceConnectionStatus.Disconnected, async () => {
        try {
            await Promise.race([
                entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
                entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
            ]);
        } catch {
            connection.destroy();
            client.queues.delete(guildId);
        }
    });

    playSong(queue, { guildId, guild: { id: guildId }, client });

    return { song, queued: false };
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play a song from YouTube')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Song name or YouTube URL')
                .setRequired(true)),
    name: 'play',
    aliases: ['p'],
    description: 'Play a song from YouTube',

    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ content: 'You need to be in a voice channel to play music!', ephemeral: true });
        }

        const query = interaction.options.getString('query');
        await interaction.deferReply();

        try {
            const result = await handlePlay(interaction.guildId, voiceChannel, interaction.channel, query, interaction.user.tag, interaction.client);

            if (!result) {
                return interaction.editReply('No results found for your query.');
            }

            if (result.queued) {
                const embed = new EmbedBuilder()
                    .setColor(0x7289DA)
                    .setTitle('Added to Queue')
                    .setDescription(`**[${result.song.title}](${result.song.url})**`)
                    .addFields({ name: 'Duration', value: result.song.duration, inline: true });
                return interaction.editReply({ embeds: [embed] });
            }

            return interaction.editReply('Starting playback...');
        } catch (error) {
            console.error('Play command error:', error);
            return interaction.editReply('An error occurred while trying to play the song.');
        }
    },

    async executePrefix(message, args) {
        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply('You need to be in a voice channel to play music!');
        }

        const query = args.join(' ');
        if (!query) {
            return message.reply('Please provide a song name or YouTube URL.');
        }

        try {
            const result = await handlePlay(message.guild.id, voiceChannel, message.channel, query, message.author.tag, message.client);

            if (!result) {
                return message.reply('No results found for your query.');
            }

            if (result.queued) {
                const embed = new EmbedBuilder()
                    .setColor(0x7289DA)
                    .setTitle('Added to Queue')
                    .setDescription(`**[${result.song.title}](${result.song.url})**`)
                    .addFields({ name: 'Duration', value: result.song.duration, inline: true });
                return message.reply({ embeds: [embed] });
            }
        } catch (error) {
            console.error('Play command error:', error);
            return message.reply('An error occurred while trying to play the song.');
        }
    },
};
