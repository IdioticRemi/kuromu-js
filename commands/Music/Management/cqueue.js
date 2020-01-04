const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['cq', 'clearq'],
            description: language => language.get('COMMAND_CLEARQUEUE_DESCRIPTION')
        });
    }

    async run(message) {
        if (!message.guild['player'].connected) return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        if (message.member.voice && message.member.voice.channelID !== message.guild['player'].voice.id) return await message.sendLocale('MUSIC_PLAYER_USER-NOT-CONNECTED');
        if (message.guild['trivia'].players.size > 0) return await message.sendLocale('MUSIC_PLAYER_TRIVIA-PLAYING');

        const count = message.guild['player'].queue.length - 1;

        if (count <= 0) return await message.sendLocale('COMMAND_CLEARQUEUE_NO-SONGS');

        const current = message.guild['player'].nowPlaying;

        message.guild['player'].clearQueue();

        if (current) message.guild['player'].enqueue(current).setCurrent(0);

        return await message.sendLocale('COMMAND_CLEARQUEUE', [count]);
    }

};