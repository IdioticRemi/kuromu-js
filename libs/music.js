const { Collection } = require('discord.js');

module.exports.Player = class Player {
    constructor(client, guildID) {
        this.client     = client;
        this.guildID    = guildID;
        this.queue      = [];
        this._bassBoost = [];
        this.current    = null;
        this.text       = null;
        this.voice      = null;
        this.connection = null;
        this.volume     = 75;
        this.bassBoost  = 0;
        this.repeat     = 0;
        this.paused     = false;
    }

    get nowPlaying() {
        return this.queue[this.current] || null;
    }

    get connected () {
        const connection = this.client.voice.connections.get(this.guildID);

        return !!(connection);
    }

    get playing () {
        const connection = this.client.voice.connections.get(this.guildID);

        return !!(connection && connection.dispatcher);
    }

    setText(text) {
        this.text = text;
        return this;
    }

    setVoice(voice) {
        this.voice = voice;
        return this;
    }

    async setVolume(volume, force = false) {
        volume = force ? volume : Math.max(Math.min((Number(volume) || 0), 150), 0);

        if (this.playing) await this.connection.dispatcher.setVolumeLogarithmic((volume / 100).toFixed(2));

        this.volume = volume;
        return this;
    }

    setBassBoost(gain, force = false) {
        gain = force ? gain : Math.max(Math.min((Number(gain) || 0), 10), 0);

        this.bassBoost = gain;
		if (gain === 0) this._bassBoost = [];
		else this._bassBoost = ['-af', `equalizer=f=40:width_type=h:width=50:g=${gain}`];
        return this;
    }

    setRepeat (mode) {
        this.repeat = Math.max(Math.min((Number(mode) || 0), 2), 0);
        return this;
    }

    setCurrent (n) {
        this.current = n;
        return this;
    }

    setQueue (arr) {
        this.queue = arr;
        return this;
    }

    skip (n = 1) {
        if (this.repeat === 2) return this;
        else this.current += n - 1;
        return this;
    }

    prev () {
        if (this.current - 2 < 0 && this.repeat === 2) this.setCurrent(0);
        else if (this.current - 2 < 0) this.setCurrent(-1);
        else this.current -= 2;

        return this;
    }

    enqueue (song) {
        this.queue.push(song);
        return this;
    }

    async pause () {
        if (this.connected) {
            if (this.playing) {
                await this.connection.dispatcher.pause();
                this.paused = true;

                return true;
            }

            return false;
        }
        else {
            await this.destroy();

            return false;
        }
    }

    async resume () {
        if (this.connected) {
            if (this.playing) {
                await this.connection.dispatcher.resume();
                this.paused = false;

                return true;
            }

            return false;
        }
        else {
            await this.destroy();

            return false;
        }
    }

    async playNext () {
        if (this.connected) {
            if (this.playing) {
                await this.connection.dispatcher.end();

                return true;
            }

            return false;
        }
        else {
            await this.destroy();

            return false;
        }
    }

    shuffle () {
        const current = this.nowPlaying;

        this.queue = this.queue.shuffle();

        if (this.queue.includes(current) && this.queue.indexOf(current) !== 0) {
            [this.queue[this.queue.indexOf(current)], this.queue[0]] = [this.queue[0], this.queue[this.queue.indexOf(current)]];
        }

        this.setCurrent(0);

        return this;
    }

    clearQueue () {
        this.queue = [];

        return this;
    }

    async joinVoice () {
        if (!this.voice) return false;
        if (!this.voice.permissionsFor(this.client.user.id).has("CONNECT")) return false;
        if (!this.voice.permissionsFor(this.client.user.id).has("SPEAK")) return false;

        this.connection = await this.voice.join().catch(() => {
            return false
        });
        return true;
    }

    async destroy () {
        if (this.playing) {
            await this.connection.dispatcher.end();
        }

        if (this.connected) {
            await this.connection.disconnect();
            await this.connection.channel.leave();
        }

        await this.hardReset();

        return true;
    }

    async hardReset () {
        await this
            .clearQueue()
            .setCurrent(null)
            .setVoice(null)
            .setText(null)
            .setRepeat(0)
            .setBassBoost(0)
            .setVolume(100);

        this._bassboost = [];
        this.connection = null;
        this.paused = false;

        return this;
    }
};

module.exports.Song = class Song {
    constructor(video, user) {
        this.info     = video;
        this.duration = ((video.duration.hours * 3600) + (video.duration.minutes * 60) + video.duration.seconds);
        this.url      = `https://www.youtube.com/watch?v=${video.id}`;
        this.author   = video.raw.snippet.channelTitle;
        this.title    = video.title;
        this.user     = user;
    }

    format(d = this.duration) {
        return d.toString().toHHMMSS();
    }
};

module.exports.TriviaGame = class TriviaGame {
    constructor(guild) {
        this.guild   = guild;
        this.players = new Collection();
    }

    createPlayer(user) {
        this.players.set(user.id, new module.exports.TriviaPlayer(user));
        return this.getPlayer(user.id);
    }

    getPlayer (id) {
        let player = this.players.get(id);
        return player || null;
    }

    reset () {
        this.players = new Collection();

        return true;
    }
};

module.exports.TriviaPlayer = class TriviaPlayer {
    constructor(user) {
        this.user    = user;
        this.score   = 0;
        this.guessed = 0;
    }

    addPoints(level = 1) {
        this.score += level;
        this.guessed += 1;

        return this;
    }
};

module.exports.TriviaSong = class TriviaSong {
    constructor(op) {
        this.url   = op.yturl;
        this.level = op.level;
        this.title = op.names[0];
        this.names = op.names;
    }
};