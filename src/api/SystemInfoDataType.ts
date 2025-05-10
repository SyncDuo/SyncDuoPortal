export interface SystemInfoResponse {

    code: number;

    message: string;

    hostName: string;

    syncFlowNumber: number;

    fileCopyRate: string;

    folderStats: FolderStats | null;

    watchers: number;

    uptime: string;
}

export interface FolderStats {

    fileCount: string;

    folderCount: string;

    space: string; // MB
}