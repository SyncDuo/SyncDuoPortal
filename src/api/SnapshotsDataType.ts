export interface SnapshotsResponse {

    code: number;

    message: string;

    syncFlowSnapshotsInfoList: SyncFlowSnapshotsInfo[];
}

export interface SyncFlowSnapshotsInfo {

    syncFlowId: string;

    syncFlowName: string;

    sourceFolderPath: string;

    destFolderPath: string;

    snapshotInfoList: SnapshotInfo[];
}

export interface SnapshotInfo {

    startedAt: string;

    finishedAt: string;

    snapshotId: string;

    snapshotSize: string;

    backupFiles: string;

    backupJobStatus: string;

    backupErrorMessage: string;
}