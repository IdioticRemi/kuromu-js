const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['np', 'nowp'],
            description: language => language.get('COMMAND_NOWPLAYING_DESCRIPTION'),
            usage: '[amount:str]'
        });
    }

    async run(message, [amount]) {
        if (!message.guild['player'].connected) return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        if (!message.guild['player'].playing) return await message.sendLocale('MUSIC_PLAYER_NOT-PLAYING');
        if (message.guild['trivia'].players.size > 0) return await message.sendLocale('MUSIC_PLAYER_TRIVIA-PLAYING');

        const current = message.guild['player'].nowPlaying;

        return await message.sendLocale('COMMAND_NOWPLAYING', [current.title, current.author]);
    }

};