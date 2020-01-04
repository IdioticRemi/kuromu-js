const {PermissionFlags: FLAGS} = require('discord.js');
const {PermissionLevels, util} = require('klasa');

module.exports.token = '';
module.exports.clientSecret = '';

module.exports.arcane = '';
module.exports.top_gg = '';

module.exports.youtube = '';

module.exports.provider = "mongodb"; // set this to 'json' if you don't want it

module.exports.mongodb = {
    host: '',
    port: '',
    user: '',
    password: '',
    db: ''
};

module.exports.colorBase = {
    shard: {background: 'cyan', text: 'black'},
    message: {},
    time: {background: 'lightcyan'}
};

module.exports.games = [
    [(client, stats) => `${stats.users} users.`, 'WATCHING'],
    [(client) => `${client.options.prefix}help`, 'PLAYING'],
    [(client) => `my owner ${[...client.owners].map(u => `${u.username}#${u.discriminator}`)[0]}`, 'LISTENING'],
    [(client, stats) => `${stats.guilds} guilds.`, 'WATCHING'],
    [(client) => `${client.options.prefix}help`, 'PLAYING'],
    [(client, stats) => `music in ${stats.connections} channels.`, 'PLAYING']
];

module.exports.permLvl = new PermissionLevels()
    .add(0, () => true)
    .add(3, ({guild, member}) => guild && member.permissions.has(FLAGS.KICK_MEMBERS), {fetch: true})
    .add(4, ({guild, member}) => guild && member.permissions.has(FLAGS.BAN_MEMBERS), {fetch: true})
    .add(5, ({guild, member}) => guild && member.permissions.has(FLAGS.MANAGE_GUILD), {fetch: true})
    .add(6, ({guild, member}) => guild && member.permissions.has(FLAGS.ADMINISTRATOR), {fetch: true})
    .add(7, ({guild, member}) => guild && member === guild.owner, {fetch: true})
    .add(8, ({author, client}) => {
        const member = client.guilds.get('594975995178778644').member(author.id);
        if (!member) return false;
        const map = member.roles.map(r => ['Moderators', 'Admins'].includes(r.name));
        return map.includes(true);
    }, {fetch: true})
    .add(9, ({author, client}) => client.owners.has(author), {break: true})
    .add(10, ({author, client}) => client.owners.has(author));

module.exports.clientConfig = {
    prefix: ["k."],
    commandEditing: true,
    commandLogging: true,
    fetchAllMembers: false,
    preserveSettings: false,
    console: {
        types: {
            startup: 'log',
            cleanup: 'log'
        },
        colors: {
            startup: util.mergeDefault(module.exports.colorBase, {time: {background: 'lightcyan'}}),
            cleanup: util.mergeDefault(module.exports.colorBase, {time: {background: 'lightyellow', text: 'grey'}})
        }
    },
    consoleEvents: {verbose: true},
    providers: {
        default: module.exports.provider || 'json',
        mongodb: module.exports.mongodb || {}
    },
    disabledEvents: [
        'CHANNEL_PINS_UPDATE',
        'GUILD_MEMBER_UPDATE',
        'PRESENCE_UPDATE',
        'TYPING_START',
        'USER_UPDATE'
    ],
    messageCacheLifetime: 900,
    messageCacheMaxSize: 300,
    messageSweepInterval: 180,
    schedule: {interval: 5000},
    pieceDefaults: {
        commands: {cooldown: 3}
    },
    slowmode: 750,
    slowmodeAggressive: true,
    typing: false,
    dashboardHooks: {
        apiPrefix: '/',
        port: 3001
    }
};