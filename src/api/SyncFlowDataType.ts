import {createEmptyFolderStats, FolderStats} from "./GlobalDataType";

export interface CreateSyncFlowRequest {

    sourceFolderFullPath: string;

    destFolderFullPath: string;

    filterCriteria: string;

    syncFlowName: string;

    syncFlowType: SyncFlowType;
}

export interface ChangeSyncFlowStatusRequest {
    syncFlowId : string;

    syncFlowStatus : SyncFlowStatus;
}

export interface UpdateFilterCriteriaRequest {
    syncFlowId : string;

    filterCriteria: string;
}

export interface DeleteSyncFlowRequest {
    syncFlowId : string;
}

export interface SyncFlowInfo {

    syncFlowId : string;

    syncFlowName : string;

    sourceFolderPath : string;

    destFolderPath : string;

    filterCriteria: string;

    destFolderStats: FolderStats;

    syncStatus: SyncFlowStatus;

    lastSyncTimeStamp: string;

    syncFlowType: SyncFlowType;
}

export enum SyncFlowStatus {
    SYNC = "SYNC",
    PAUSE = "PAUSE",
    RESUME = "RESUME",
    RESCAN = "RESCAN",
    BACKUP_ONLY_SYNC = "BACKUP_ONLY_SYNC",
    UNKNOWN = "UNKNOWN",
}

export enum SyncFlowType {
    REACTIVE_SYNC = "REACTIVE_SYNC",
    BACKUP_ONLY = "BACKUP_ONLY",
    UNKNOWN = "UNKNOWN",
}

export function createEmptySyncFlowInfo(): SyncFlowInfo {
    return {
        syncFlowId: "",
        syncFlowName: "",
        sourceFolderPath: "",
        destFolderPath: "",
        filterCriteria: "",
        destFolderStats: createEmptyFolderStats(),
        syncStatus: SyncFlowStatus.UNKNOWN,
        lastSyncTimeStamp: "",
        syncFlowType: SyncFlowType.UNKNOWN
    }
}