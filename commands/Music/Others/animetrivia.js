const { Command } = require('klasa');
const ytdl = require('ytdl-core-discord');

const { TriviaSong } = require("../../../libs/music");
const openings = require("../../../libs/openings");

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['animeop', 'optrivia'],
            cooldown: 5,
            description: language => language.get('COMMAND_ANIME-TRIVIA_DESCRIPTION'),
            usage: '<ops:int{1}>'
        });

        this.youtube = null;
    }

    async run(message, [songs, level]) {
        if (!message.member.voice || !message.member.voice.channel) return await message.sendLocale('MUSIC_PLAYER_NO-VOICE');
        if (!message.guild['player'].connected) return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        if (message.member.voice && message.member.voice.channelID !== message.guild['player'].voice.id) return await message.sendLocale('MUSIC_PLAYER_USER-NOT-CONNECTED');
        //if (message.member.voice.channel.members.filter(m => !m.user.bot).size < 2) return await message.sendLocale('COMMAND_ANIME-TRIVIA_NEED-MORE-USERS');
        if (message.guild['player'].current !== null || message.guild['trivia'].players.size > 0) return await message.sendLocale('COMMAND_ANIME-TRIVIA_ALREADY-PLAYING');

        const gConfig = await message.guildSettings.toJSON();
        const songLimit = gConfig['pro'] ? 80 - songs : 20 - songs;

        if (songLimit < 0) return await message.sendLocale('COMMAND_ANIME-TRIVIA_TOO-MUCH', [gConfig['pro'] ? 80 : 20]);

        const selection = openings.shuffle().shuffle().shuffle().slice(0, songs);

        // Register the players
        message.member.voice.channel.members.filter(m => !m.user.bot)
            .forEach(member => message.guild['trivia'].createPlayer(member.user));
        // Register songs
        message.guild['player'].queue = selection.map(op => new TriviaSong(op));
        message.guild['player'].setCurrent(0);

        await message.guild['player'].text.send(message.language.get('COMMAND_ANIME-TRIVIA_STARTED'));

        await this.handleVideo(message);
    }

    async handleVideo(message) {
        const song = message.guild['player'].queue[message.guild['player'].current];

        try {
            await this.play(message, song);
        } catch (err) {
            await message.guild['player'].destroy();
            return await message.sendLocale('COMMAND_ANIME-TRIVIA_ERR', [err]);
        }
    }

    async play(message, op, errored = false) {
        if (!op && message.guild['player'].text !== null && !errored) {
            await message.guild['player'].clearQueue().setCurrent(null);
            await message.guild['player'].setVolume(75);
            await message.guild['player'].text.send(message.language.get('COMMAND_ANIME-TRIVIA_ENDED',
                message.guild['trivia'].players.sort((a, b) => a.score > b.score ? -1 : 1)));
            return await message.guild['trivia'].reset();
        } else if (message.guild['player'].text === null) {
            return message.guild['player'].destroy();
        } else if (errored) {
            message.guild['player'].current += 1;

            const { current } = message.guild['player'];

            return await this.play(message, message.guild['player'].nowPlaying || message.guild['player'].queue[current + 1]);
        }

        let e = null;
        const opus = await ytdl(op.url, { filter: 'audioonly', quality: 'highestaudio' }).catch(err => e = err);

        if (e) {
            const { current } = message.guild['player'];

            return await this.play(message, message.guild['player'].nowPlaying || message.guild['player'].queue[current + 1], true);
        }

        try {
            await message.guild['player'].connection.play(opus, { type: 'opus' })
                .on("end", async () => {
                    message.guild['player'].current += 1;

                    return await this.play(message, message.guild['player'].nowPlaying || message.guild['player'].queue[message.guild['player'].current + 1]);
                }).on("error", async (err) => {
                    if (err.stack.startsWith('Error [ERR_STREAM_WRITE_AFTER_END]')) return;
                    await message.guild['player'].text.send(message.language.get('COMMAND_PLAY_ERROR', [err.stack])).catch(() => null);
                });
        } catch (e) {
            this.client.console.wtf('Error in play.js handler (Animetrivia.play())');
            this.client.console.wtf(e.stack);
        }

        await message.guild['player'].setVolume(0);
        while (message.guild['player'].volume < 100) {
            await Promise.all([new Promise(((resolve) => {
                setTimeout(async () => {
                    await message.guild['player'].setVolume(message.guild['player'].volume + 5);
                    resolve(true);
                }, 75)
            }))]);
        }

        try {
            const collector = await message.channel.createMessageCollector((msg) =>
                message.guild['trivia'].getPlayer(msg.author.id) &&
                op.names.map(n => n.toLowerCase()).includes(msg.content.toLowerCase()), { time: 15000, max: 1 });

            collector.on('end', async (coll) => {
                await message.guild['player'].text.sendLocale('COMMAND_ANIME-TRIVIA_FOUND', [coll.first() ? coll.first().author.username : 'Nobody', op]);
                if (coll.first()) {
                    const pl = await message.guild['trivia'].getPlayer(coll.first().author.id);
                    pl.addPoints(op.level);
                }

                await this.next(message);
            });
        } catch (e) {
            this.client.console.warn(e);
            await this.next(message);
        }
    }

    async next(message) {
        while (message.guild['player'].volume > 0) {
            await Promise.all([new Promise(((resolve) => {
                setTimeout(async () => {
                    await message.guild['player'].setVolume(message.guild['player'].volume - 5);
                    resolve(true);
                }, 75)
            }))]);
        }

        message.guild['player'].playNext();
    }
};
