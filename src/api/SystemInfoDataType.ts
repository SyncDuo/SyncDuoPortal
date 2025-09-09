import {createEmptyFolderStats, FolderStats} from "./GlobalDataType";

export interface SystemInfo {

    syncFlowNumber: number;

    fileCopyRate: string;

    folderStats: FolderStats;

    watchers: number;

    uptime: string;
}

export interface SystemSettings {

    system: System;

    rclone: Rclone;

    restic: Restic;
}

export interface System {

    folderWatcherIntervalMillis: string;

    checkSyncflowStatusIntervalMillis: string;
}

export interface Rclone {

    httpBaseUrl: string;
}

export interface Restic {

    backupPath: string;

    backupIntervalSec: string;

    restorePath: string;

    restoreAgeSec: string;
}

export function createEmptySystemInfo():SystemInfo {
    return {
        syncFlowNumber: 0,
        fileCopyRate: "",
        folderStats: createEmptyFolderStats(),
        watchers: 0,
        uptime: ""
    }
}

export function createEmptySystemSettings():SystemSettings {
    return {
        system: {
            folderWatcherIntervalMillis: "",
            checkSyncflowStatusIntervalMillis: "",
        },
        rclone: {
            httpBaseUrl: "",
        },
        restic: {
            backupPath: "",
            backupIntervalSec: "",
            restorePath: "",
            restoreAgeSec: "",
        }
    }
}

