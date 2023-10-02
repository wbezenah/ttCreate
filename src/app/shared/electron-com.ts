export enum WindowFunc {
    close = 'close',
    max = 'maximize',
    unmax = 'unmaximize',
    min = 'minimize'
}

export enum IPCChannels {
    windowFunc = 'window-func',
    windowRes = 'window-result',
    windowMax = 'check-window-max',
    createModal = 'create-modal'
}