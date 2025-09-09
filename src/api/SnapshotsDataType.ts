export interface SyncFlowWithSnapshots {

    syncFlowId: string;

    syncFlowName: string;

    sourceFolderPath: string;

    destFolderPath: string;

    snapshotInfoList: SnapshotInfo[];
}

export interface SnapshotInfo {

    backupJobId: string;

    startedAt: string;

    finishedAt: string;

    snapshotId: string;

    snapshotSize: string;

    backupFiles: string;

    backupJobStatus: string;

    backupErrorMessage: string;
}

export interface SnapshotFileInfo {

    snapshotId: string;

    path: string;

    fileName: string;

    lastModifiedTime: string;

    size: string;

    type: "file" | "dir";
}