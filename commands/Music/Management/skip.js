const { Command } = require('klasa');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['next', 'playnext'],
            description: language => language.get('COMMAND_SKIP_DESCRIPTION'),
            usage: '[amount:str]'
        });
    }

    async run(message, [amount]) {
        if (!message.guild['player'].connected) return await message.sendLocale('MUSIC_PLAYER_NOT-CONNECTED');
        if (message.member.voice && message.member.voice.channelID !== message.guild['player'].voice.id) return await message.sendLocale('MUSIC_PLAYER_USER-NOT-CONNECTED');
        if (!message.guild['player'].playing) return await message.sendLocale('MUSIC_PLAYER_NOT-PLAYING');
        if (message.guild['trivia'].players.size > 0) return await message.sendLocale('MUSIC_PLAYER_TRIVIA-PLAYING');

        try {
            await message.guild['player'].resume();
        } catch (e) {
            e = null;
        }
        message.guild['player'].paused = false;

        if (!amount) await message.guild['player'].skip().playNext();
        else {
            const max = message.guild['player'].queue.length - message.guild['player'].current - 1;
            const min = 0 - message.guild['player'].current !== 0 ? 0 - message.guild['player'].current : -1;

            amount = Math.max(Math.min((Number(amount) || 0), max), min);

            if (amount + message.guild['player'].current < 0) amount = 0;

            await message.guild['player'].skip(amount).playNext();
        }
        return await message.sendLocale('COMMAND_SKIP', [amount || 1]);
    }

};