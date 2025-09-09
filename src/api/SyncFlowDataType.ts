import {createEmptyFolderStats, FolderStats} from "./GlobalDataType";

export interface CreateSyncFlowRequest {

    sourceFolderFullPath: string;

    destFolderFullPath: string;

    filterCriteria: string;

    syncFlowName: string;
}

export interface ChangeSyncFlowStatusRequest {
    syncFlowId : string;

    syncFlowStatus : SyncFlowStatus;
}

export interface UpdateFilterCriteriaRequest {
    syncFlowId : string;

    filterCriteria: string;
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
}

export enum SyncFlowStatus {
    SYNC = "SYNC",
    RUNNING = "RUNNING",
    PAUSE = "PAUSE",
    RESUME = "RESUME",
    RESCAN = "RESCAN",
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
    }
}