import blobAxiosInstance, {restAxiosInstance} from "../util/http";
import {
    CreateSyncFlowRequest,
    ChangeSyncFlowStatusRequest,
    ManualBackupRequest, SyncFlowInfo
} from "./SyncFlowDataType"
import {SystemInfo, SystemSettings} from "./SystemInfoDataType";
import {SyncDuoHttpResponse} from "./GlobalDataType";
import {AxiosResponse} from "axios";
import {SnapshotFileInfo, SyncFlowWithSnapshots} from "./SnapshotsDataType";
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

export async function updateFilterCriteria(payload: string) {
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

export async function downloadSnapshotFile(snapshotFileInfo:SnapshotFileInfo):Promise<SyncDuoHttpResponse> {
    // 发起请求
    const response:AxiosResponse<Blob> = await blobAxiosInstance.post<Blob>(
        snapshotsUrl + "/download-snapshot-file",
        snapshotFileInfo,
        {responseType: "blob"});
    // 成功则触发浏览器下载
    if (response.status === 200) {
        // 设置 url 和 link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.download = snapshotFileInfo.fileName;
        // 触发下载
        document.body.appendChild(link);
        link.click();
        // 清理
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return null;
    } else {
        // 失败则返回 SynDuoHttpResponse
        const payload = await response.data.text();
        return JSON.parse(payload) as SyncDuoHttpResponse<null>;
    }
}

export async function downloadSnapshotFiles(snapshotFileInfoList:SnapshotFileInfo[]):Promise<SyncDuoHttpResponse> {
    // 发起请求
    const response:AxiosResponse<Blob> = await blobAxiosInstance.post<Blob>(
        snapshotsUrl + "/download-snapshot-files",
        snapshotFileInfoList,
        {
            timeout: 1000 * 60,
            responseType: "blob"
        });
    // 成功则触发浏览器下载
    if (response.status === 200) {
        let filename = "tmp.zip";
        // 从响应头中获取 Content-Disposition
        const contentDisposition = response.headers['content-disposition'];
        // 解析文件名（示例：处理 UTF-8 编码和引号）
        if (contentDisposition) {
            const filenameRegex = /filename\*?=([^;]+)/gi;
            const matches = filenameRegex.exec(contentDisposition);
            if (matches != null && matches[1]) {
                // 处理类似 "UTF-8''filename.ext" 或 "filename.ext" 的情况
                filename = decodeURIComponent(matches[1].replace(/^UTF-8''/i, ''));
                // 去除可能的引号
                filename = filename.replace(/['"]/g, '');
            }
        }
        // 设置 url 和 link
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        // 触发下载
        document.body.appendChild(link);
        link.click();
        // 清理
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return null;
    } else {
        // 失败则返回 SynDuoHttpResponse
        const payload = await response.data.text();
        return JSON.parse(payload) as SyncDuoHttpResponse<null>;
    }
}