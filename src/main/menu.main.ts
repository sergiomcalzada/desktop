import {
    app,
    BrowserWindow,
    Menu,
    MenuItemConstructorOptions,
    ipcMain,
} from 'electron';

import { WindowMain } from './window.main';

import { I18nService } from '../services/i18n.service';

export class MenuMain {
    constructor(private windowMain: WindowMain, private i18nService: I18nService) { }

    init() {
        const self = this;

        const template: MenuItemConstructorOptions[] = [
            {
                label: this.i18nService.t('file'),
                submenu: [
                    {
                        label: this.i18nService.t('addNewLogin'),
                        click() {
                            self.send('newLogin');
                        },
                        accelerator: 'CmdOrCtrl+N'
                    },
                    {
                        label: this.i18nService.t('addNewItem'),
                        submenu: [
                            {
                                label: this.i18nService.t('typeLogin'),
                                click() {
                                    self.send('newLogin');
                                },
                                accelerator: 'Alt+L'
                            },
                            {
                                label: this.i18nService.t('typeCard'),
                                click() {
                                    self.send('newCard');
                                },
                                accelerator: 'Alt+C'
                            },
                            {
                                label: this.i18nService.t('typeIdentity'),
                                click() {
                                    self.send('newIdentity');
                                },
                                accelerator: 'Alt+I'
                            },
                            {
                                label: this.i18nService.t('typeSecureNote'),
                                click() {
                                    self.send('newSecureNote');
                                },
                                accelerator: 'Alt+S'
                            }
                        ]
                    },
                    { type: 'separator' },
                    {
                        label: this.i18nService.t('addNewFolder'),
                        click() {
                            self.send('newFolder');
                        }
                    },
                    { type: 'separator' },
                    {
                        label: this.i18nService.t('settings'),
                        click() {
                            self.send('openSettings');
                        }
                    },
                    {
                        label: this.i18nService.t('lock'),
                        click() {
                            self.send('lockApp');
                        },
                        accelerator: 'CmdOrCtrl+L'
                    },
                ]
            },
            {
                label: this.i18nService.t('edit'),
                submenu: [
                    { role: 'undo' },
                    { role: 'redo' },
                    { type: 'separator' },
                    { role: 'selectall' },
                    { role: 'cut' },
                    { role: 'copy' },
                    { role: 'paste' },
                ]
            },
            {
                label: this.i18nService.t('view'),
                submenu: [
                    {
                        label: this.i18nService.t('passwordGenerator'),
                        click() {
                            self.send('openPasswordGenerator');
                        },
                        accelerator: 'CmdOrCtrl+G'
                    },
                    {
                        label: this.i18nService.t('searchVault'),
                        click() {
                            self.send('focusSearch');
                        },
                        accelerator: 'CmdOrCtrl+F'
                    },
                    { type: 'separator' },
                    { role: 'resetzoom', accelerator: 'CmdOrCtrl+0' },
                    { role: 'zoomin', accelerator: 'CmdOrCtrl+=' },
                    { role: 'zoomout', accelerator: 'CmdOrCtrl+-' },
                    { type: 'separator' },
                    { role: 'togglefullscreen' },
                    { type: 'separator' },
                    { role: 'reload', accelerator: 'Alt+Shift+R' },
                    { role: 'forcereload' },
                    { role: 'toggledevtools' },
                ]
            },
            {
                label: this.i18nService.t('account'),
                submenu: [
                    {
                        label: this.i18nService.t('logOut'),
                        click() {
                            self.send('confirmLogout');
                        }
                    },
                ]
            },
            {
                role: 'window',
                submenu: [
                    { role: 'minimize' },
                    { role: 'close' }
                ]
            },
            {
                role: 'help',
                submenu: [
                    {
                        label: 'Learn More',
                        click() { require('electron').shell.openExternal('https://electronjs.org') }
                    }
                ]
            }
        ];

        if (process.platform === 'darwin') {
            template[0].label = app.getName();
            (template[0].submenu as MenuItemConstructorOptions[]).concat([
                { type: 'separator' },
                { role: 'about' },
                { type: 'separator' },
                { role: 'services', submenu: [] },
                { type: 'separator' },
                { role: 'hide' },
                { role: 'hideothers' },
                { role: 'unhide' },
                { type: 'separator' },
                { role: 'quit' }
            ]);

            // Window menu
            template[4].submenu = [
                { role: 'close' },
                { role: 'minimize' },
                { role: 'zoom' },
                { type: 'separator' },
                { role: 'front' }
            ]
        }

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    }

    send(command: string, message?: any) {
        this.windowMain.win.webContents.send('messagingService', {
            command: command,
            message: message,
        });
    }
}
