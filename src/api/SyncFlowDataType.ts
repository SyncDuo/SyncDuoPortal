import { FolderStats } from "./GlobalDataType";

export interface CreateSyncFlowRequest {

    sourceFolderFullPath: string;

    destFolderFullPath: string;

    filterCriteria: string;

    syncFlowName: string;
}

export interface ChangeSyncFlowStatusRequest {
    syncFlowId : string;

    syncFlowStatus : SyncFlowStatus;
}

export interface ManualBackupRequest {
    syncFlowId : string;
}

export interface SyncFlowInfo {

    syncFlowId : string;

    syncFlowName : string;

    sourceFolderPath : string;

    destFolderPath : string;

    ignorePatten: string;

    destFolderStats: FolderStats | null;

    syncStatus: SyncFlowStatus;

    lastSyncTimeStamp: string;
}

export enum SyncFlowStatus {
    SYNC = "SYNC",
    RUNNING = "RUNNING",
    PAUSE = "PAUSE",
    RESUME = "RESUME",
    RESCAN = "RESCAN",
}