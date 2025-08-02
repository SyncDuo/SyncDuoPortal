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

export interface SyncFlowResponse {

    code: number;

    message: string;

    syncFlowInfoList: SyncFlowInfo[] | null;
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

export interface FolderStats {

    fileCount: string;

    folderCount: string;

    space: string; // MB
}

export enum SyncFlowStatus {
    SYNC = "SYNC",
    RUNNING = "RUNNING",
    PAUSE = "PAUSE",
    RESUME = "RESUME",
    RESCAN = "RESCAN",
}