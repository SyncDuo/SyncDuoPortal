export interface SyncDuoHttpResponse<T = any> {

    statusCode: number;

    message: string;

    data: T;

    timestamp: string;
}

export interface FolderStats {

    fileCount: string;

    folderCount: string;

    space: string;
}