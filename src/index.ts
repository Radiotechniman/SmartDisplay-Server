#!/usr/bin/env node

const clear = require('clear');

import process from 'process';
import program from 'commander';
import exitHook from 'exit-hook';

import packageJson from '../package.json';

import { Server } from './server';

program
    .description(packageJson.description)
    .version(packageJson.version)
    .parse(process.argv);

clear();
console.log('SmartDisplay');

let server: Server;

/*process.on('SIGTERM', code => {
    client.publish('awtrix-server', 'exit');
    return console.log(`About to exit with code ${code}`);
});*/

//process.stdin.resume(); // so the program will not close instantly

exitHook(() => {
    console.debug('Exiting');

    if (server != null) {
        server.shutdown();
    }
});

import { SettingsHelper } from './helper';

const settings = SettingsHelper.loadSettings();

import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';

import(`dayjs/locale/${settings.locale}`).then(() => {
    dayjs.locale(settings.locale);
    dayjs.extend(weekday);

    server = new Server(settings);
});
