const { Task, Colors } = require('klasa');
const { SnowflakeUtil } = require('discord.js');

const THRESHOLD = 1000 * 60 * 15;

module.exports = class MemorySweeper extends Task {

    constructor(...args) {
        super(...args);

        this.colors = {
            red: new Colors({ text: 'lightred' }),
            yellow: new Colors({ text: 'lightyellow' }),
            green: new Colors({ text: 'green' })
        };

        this.shard = new Colors({ text: 'black', background: 'cyan' }).format(`[CLUSTER:${this.client.shard ? this.client.shard.id : 0}]`);
        this.usage = 0;
    }

    async run() {
        this.usage = process.memoryUsage().heapUsed;

        const OLD_SNOWFLAKE = SnowflakeUtil.generate(Date.now() - THRESHOLD);
        let presences = 0, guildMembers = 0, voiceStates = 0, emojis = 0, lastMessages = 0, users = 0;

        for (const guild of this.client.guilds.values()) {
            presences += guild.presences.size;
            guild.presences.clear();

            const { me } = guild;
            for (const [id, member] of guild.members) {
                if (member === me) continue;
                if (member.voice.channelID) continue;
                if (member.lastMessageID && member.lastMessageID > OLD_SNOWFLAKE) continue;
                guildMembers++;
                voiceStates++;
                guild.voiceStates.delete(id);
                guild.members.delete(id);
            }

            emojis += guild.emojis.size;
            guild.emojis.clear();
        }

        for (const channel of this.client.channels.values()) {
            if (!channel.lastMessageID) continue;
            channel.lastMessageID = null;
            lastMessages++;
        }

        this.client.users.filter(u => JSON.stringify(u.settings) === JSON.stringify(this.client.user.settings)).forEach(user => {
            if (user.lastMessageID && user.lastMessageID > OLD_SNOWFLAKE) return;
            this.client.users.delete(user.id);
            users++;
        });

        this.client.console.cleanup(
            `${this.shard} ${this.memory} ${
                this.setColor(presences)} [Presence]s | ${
                this.setColor(guildMembers)} [GuildMember]s | ${
                this.setColor(voiceStates)} [VoiceState]s | ${
                this.setColor(users)} [User]s | ${
                this.setColor(emojis)} [Emoji]s | ${
                this.setColor(lastMessages)} [Last Message]s.`);
    }

    get memory() {
        const mem = ((this.usage - process.memoryUsage().heapUsed) / 1024 / 1024).toFixed(2).toString().replace('-', '');

        return new Colors({ background: 'lightyellow', text: 'grey' }).format('[' + mem + ' MB]');
    }

    setColor(number) {
        const text = String(number);

        if (number > 1000) return this.colors.red.format(text);
        if (number > 100) return this.colors.yellow.format(text);

        return this.colors.green.format(text);
    }

    async init() {
        setInterval(async () => {
            await this.run();
        }, THRESHOLD)
    }

};
