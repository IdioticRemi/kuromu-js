const { Command, Usage } = require('klasa');
const Youtube = require("simple-youtube-api");
const ytdl = require('ytdl-core-discord');

const { Song } = require("../../../libs/music");
const config = require("../../../libs/config");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['yt', 'youtube'],
            cooldown: 5,
            description: language => language.get('COMMAND_PLAY_DESCRIPTION'),
            usage: '<search:str> [...]'
        });

        this.youtube = null;
    }

    async init() {
        this.youtube = new Youtube(config.youtube);
    }

    async run(message, [...search]) {
        if (!message.member.voice || !message.member.voice.channel) return await message.sendLocale('MUSIC_PLAYER_NO-VOICE');
        if (!message.guild['player'].connected) return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        if (message.member.voice && message.member.voice.channelID !== message.guild['player'].voice.id) return await message.sendLocale('MUSIC_PLAYER_USER-NOT-CONNECTED');
        if (message.guild['trivia'].players.size > 0) return await message.sendLocale('MUSIC_PLAYER_TRIVIA-PLAYING');

        if (search.length < 1) return await message.sendLocale('COMMAND_PLAY_NO-SEARCH');

        const qSize = message.guild['player'].queue.length;
        const gConfig = await message.guildSettings.toJSON();
        const songLimit = gConfig['pro'] ? 80 - qSize : 20 - qSize;

        if (songLimit <= 0) return await message.sendLocale('COMMAND_PLAY_QUEUE-LIMIT', [gConfig['pro'] ? 80 : 20]);

        const searchString = search.join(' ');
        const url = search[0].replace(/<(.+)>/g, '$1');
        const uConfig = await message.author.settings.toJSON();
        const playlists = new Map(await uConfig['playlists'].map(p => [p.name, p.songs]));

        if (playlists.get(searchString)) {
            if (playlists.get(searchString).length > songLimit) return await message.sendLocale('COMMAND_PLAY_PLAYLIST-QUEUE-SIZE', [gConfig['pro'] ? 80 : 20]);

            await message.sendLocale('COMMAND_PLAY_PLAYLIST-LOAD', [searchString.toLowerCase(), message.author.tag, message.author.tag]);

            for (let i = 0; i < playlists.get(searchString).length; i++) {
                const vid = await this.youtube.getVideo(playlists.get(searchString)[i].url).catch(this.client.console.error);

                await this.handleVideo(vid, message, true);
            }

            return await message.sendLocale('COMMAND_PLAY_PLAYLIST', [searchString.toLowerCase(), message.author.tag, message.author.tag]);
        }
        else if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
            const playlist = await this.youtube.getPlaylist(url);
            const videos = await playlist.getVideos(songLimit);

            await message.sendLocale('COMMAND_PLAY_PLAYLIST-LOAD', [playlist.title, playlist.channelTitle, message.author.tag]);

            for (const video of Object.values(videos)) {
                this.client.console.debug(videos);
                if (video.raw.status['privacyStatus'] !== 'public') continue;

                const vid = await this.youtube.getVideoByID(video.id).catch(this.client.console.error);

                await this.handleVideo(vid, message, true);
            }

            return await message.sendLocale('COMMAND_PLAY_PLAYLIST', [playlist.title, playlist.channelTitle, message.author.tag]);
        } else {
            let video;
            try {
                video = await this.youtube.getVideo(text['join'](url));
            } catch (error) {
                try {
                    const videos = await this.youtube.searchVideos(searchString, 5);

                    await message.sendLocale('COMMAND_PLAY_RESOLVER', [videos.map(v => v.title)]);

                    const usage = new Usage(this.client, '<choice:int{1,5}>', null);
                    const prompt = usage.createPrompt(message, { limit: 1, time: 15000 });
                    const answers = await prompt.run(message.language.get('COMMAND_PLAY_PROMPT'));

                    if (prompt.responses.first().deletable) await prompt.responses.first().delete({ timeout: 300 });
                    
                    video = await this.youtube.getVideoByID(videos[answers[0] - 1].id);
                } catch (err) {
                    if (err.split('\n') === 'The prompt has timed out.') {
                        return await message.sendLocale('COMMAND_PLAY_PROMPT-NO-ANSWER');
                    } else {
                        return await message.sendLocale('COMMAND_PLAY_NO-RESULTS', [searchString]);
                    }
                }
            }

            return await this.handleVideo(video, message);
        }
    }

    async handleVideo(video, message, playlistSupport = false) {
        const song = new Song(video, message.author);

        try {
            message.guild['player'].enqueue(song);

            if (message.guild['player'].queue.length === 1) {
                message.guild['player'].setCurrent(0);

                await this.play(message, song);
            } else {
                if (!playlistSupport) return await message.sendLocale('COMMAND_PLAY_ENQUEUE', [song.title, song.author, song.user.tag]);
            }
        } catch (err) {
            await message.guild['player'].destroy();
            return await message.sendLocale('COMMAND_PLAY_ERR', [err]);
        }
    }

    async play(message, song, errored = false) {
        if (!song && message.guild['player'].text !== null) {
            if (message.guild['player'].repeat === 1) {
                if (message.guild['player'].queue.length === 0) {
                    message.guild['player'].clearQueue();
                    return !errored ? await message.guild['player'].text.send(message.language.get('COMMAND_PLAY_ENDED')) : null;
                }

                message.guild['player'].setCurrent(0);
                return await this.play(message, message.guild['player'].nowPlaying);
            } else {
                message.guild['player'].clearQueue();
                return !errored ? await message.guild['player'].text.send(message.language.get('COMMAND_PLAY_ENDED')) : null;
            }
        } else if (message.guild['player'].text === null) {
            return;
        }

        let e = null;
        const opus = await ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio', bassBoost: message.guild['player']._bassBoost }).catch(err => e = err);

        if (e) {
            message.guild['player'].current += 1;

            const { current } = message.guild['player'];

            await message.guild['player'].text.send(message.language.get('COMMAND_PLAY_ISSUE', song.title, song.author)).catch(() => null);

            return await this.play(message, message.guild['player'].nowPlaying || message.guild['player'].queue[current < 0 ? 0 : current + 1], true);
        }
        else await message.guild['player'].text.send(message.language.get('COMMAND_PLAY_SONG', song.title, song.author, song.user.tag)).catch(() => null);
        
        try {
            await message.guild['player'].connection.play(opus, { type: 'opus' })
                .on("end", async () => {
                    if ([0, 1].includes(message.guild['player'].repeat)) {
                        message.guild['player'].current += 1;
                    }

                    const current = message.guild['player'].current;

                    return await this.play(message, message.guild['player'].nowPlaying || message.guild['player'].queue[current < 0 ? 0 : current + 1]);
                }).on("error", async (err) => {
                    if (err.stack.startsWith('Error [ERR_STREAM_WRITE_AFTER_END]')) return;
                    await message.guild['player'].text.send(message.language.get('COMMAND_PLAY_ERROR', [err.stack])).catch(() => null);
                });
        } catch (e) {
            this.client.console.wtf('Error in play.js handler (Play.play())');
            this.client.console.wtf(e.stack);
        }

        await message.guild['player'].setVolume(message.guild['player'].volume);
    }
};
