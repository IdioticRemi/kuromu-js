const { Language, util } = require('klasa');
const { MessageEmbed } = require('discord.js');
const { Util } = require('discord.js');
const emojis = require("../libs/emojis");

module.exports = class extends Language {

	constructor(...args) {
		super(...args);
		this.language = {
			DEFAULT: (key) => `${key} has not been localized for en-US yet.`,
			DEFAULT_LANGUAGE: 'Default Language',

			PREFIX_REMINDER: (prefix = `@${this.client.user.tag}`) => `The prefix${Array.isArray(prefix) && prefix.length > 1 ?
				`es for this guild are: ${prefix.map(pre => `\`${pre}\``).join(', ')}` :
				` in this guild is set to: \`${prefix}\``
			}`,

			SETTING_GATEWAY_EXPECTS_GUILD: 'The parameter <Guild> expects either a Guild or a Guild Object.',
			SETTING_GATEWAY_VALUE_FOR_KEY_NOEXT: (data, key) => `The value ${data} for the key ${key} does not exist.`,
			SETTING_GATEWAY_VALUE_FOR_KEY_ALREXT: (data, key) => `The value ${data} for the key ${key} already exists.`,
			SETTING_GATEWAY_SPECIFY_VALUE: 'You must specify the value to add or filter.',
			SETTING_GATEWAY_KEY_NOT_ARRAY: (key) => `The key ${key} is not an Array.`,
			SETTING_GATEWAY_KEY_NOEXT: (key) => `The key ${key} does not exist in the current data schema.`,
			SETTING_GATEWAY_INVALID_TYPE: 'The type parameter must be either add or remove.',
			SETTING_GATEWAY_INVALID_FILTERED_VALUE: (piece, value) => `${piece.key} doesn't accept the value: ${value}`,

			RESOLVER_MULTI_TOO_FEW: (name, min = 1) => `Provided too few ${name}s. At least ${min} ${min === 1 ? 'is' : 'are'} required.`,
			RESOLVER_INVALID_BOOL: (name) => `${name} must be true or false.`,
			RESOLVER_INVALID_CHANNEL: (name) => `${name} must be a channel tag or valid channel id.`,
			RESOLVER_INVALID_CUSTOM: (name, type) => `${name} must be a valid ${type}.`,
			RESOLVER_INVALID_DATE: (name) => `${name} must be a valid date.`,
			RESOLVER_INVALID_DURATION: (name) => `${name} must be a valid duration string.`,
			RESOLVER_INVALID_EMOJI: (name) => `${name} must be a custom emoji tag or valid emoji id.`,
			RESOLVER_INVALID_FLOAT: (name) => `${name} must be a valid number.`,
			RESOLVER_INVALID_GUILD: (name) => `${name} must be a valid guild id.`,
			RESOLVER_INVALID_INT: (name) => `${name} must be an integer.`,
			RESOLVER_INVALID_LITERAL: (name) => `Your option did not match the only possibility: ${name}`,
			RESOLVER_INVALID_MEMBER: (name) => `${name} must be a mention or valid user id.`,
			RESOLVER_INVALID_MESSAGE: (name) => `${name} must be a valid message id.`,
			RESOLVER_INVALID_PIECE: (name, piece) => `${name} must be a valid ${piece} name.`,
			RESOLVER_INVALID_REGEX_MATCH: (name, pattern) => `${name} must follow this regex pattern \`${pattern}\`.`,
			RESOLVER_INVALID_ROLE: (name) => `${name} must be a role mention or role id.`,
			RESOLVER_INVALID_STRING: (name) => `${name} must be a valid string.`,
			RESOLVER_INVALID_TIME: (name) => `${name} must be a valid duration or date string.`,
			RESOLVER_INVALID_URL: (name) => `${name} must be a valid url.`,
			RESOLVER_INVALID_USER: (name) => `${name} must be a mention or valid user id.`,
			RESOLVER_STRING_SUFFIX: ' characters',
			RESOLVER_MINMAX_EXACTLY: (name, min, suffix) => `${name} must be exactly ${min}${suffix}.`,
			RESOLVER_MINMAX_BOTH: (name, min, max, suffix) => `${name} must be between ${min} and ${max}${suffix}.`,
			RESOLVER_MINMAX_MIN: (name, min, suffix) => `${name} must be greater than ${min}${suffix}.`,
			RESOLVER_MINMAX_MAX: (name, max, suffix) => `${name} must be less than ${max}${suffix}.`,

			REACTIONHANDLER_PROMPT: 'Which page would you like to jump to?',

			COMMANDMESSAGE_MISSING: `${emojis.n} Missing one or more required arguments after end of input.`,
			COMMANDMESSAGE_MISSING_REQUIRED: (name) => `${emojis.n} **${name}** is a required argument.`,
			COMMANDMESSAGE_MISSING_OPTIONALS: (possibles) => `${emojis.n} Missing a required option: (${possibles})`,
			COMMANDMESSAGE_NOMATCH: (possibles) => `${emojis.n} Could not match any subcommand, available ones are: **${possibles.split(', ').join(`**, **`)}**.`,

			MONITOR_COMMAND_HANDLER_REPROMPT: (tag, error, time, abortOptions) => `${tag} | **${error}** | You have **${time}** seconds to respond to this prompt with a valid argument. Type **${abortOptions.join('**, **')}** to abort this prompt.`,
			MONITOR_COMMAND_HANDLER_REPEATING_REPROMPT: (tag, name, time, cancelOptions) => `${tag} | **${name}** is a repeating argument | You have **${time}** seconds to respond to this prompt with additional valid arguments. Type **${cancelOptions.join('**, **')}** to cancel this prompt.`,
			MONITOR_COMMAND_HANDLER_ABORTED: 'Aborted',

			INHIBITOR_COOLDOWN: (remaining) => `You have just used this command. You can use this command again in ${remaining} second${remaining === 1 ? '' : 's'}.`,
			INHIBITOR_DISABLED_GUILD: 'This command has been disabled by an admin in this guild.',
			INHIBITOR_DISABLED_GLOBAL: 'This command has been globally disabled by the bot owner.',
			INHIBITOR_MISSING_BOT_PERMS: (missing) => `Insufficient permissions, missing: **${missing}**`,
			INHIBITOR_NSFW: 'You can only use NSFW commands in NSFW channels.',
			INHIBITOR_PERMISSIONS: 'You do not have permission to use this command.',
			INHIBITOR_REQUIRED_SETTINGS: (settings) => `The guild is missing the **${settings.join(', ')}** guild setting${settings.length !== 1 ? 's' : ''} and thus the command cannot run.`,
			INHIBITOR_RUNIN: (types) => `This command is only available in ${types} channels.`,
			INHIBITOR_RUNIN_NONE: (name) => `The ${name} command is not configured to run in any channel.`,

			COMMAND_BLACKLIST_DESCRIPTION: 'Blacklists or un-blacklists users and guilds from the bot.',
			COMMAND_BLACKLIST_SUCCESS: (usersAdded, usersRemoved, guildsAdded, guildsRemoved) => [
				usersAdded.length ? `**Users Added**\n${util.codeBlock('', usersAdded.join(', '))}` : '',
				usersRemoved.length ? `**Users Removed**\n${util.codeBlock('', usersRemoved.join(', '))}` : '',
				guildsAdded.length ? `**Guilds Added**\n${util.codeBlock('', guildsAdded.join(', '))}` : '',
				guildsRemoved.length ? `**Guilds Removed**\n${util.codeBlock('', guildsRemoved.join(', '))}` : ''
			].filter(val => val !== '').join('\n'),

			COMMAND_EVAL_DESCRIPTION: 'Evaluates arbitrary Javascript. Reserved for bot owner.',
			COMMAND_EVAL_EXTENDED: [
				"The eval command evaluates code as-in, any error thrown from it will be handled.",
				"It also uses the flags feature. Write --silent, --depth=number or --async to customize the output.",
				"--wait: changes the time the eval will run. Defaults to 10 seconds. Accepts time in milliseconds.",
				"--output: --output-to flag accept either 'file', 'log', 'haste' or 'hastebin'.",
				"--delete: makes the command delete the message that executed the message after evaluation.",
				"--silent: will make it output nothing.",
				"--depth: accepts a number, for example, --depth=2, to customize util.inspect's depth.",
				"--async: will wrap the code into an async function where you can enjoy the use of await, however, if you want to return something, you will need the return keyword",
				"--showHidden: will enable the showHidden option in util.inspect.",
				"--lang or --language: allow different syntax highlight for the output.",
				"--json: converts the output to json",
				"--no-timeout: disables the timeout",
				"If the output is too large, it'll send the output as a file, or in the console."
			].join('\n'),
			COMMAND_EVAL_TIMEOUT: (seconds) => `TIMEOUT: Took longer than ${seconds} seconds.`,
			COMMAND_EVAL_ERROR: (time, output, type) => `**Error**:${output}\n**Type**:${type}\n${time}`,
			COMMAND_EVAL_OUTPUT: (time, output, type) => `**Output**:${output}\n**Type**:${type}\n${time}`,
			COMMAND_EVAL_OUTPUT_CONSOLE: (time, type) => `Sent the result to console.\n**Type**:${type}\n${time}`,
			COMMAND_EVAL_OUTPUT_FILE: (time, type) => `Sent the result as a file.\n**Type**:${type}\n${time}`,
			COMMAND_EVAL_OUTPUT_HASTEBIN: (time, url, type) => `Sent the result to hastebin: ${url}\n**Type**:${type}\n${time}\n`,

			COMMAND_UNLOAD: (type, name) => `${emojis.y} Unloaded ${type}: ${name}`,
			COMMAND_UNLOAD_DESCRIPTION: 'Unloads the klasa piece.',
			COMMAND_UNLOAD_WARN: 'You probably don\'t want to unload that, since you wouldn\'t be able to run any command to enable it again',

			COMMAND_TRANSFER_ERROR: `${emojis.n} That file has been transfered already or never existed.`,
			COMMAND_TRANSFER_SUCCESS: (type, name) => `${emojis.y} Successfully transferred ${type}: ${name}.`,
			COMMAND_TRANSFER_FAILED: (type, name) => `Transfer of ${type}: ${name} to Client has failed. Please check your Console.`,
			COMMAND_TRANSFER_DESCRIPTION: 'Transfers a core piece to its respective folder.',

			COMMAND_RELOAD: (type, name, time) => `${emojis.y} Reloaded ${type}: ${name}. (Took: ${time})`,
			COMMAND_RELOAD_FAILED: (type, name) => `${emojis.n} Failed to reload ${type}: ${name}. Please check your Console.`,
			COMMAND_RELOAD_ALL: (type, time) => `${emojis.y} Reloaded all ${type}. (Took: ${time})`,
			COMMAND_RELOAD_EVERYTHING: (time) => `${emojis.y} Reloaded everything. (Took: ${time})`,
			COMMAND_RELOAD_DESCRIPTION: 'Reloads a klasa piece, or all pieces of a klasa store.',

			COMMAND_REBOOT: 'Rebooting...',
			COMMAND_REBOOT_DONE: (timestamp, friendly) => `${emojis.y} Successfully rebooted. (Took: ${timestamp && friendly})`,
			COMMAND_REBOOT_DESCRIPTION: 'Reboots the bot.',

			COMMAND_LOAD: (time, type, name) => `${emojis.y} Successfully loaded ${type}: ${name}. (Took: ${time})`,
			COMMAND_LOAD_FAIL: 'The file does not exist, or an error occurred while loading your file. Please check your console.',
			COMMAND_LOAD_ERROR: (type, name, error) => `${emojis.n} Failed to load ${type}: ${name}. Reason:${util.codeBlock('js', error)}`,
			COMMAND_LOAD_DESCRIPTION: 'Load a piece from your bot.',

			COMMAND_PING: 'Ping?',
			COMMAND_PING_DESCRIPTION: 'Runs a connection test to Discord.',
			COMMAND_PINGPONG: (diff, ping) => `Pong! (Roundtrip took: ${diff}ms. Heartbeat: ${ping}ms.)`,

			COMMAND_INVITE: () => [
				`To add ${this.client.user.username} to your discord guild:`,
				`<${this.client.invite}>`,
				util.codeBlock('', [
					'The above link is generated requesting the minimum permissions required to use every command currently.',
					'I know not all permissions are right for every guild, so don\'t be afraid to uncheck any of the boxes.',
					'If you try to use a command that requires more permissions than the bot is granted, it will let you know.'
				].join(' ')),
				'Please file an issue at <https://github.com/dirigeants/klasa> if you find any bugs.'
			],
			COMMAND_INVITE_DESCRIPTION: 'Displays the invite link of the bot, to invite it to your guild.',

			COMMAND_INFO: [
				"Klasa is a 'plug-and-play' framework built on top of the Discord.js library.",
				'Most of the code is modularized, which allows developers to edit Klasa to suit their needs.',
				'',
				'Some features of Klasa include:',
				'• 🐇💨 Fast loading times with ES2017 support (`async`/`await`)',
				'• 🎚🎛 Per-client/guild/user settings that can be extended with your own fields',
				'• 💬 Customizable command system with automated parameter resolving and the ability to load/reload commands on-the-fly',
				'• 👀 "Monitors", which can watch messages and edits (for swear filters, spam protection, etc.)',
				'• ⛔ "Inhibitors", which can prevent commands from running based on any condition you wish to apply (for permissions, blacklists, etc.)',
				'• 🗄 "Providers", which simplify usage of any database of your choosing',
				'• ${emojis.y} "Finalizers", which run after successful commands (for logging, collecting stats, cleaning up responses, etc.)',
				'• ➕ "Extendables", which passively add methods, getters/setters, or static properties to existing Discord.js or Klasa classes',
				'• 🌐 "Languages", which allow you to localize your bot\'s responses',
				'• ⏲ "Tasks", which can be scheduled to run in the future, optionally repeating',
				'',
				'We hope to be a 100% customizable framework that can cater to all audiences. We do frequent updates and bugfixes when available.',
				"If you're interested in us, check us out at https://klasa.js.org"
			],
			COMMAND_INFO_DESCRIPTION: 'Provides some information about this bot.',

			'COMMAND_HELP_NO_EXTENDED': 'No extended help available.',
			'COMMAND_HELP_CMD': (name) => `Command: ${name}`,
			'COMMAND_HELP_CATEGORY': (category) => `${category} commands`,
			'COMMAND_HELP_REQUESTED': (tag) => `Requested by ${tag}`,
			'COMMAND_HELP_LOADING': `:gear: Generating Display...`,
			'COMMAND_HELP_USAGE': 'Usage',
			'COMMAND_HELP_EXTENDED': 'Extended Help',
			'COMMAND_HELP_INFO': 'Information Page',
			'COMMAND_HELP_INFOS': 'This is Kuromu\'s information page!\n\nNavigate using the reactions at the bottom!\n*Make sure I have the right permissions*',
			'COMMAND_HELP_DESCRIPTION': 'Display help for a command.',

			COMMAND_ENABLE: (type, name) => `+ Successfully enabled ${type}: ${name}`,
			COMMAND_ENABLE_DESCRIPTION: 'Re-enables or temporarily enables a command/inhibitor/monitor/finalizer. Default state restored on reboot.',

			COMMAND_DISABLE: (type, name) => `+ Successfully disabled ${type}: ${name}`,
			COMMAND_DISABLE_DESCRIPTION: 'Re-disables or temporarily disables a command/inhibitor/monitor/finalizer/event. Default state restored on reboot.',
			COMMAND_DISABLE_WARN: 'You probably don\'t want to disable that, since you wouldn\'t be able to run any command to enable it again',

			COMMAND_CONF_NOKEY: 'You must provide a key',
			COMMAND_CONF_NOVALUE: 'You must provide a value',
			COMMAND_CONF_GUARDED: (name) => `${util.toTitleCase(name)} may not be disabled.`,
			COMMAND_CONF_UPDATED: (key, response) => `Successfully updated the key **${key}**: \`${response}\``,
			COMMAND_CONF_KEY_NOT_ARRAY: 'This key is not array type. Use the action \'reset\' instead.',
			COMMAND_CONF_GET_NOEXT: (key) => `The key **${key}** does not seem to exist.`,
			COMMAND_CONF_GET: (key, value) => `The value for the key **${key}** is: \`${value}\``,
			COMMAND_CONF_RESET: (key, response) => `The key **${key}** has been reset to: \`${response}\``,
			COMMAND_CONF_NOCHANGE: (key) => `The value for **${key}** was already that value.`,
			COMMAND_CONF_SERVER_DESCRIPTION: 'Define per-guild settings.',
			COMMAND_CONF_SERVER: (key, list) => `**Guild Settings${key}**\n${list}`,
			COMMAND_CONF_USER_DESCRIPTION: 'Define per-user settings.',
			COMMAND_CONF_USER: (key, list) => `**User Settings${key}**\n${list}`,

			COMMAND_STATS: (memUsage, uptime, users, guilds, channels, klasaVersion, discordVersion, processVersion, message) =>
				new MessageEmbed()
					.setColor(this.client['accent'])
					.setTitle('Kuromu\'s Statistics')
					.setDescription([
						`[››](http://a.a/) Mem Usage: **${memUsage} MB**`,
						`Uptime: **${uptime}**`,
						`Users: **${users}**`,
						`Guilds: **${guilds}**`,
						`Channels: **${channels}**`,
						`Klasa: **v${klasaVersion}**`,
						`Discord.js: **v${discordVersion}**`,
						`Node.js: **${processVersion}**`,
						`Shard(s): **${(message.guild ? message.guild.shardID : 0) + 1} / ${this.client.shard.shardCount}**`
					].join('\n[››](http://a.a/) ')),
			COMMAND_STATS_DESCRIPTION: 'Provides some details about the bot and stats.',

			MESSAGE_PROMPT_TIMEOUT: 'The prompt has timed out.',
			TEXT_PROMPT_ABORT_OPTIONS: ['abort', 'stop', 'cancel'],

			'MUSIC_PLAYER_NO-VOICE': `${emojis.n} I'm sorry but you have to be inside a voice channel in order to do that.`,
			'MUSIC_PLAYER_NOT-CONNECTED': `${emojis.n} I'm sorry but I'm not connected to any voice channel.`,
			'MUSIC_PLAYER_USER-NOT-CONNECTED': `${emojis.n} I'm sorry but you must be connected to the channel I am in to do that.`,
			'MUSIC_PLAYER_NOT-PLAYING': `${emojis.n} I'm sorry but I'm not playing any music right now.`,
			'MUSIC_PLAYER_TRIVIA-PLAYING': `${emojis.n} I'm sorry but a trivia game is running, you cannot do this at the moment.`,

			'COMMAND_QUEUE_EMPTY': `${emojis.n} I'm sorry but I couldn't find any song in the queue.`,
			'COMMAND_QUEUE_DESCRIPTION': 'Check what\'s next in the queue.',

            'COMMAND_JOIN_NOT-JOINABLE': `${emojis.n} I'm sorry but I don't have permissions to join this channel.`,
			'COMMAND_JOIN_NO-SUCCESS': `${emojis.n} I'm sorry but something made me unable to join the voice channel.`,
            'COMMAND_JOIN': (name, bitrate) => `${emojis.y} Joined channel **${name}**. Channel bitrate is: **${bitrate} kbps**.`,
            'COMMAND_JOIN_DESCRIPTION': 'Join the voice channel you are in.',

			'COMMAND_LEAVE': (name) => `${emojis.y} Left channel **${name}**.`,
			'COMMAND_LEAVE_DESCRIPTION': 'Leave the bound voice channel.',

			'COMMAND_CLEARQUEUE_NO-SONGS': `${emojis.n} I'm sorry but the queue already is empty.`,
			'COMMAND_CLEARQUEUE': (count) => `${emojis.y} Successfully cleared queue. (**${count} songs**)`,
			'COMMAND_CLEARQUEUE_DESCRIPTION': 'Clear the current music queue',

			'COMMAND_VOLUME-SET_NO-VOLUME': `${emojis.n} I'm sorry but you have to provide a valid volume number.`,
			'COMMAND_VOLUME-SET': (volume) => `${emojis.y} Volume set to **${volume} %**.`,
			'COMMAND_VOLUME-SHOW': (volume) => `${emojis.y} Current volume is **${volume} %**.`,
			'COMMAND_VOLUME-RESET': (volume) => `${emojis.y} Volume has been set back to it's default value: **${volume} %**.`,
			'COMMAND_VOLUME_DESCRIPTION': 'Change or show music\'s volume.',

			'COMMAND_PLAY_NO-SEARCH': `${emojis.n} Please provide a valid URI or a search query.`,
			'COMMAND_PLAY_QUEUE-LIMIT': (limit) => `${emojis.n} You reached the queue size limit which is **${limit} songs**.${limit === 20 ? '\nYou may consider purchasing our **Kuromu PRO (Guild)**,\nwhich will expand your limit to **up to 80 songs** for this server.' : ''}`,
			'COMMAND_PLAY_RESOLVER': (videos) => {
				let desc = '', i = 1;
				videos.forEach(v => {
					desc += `\n${i++} [››](http://a.a/) ${v}`;
				});

				return new MessageEmbed()
					.setTitle('Music Choice(s)')
					.setColor(this.client['accent'])
					.setDescription(desc)
			},
			'COMMAND_PLAY_PROMPT': `:hash: Which song would you like to play? (1-5)`,
			'COMMAND_PLAY_PROMPT-NO-ANSWER': `${emojis.n} Found no valid answer, aborted the process.`,
			'COMMAND_PLAY_NO-RESULTS': (query) => `${emojis.n} No results were found for **${query}**.`,
			'COMMAND_PLAY_PLAYLIST-QUEUE-SIZE': (limit) => `${emojis.n} This playlist contains too many songs, can't play it. (Your limit: **${limit} songs**).${limit === 20 ? '\nYou may consider purchasing our **Kuromu PRO (Guild)** which will expand your limit to **up to 80 songs** for this server.' : ''}`,
			'COMMAND_PLAY_PLAYLIST-LOAD': (title, author, user) => `${emojis.y} Loading playlist **${title}** by **${author}** requested by **${user}**.`,
			'COMMAND_PLAY_PLAYLIST': (title, author, user) => `${emojis.y} Enqueued playlist **${title}** by **${author}** requested by **${user}**.`,
			'COMMAND_PLAY_ENQUEUE': (title, author, user) => `${emojis.y} Enqueued **${title}** by **${author}** requested by **${user}**.`,
			'COMMAND_PLAY_ENDED': `:stop_button: No more music found in the queue, stopped playing.`,
			'COMMAND_PLAY_ISSUE': (title, author) => `${emojis.n} Could not play **${title}** by **${author}** probably due to country limitations.`,
			'COMMAND_PLAY_ERROR': (stacktrace) => `${emojis.n} An error occured. Report this to the developpers: \`\`\`xl\n${stacktrace}\`\`\``,
			'COMMAND_PLAY_SONG': (title, author, user) => `:arrow_forward: Now playing **${title}** by **${author}** requested by **${user}**.`,
			'COMMAND_PLAY_DESCRIPTION': 'Play some music from Youtube.',

			'COMMAND_PAUSE_ALREADY-PAUSED': `${emojis.n} Music player is already paused.`,
			'COMMAND_PAUSE': `${emojis.y} Music player has been **paused**.`,
			'COMMAND_PAUSE_DESCRIPTION': 'Pause the music player.',

			'COMMAND_RESUME_ALREADY-PLAYING': `${emojis.n} Music player is already playing.`,
			'COMMAND_RESUME': `${emojis.y} Music player has been **resumed**.`,
			'COMMAND_RESUME_DESCRIPTION': 'Resume the music player.',

			'COMMAND_SKIP': (amount) => `${emojis.y} Music player successfully skipped **${amount}** song${amount > 1 ? 's' : ''}.`,
			'COMMAND_SKIP_DESCRIPTION': 'Skip a certain amount of songs.',

			'COMMAND_PREVIOUS': `${emojis.y} Music player is now playing previous song.`,
			'COMMAND_PREVIOUS_DESCRIPTION': 'Play previous song in the queue.',

			'COMMAND_REPEAT-SET_NO-MODE': `${emojis.n} I'm sorry but you have to provide a valid mode number (0, 1, 2).`,
			'COMMAND_REPEAT-SET': (mode) => `${emojis.y} Now repeating **${mode === 0 ? 'nothing' : mode === 1 ? 'the queue' : 'the current song'}**.`,
			'COMMAND_REPEAT-SHOW': (mode) => `${emojis.y} Current mode is set to repeat **${mode === 0 ? 'nothing' : mode === 1 ? 'the queue' : 'the current song'}**.`,
			'COMMAND_REPEAT-RESET': (mode) => `${emojis.y} Repeat mode has been set back to it's default value: **${mode === 0 ? 'nothing' : mode === 1 ? 'the queue' : 'the current song'}**`,
			'COMMAND_REPEAT_DESCRIPTION': 'Change or show music\'s repeat mode.',

			'COMMAND_PLAYLIST-CREATE_TOO-MUCH-SONGS': `${emojis.n} There are more than 80 songs to save, which is your maximum since you aren't a **PRO** user.\n> Consider buying **PRO** for a max amount of 200 songs per playlist.`,
			'COMMAND_PLAYLIST-CREATE_TOO-MUCH-SONGS-VIP': `${emojis.n} I'm sorry cool person but your limit is 200 songs per playlist.\n> Consider seeking some songs in order to create a new playlist.`,
			'COMMAND_PLAYLIST-CREATE_TOO-MUCH': `${emojis.n} You already have **2** playlists, which is your maximum since you aren't a **PRO** user.\n> Consider buying **PRO** for a max amount of 20 playlists.`,
			'COMMAND_PLAYLIST-CREATE_TOO-MUCH-VIP': `${emojis.n} I'm sorry cool person but you already got your 20 custom playlists.\n> Consider deleting one if you want to create another one.`,
			'COMMAND_PLAYLIST-CREATE': (name, count) => `${emojis.y} Created playlist **${name}** with **${count} songs**.`,
			'COMMAND_PLAYLIST-DELETE': (name) => `${emojis.y} Deleted playlist **${name}**.`,
			'COMMAND_PLAYLIST-EDIT': (name) => `${emojis.y} Successfully edited playlist **${name}**.`,
			'COMMAND_PLAYLIST-LIST_NOT_ANY': `${emojis.n} You aint got any playlist.`,
			'COMMAND_PLAYLIST-LIST_TITLE': (user) =>  `${user}'s playlists`,
			'COMMAND_PLAYLIST_NO-NAME': `${emojis.n} You have to provide a name in order to do that.`,
			'COMMAND_PLAYLIST_WRONG-LENGTH': `${emojis.n} Playlist's name exeeded 30 characters.`,
			'COMMAND_PLAYLIST_ALREADY-EXISTS': `${emojis.n} A playlist with that name already exists.`,
			'COMMAND_PLAYLIST_NOT_EXISTING': (name) => `${emojis.n} No playlist found with the name **${name}**.`,
			'COMMAND_PLAYLIST_DESCRIPTION': 'Manage your personal playlists.',

			'COMMAND_NOWPLAYING': (title, author) => `:arrow_forward: Currently playing **${Util.escapeMarkdown(title)}** by **${Util.escapeMarkdown(author)}**`,
			'COMMAND_NOWPLAYING_DESCRIPTION': 'Check what song is playing.',

			'COMMAND_SEEK': (amount) => `${emojis.y} Music player successfully seeked **${amount}** song${amount > 1 ? 's' : ''}.`,
			'COMMAND_SEEK_DESCRIPTION': 'Seek a certain amount of songs.',

			'COMMAND_ANIME-TRIVIA_NEED-MORE-USERS': `${emojis.n} I'm sorry but you need at least two players to play this!`,
			'COMMAND_ANIME-TRIVIA_TOO-MUCH': (limit) => `${emojis.n} I'm sorry but your trivia songs limit is ${limit}!${limit === 20 ? '\nYou may consider purchasing our **Kuromu PRO (Guild)**, which will expand the limit to **up to 80 openings** for this server.' : ''}`,
			'COMMAND_ANIME-TRIVIA_ALREADY-PLAYING': `${emojis.n} I'm sorry but a game is already running or music is running!`,
			'COMMAND_ANIME-TRIVIA_STARTED': `:arrow_forward: Pay attention! The blind test has started! Good luck everyone!\n:information_source: When a music starts, just say the name of the anime in the chat!`,
			'COMMAND_ANIME-TRIVIA_FOUND': (author, op) => `${emojis.y} **${Util.escapeMarkdown(author)}** found it! It was from **${op.title}**!${author === 'Nobody' ? '' : ` They got ${op.level} points!`}`,
			'COMMAND_ANIME-TRIVIA_ENDED': (scores) => {
				let desc = '', i = 1;
				scores.forEach(p => {
					desc += `\n${i++} [››](http://a.a/) **${p.user.username}** with **${p.score} points** (guessed **${p.guessed} songs**)`;
				});

				return new MessageEmbed()
					.setColor(this.client['accent'])
					.setTitle('Blind Test\'s scores!')
					.setDescription(desc)
			},
			'COMMAND_ANIME-TRIVIA_ERR': (stacktrace) => `${emojis.n} An error occured. Report this to the developpers: \`\`\`xl\n${stacktrace}\`\`\``,
			'COMMAND_ANIME-TRIVIA_DESCRIPTION': 'Start an anime opening trivia!',

			'COMMAND_BASSBOOST-SET_NO-GAIN': `${emojis.n} I'm sorry but you have to provide a valid gain number.`,
			'COMMAND_BASSBOOST-SET': (volume) => `${emojis.y} Bassboost set to **${volume} db**. This will get applied when the next song plays!`,
			'COMMAND_BASSBOOST-SHOW': (volume) => `${emojis.y} Current bassboost is **${volume} db**.`,
			'COMMAND_BASSBOOST-RESET': (volume) => `${emojis.y} Bassboost has been set back to it's default value: **${volume} db**.`,
			'COMMAND_BASSBOOST_DESCRIPTION': 'Change or show music\'s bassboost.',

			'COMMAND_SHUFFLE': `${emojis.y} The current queue has been shuffled successfully.`,
			'COMMAND_SHUFFLE_DESCRIPTION': 'Shuffle the current music queue.'
		};
	}

	async init() {
		await super.init();
	}

};
