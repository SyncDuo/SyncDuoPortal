export interface CreateSyncFlowRequest {

    sourceFolderFullPath: string;

    destParentFolderFullPath: string;

    destFolderName: string | null;

    filterCriteria: string;

    flattenFolder: boolean;

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

    syncSettings: string;

    ignorePatten: string;

    destFolderStats: FolderStats | null;

    syncStatus: string;

    lastSyncTimeStamp: string;
}

export interface FolderStats {

    fileCount: string;

    folderCount: string;

    space: string;
}