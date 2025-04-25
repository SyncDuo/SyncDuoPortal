export interface CreateSyncFlowRequest {

    sourceFolderFullPath: string;

    destFolderFullPath: string;

    filterCriteria: string;

    syncMode: string;

    syncFlowName: string;

    syncFlowType: string;
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

    syncMode: string;

    ignorePatten: string;

    syncFlowType: string;

    destFolderStats: FolderStats | null;

    syncStatus: string;

    lastSyncTimeStamp: string;
}

export interface FolderStats {

    fileCount: string;

    folderCount: string;

    space: string;
}