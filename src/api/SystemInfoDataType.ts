import { FolderStats } from "./GlobalDataType";

export interface SystemInfo {

    hostName: string;

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

