const { Command, RichDisplay } = require('klasa');
const { MessageEmbed } = require('discord.js');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            aliases: ['pl', 'playlists'],
            description: language => language.get('COMMAND_PLAYLIST_DESCRIPTION'),
            usage: '<list|show|create|delete|edit> [name:str] [...]',
            subcommands: true,
            usageDelim: ' '
        });
    }

    async create(message, _name) {
        if (!message.guild.player.playing) return await message.sendLocale('MUSIC_PLAYER_NOT-PLAYING');
        if (_name.length === 0) return await message.sendLocale('COMMAND_PLAYLIST_NO-NAME');

        const pro = await message.author.settings.get('pro');

        if (message.guild.player.queue.length >= 80 && !pro) return await message.sendLocale('COMMAND_PLAYLIST-CREATE_TOO-MUCH-SONGS');
        else if (message.guild.player.queue.length >= 200) return await message.sendLocale('COMMAND_PLAYLIST-CREATE_TOO-MUCH-SONGS-VIP');

        const name = _name.join(' ').toLowerCase().replace(/:/g, ' ');

        if (name.length > 30) return await message.sendLocale('COMMAND_PLAYLIST_WRONG-LENGTH');

        const pl = new Map((await message.author.settings.get('playlists')).map(p => [p.name, p.songs]));

        if (pl.size >= 2 && !pro) return await message.sendLocale('COMMAND_PLAYLIST-CREATE_TOO-MUCH');
        else if (pl.size >= 20) return await message.sendLocale('COMMAND_PLAYLIST-CREATE_TOO-MUCH-VIP');

        if (pl.get(name)) return await message.sendLocale('COMMAND_PLAYLIST_ALREADY-EXISTS', [name]);

        const list = { name, songs: [] };

        message.guild.player.queue.forEach(s => list.songs.push({ title: s.title, url: s.url }));

        await message.author.settings.update('playlists', list, { arrayAction: 'add' });

        return await message.sendLocale('COMMAND_PLAYLIST-CREATE', [name, message.guild.player.queue.length]);
    }

    async delete(message, _name) {
        if (_name.length === 0) return await message.sendLocale('COMMAND_PLAYLIST_NO-NAME');

        const name = _name.join(' ').toLowerCase();

        if (name.length > 30) return await message.sendLocale('COMMAND_PLAYLIST_WRONG-LENGTH');

        const pl = await message.author.settings.get('playlists');

        if (!pl.find(p => p.name === name)) return await message.sendLocale('COMMAND_PLAYLIST_NOT_EXISTING', [name]);

        await message.author.settings.update('playlists', pl.find(p => p.name === name), { arrayAction: 'remove' });

        return await message.sendLocale('COMMAND_PLAYLIST-DELETE', [name]);
    }

    async edit(message, _name) {
        if (!message.guild.player.playing) return await message.sendLocale('MUSIC_PLAYER_NOT-PLAYING');
        if (_name.length === 0) return await message.sendLocale('COMMAND_PLAYLIST_NO-NAME');

        const pro = await message.author.settings.get('pro');

        if (message.guild.player.queue.length >= 80 && !pro) return await message.sendLocale('COMMAND_PLAYLIST-CREATE_TOO-MUCH-SONGS');
        else if (message.guild.player.queue.length >= 200) return await message.sendLocale('COMMAND_PLAYLIST-CREATE_TOO-MUCH-SONGS-VIP');

        const name = _name.join(' ').toLowerCase().replace(/:/g, ' ');

        if (name.length > 30) return await message.sendLocale('COMMAND_PLAYLIST_WRONG-LENGTH');

        const pl = new Map((await message.author.settings.get('playlists')).map(p => [p.name, p.songs]));

        if (!pl.get(name)) return await message.sendLocale('COMMAND_PLAYLIST_NOT_EXISTING', [name]);

        const list = { name, songs: [] };

        message.guild.player.queue.forEach(s => list.songs.push({ title: s.title, url: s.url }));

        await message.author.settings.update('playlists', pl.get(name), { arrayAction: 'remove' });
        await message.author.settings.update('playlists', list, { arrayAction: 'add' });

        return await message.sendLocale('COMMAND_PLAYLIST-EDIT', [name]);
    }

    async show(message, _name) {
        if (_name.length === 0) return await message.sendLocale('COMMAND_PLAYLIST_NO-NAME');

        const name = _name.join(' ').toLowerCase();

        if (name.length > 30) return await message.sendLocale('COMMAND_PLAYLIST_WRONG-LENGTH');

        const pl = new Map((await message.author.settings.get('playlists')).map(p => [p.name, p.songs]));

        if (!pl.get(name)) return await message.sendLocale('COMMAND_PLAYLIST_NOT_EXISTING', [name]);

        const display = new RichDisplay(new MessageEmbed()
            .setColor(this.client.accent)
            .setTitle(name)
        );

        const playlist = Array.from(pl.get(name));
        let id = 0;

        while (playlist.length !== 0) {
            const list = playlist.splice(0, 10);

            display.addPage(template => template.setDescription(list.map(s =>
                `|\`${(++id).toString().padStart((pl.get(name).length).toString().length, '0')}\`| [${s.title}](${s.url})`).join("\n")));
        }

        return await display.run(message, { filter: (reaction, user) => user.id === message.author.id })
    }

    async list(message) {
        const pl = (await message.author.settings.get("playlists")).map(p => p.name).sort();

        if (pl.length === 0) return await message.sendLocale('COMMAND_PLAYLIST-LIST_NOT_ANY');

        const length = pl.reduce((long, str) => Math.max(long, str.length), 0);

        let text = [];
        if (pl.length >= 10) {
            for (let i = 0; i < pl.length; i += 2) {
                text.push(`[››](http://a.a/) \`${pl[i].padEnd(length)}\` ${pl[i+1] ? `[››](http://a.a/) \`${pl[i + 1].padEnd(length)}\`` : ''}`);
            }
        } else {
            pl.map(p => text.push(`[››](http://a.a/) \`${p.padEnd(length)}\``));
        }

        const listsEmbed = new MessageEmbed()
            .setColor(this.client.accent)
            .setDescription(text.join('\n'))
            .setTitle(message.language.get('COMMAND_PLAYLIST-LIST_TITLE', message.author.tag))
            .setFooter(message.author.id)
            .setTimestamp();

        return await message.channel.send(listsEmbed);
    };

};