import blobAxiosInstance, {restAxiosInstance} from "../util/Http";
import {
    CreateSyncFlowRequest,
    ChangeSyncFlowStatusRequest,
    SyncFlowInfo, UpdateFilterCriteriaRequest
} from "./SyncFlowDataType"
import {SystemInfo, SystemSettings} from "./SystemInfoDataType";
import {SyncDuoHttpResponse} from "./GlobalDataType";
import {AxiosResponse} from "axios";
import {SnapshotFileInfo, SyncFlowWithSnapshots, ManualBackupRequest} from "./SnapshotsDataType";
import {Folder} from "./FileSystemAccessDataType";

const syncFlowUrl : string = "/sync-flow";

const fileSystemUrl : string = "/filesystem";

const systemInfoUrl : string = "/system-info";

const snapshotsUrl : string = "/snapshots";

export async function addSyncFlow(payload:CreateSyncFlowRequest): Promise<SyncFlowInfo> {
    const response =
        await restAxiosInstance.post<SyncDuoHttpResponse<SyncFlowInfo>>(syncFlowUrl + "/add-sync-flow", payload);
    return response.data.data;
}

export async function getSyncFlowInfo(syncFlowIdString: string):Promise<SyncFlowInfo> {
    const response = await restAxiosInstance.get<SyncDuoHttpResponse<SyncFlowInfo>>(
        syncFlowUrl + "/get-sync-flow-info",
        {
            params: {
                syncFlowIdString: syncFlowIdString,
            }
        });
    return response.data.data;
}

export async function getAllSyncFlowInfo():Promise<SyncFlowInfo[]> {
    const response = await restAxiosInstance.get<SyncDuoHttpResponse<SyncFlowInfo[]>>(
        syncFlowUrl + "/get-all-sync-flow-info");
    return response.data.data;
}

export async function changeSyncFlowStatus(payload:ChangeSyncFlowStatusRequest) {
    await restAxiosInstance.post<null>(
        syncFlowUrl + "/change-sync-flow-status",
        payload
    );
}

export async function changeAllSyncFlowStatus(payload:ChangeSyncFlowStatusRequest) {
    await restAxiosInstance.post<null>(
        syncFlowUrl + "/change-all-sync-flow-status",
        payload
    );
}

export async function updateFilterCriteria(payload: UpdateFilterCriteriaRequest) {
    await restAxiosInstance.post<null>(
        syncFlowUrl + "/update-filter-criteria",
        payload
    );
}

export async function getHostName():Promise<string> {
    const response = await restAxiosInstance.get<SyncDuoHttpResponse<string>>(
        fileSystemUrl + "/get-hostname");
    return response.data.data;
}

export async function getFolderName(path:string):Promise<Folder[]> {
    const response = await restAxiosInstance.get<SyncDuoHttpResponse<Folder[]>>(
        fileSystemUrl + "/get-subfolders",
        {
            params: {
                path: path,
            }
        });
    return response.data.data;
}

export async function getSystemSettings(): Promise<SystemSettings> {
    const response = await restAxiosInstance.get<SyncDuoHttpResponse<SystemSettings>>(
        systemInfoUrl + "/get-system-settings"
    );
    console.log("response", response);
    return response.data.data;
}

export async function getSystemInfo():Promise<SystemInfo> {
    const response = await restAxiosInstance.get<SyncDuoHttpResponse<SystemInfo>>(
        systemInfoUrl + "/get-system-info"
    );
    return response.data.data;
}

export async function manualBackupSyncFlow(payload:ManualBackupRequest) {
    await restAxiosInstance.post<null>(
        snapshotsUrl + "/backup",
        payload
    );
}

export async function getAllSyncFlowWithSnapshots():Promise<SyncFlowWithSnapshots[]> {
    const response = await restAxiosInstance.get<
        SyncDuoHttpResponse<SyncFlowWithSnapshots[]>>(snapshotsUrl + "/get-all-syncflow-with-snapshots");
    return response.data.data;
}

export async function getSnapshotFileInfo(backupJobId:string, path:string):Promise<SnapshotFileInfo[]> {
    const response = await restAxiosInstance.get<
        SyncDuoHttpResponse<SnapshotFileInfo[]>>(
        snapshotsUrl + "/get-snapshot-files",
        {
            params: {
                backupJobId: backupJobId,
                pathString: path
            }
        });
    return response.data.data;
}

export async function downloadSnapshotFile(snapshotFileInfo:SnapshotFileInfo): Promise<AxiosResponse<Blob>> {
    // 发起请求
    return await blobAxiosInstance.post<Blob>(
        snapshotsUrl + "/download-snapshot-file",
        snapshotFileInfo,
        {
            timeout: 20 * 1000,
            responseType: "blob"
        });
}

export async function downloadSnapshotFiles(snapshotFileInfoList:SnapshotFileInfo[]): Promise<AxiosResponse<Blob>> {
    // 发起请求
    return  await blobAxiosInstance.post<Blob>(
        snapshotsUrl + "/download-snapshot-files",
        snapshotFileInfoList,
        {
            timeout: 20 * 1000,
            responseType: "blob"
        });
}