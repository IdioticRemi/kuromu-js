// Default NodeJS Imports

const { Client } = require("klasa");

// Libs import

const { permLvl } = require("./libs/config");

// Client setup

class KuromuClient extends Client {
    constructor(options) {
        super({
            ...options,
            permissionLevels: permLvl
        });

        this.accent = '#ffa7f4';

        this.console.startup = (...data) => this.console.write(data, 'startup');
        this.console.cleanup = (...data) => this.console.write(data, 'cleanup');
    }
}

// Gateways setups

KuromuClient.defaultClientSchema
    .add('restart', folder => folder
        .add('timestamp', 'bigint', { min: 0 })
        .add('message', 'messagepromise'));

KuromuClient.defaultGuildSchema
    .add('pro', 'boolean', { configurable: false, default: false })
    .add('channels', folder => folder
        .add('modlogs', 'textchannel', { configurable: false, default: null })
        .add('welcome', 'textchannel', { configurable: false, default: null })
        .add('goodbye', 'textchannel', { configurable: false, default: null })
        .add('logs', 'textchannel', { configurable: false, default: null }));

KuromuClient.defaultUserSchema
    .add('pro', 'boolean', { configurable: false, default: false })
    .add('playlists', 'any', { configurable: false, default: [], array: true });

KuromuClient.use(require('klasa-dashboard-hooks'));

module.exports = KuromuClient;