export interface CreateSyncFlowRequest {

    sourceFolderFullPath: string;

    destFolderFullPath: string;

    filterCriteria: string;

    syncFlowName: string;
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

    syncStatus: string;

    lastSyncTimeStamp: string;
}

export interface FolderStats {

    fileCount: string;

    folderCount: string;

    space: string; // MB
}

export interface ChangeSyncFlowStatusRequest {
    syncFlowId : string;

    syncFlowStatus : string;
}