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

export async function getPendingSourceFolder():Promise<string[]> {
    const response = await restAxiosInstance.get<SyncDuoHttpResponse<string[]>>(
        syncFlowUrl + "/get-pending-source-folder");
    return response.data.data;
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

export async function submitDownloadJob(snapshotFileInfoList:[SnapshotFileInfo]):Promise<string> {
    const response = await restAxiosInstance.post<
        SyncDuoHttpResponse<string>>(
        snapshotsUrl + "/submit-download-job",
        snapshotFileInfoList
    );
    return response.data.data;
}

export async function getDownloadFiles(downloadJobId:string, isPreview:boolean):Promise<AxiosResponse<Blob>> {
    return await blobAxiosInstance.get<Blob>(
        snapshotsUrl + "/get-download-files",
        {
            params: {
                restoreJobId: downloadJobId,
                isPreview: isPreview
            },
            responseType: "blob"
        }
    )
}