export interface SnapshotsResponse {

    code: number;

    message: string;

    snapshots: Record<string, SnapshotsInfo[]>;
}

export interface SnapshotsInfo {

    destFolderPath: string;

    startedAt: string;

    finishedAt: string;

    snapshotId: string;

    snapshotSize: string;

    backupFiles: string;

    backupJobStatus: string;

    backupErrorMessage: string;
}