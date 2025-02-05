export interface FileSystemResponse {

    code: number;

    message: string;

    hostName: string;

    folderList: Folder[] | null;
}

export interface Folder {

    folderName : string;

    folderFullPath : string;
}