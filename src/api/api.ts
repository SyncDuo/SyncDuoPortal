import axiosInstance from "../util/http.js";
import {
    CreateSyncFlowRequest,
    ChangeSyncFlowStatusRequest,
    SyncFlowResponse,
    ManualBackupRequest
} from "./SyncFlowDataType"
import {FileSystemResponse} from "./FileSystemDataType"
import {SystemConfigEntity, SystemConfigResponse} from "./SystemConfigDataType";
import {SystemInfoResponse} from "./SystemInfoDataType";

const syncFlowUrl : string = "/sync-flow";

const fileSystemUrl : string = "/filesystem";

const systemConfigUrl : string = "/system-config";

const systemInfoUrl : string = "/system-info";

export async function postSyncFlow(payload:CreateSyncFlowRequest): Promise<SyncFlowResponse> {
    const response =
        await axiosInstance.post<SyncFlowResponse>(syncFlowUrl + "/add-sync-flow", payload);
    return response.data;
}

export async function getSyncFlow():Promise<SyncFlowResponse> {
    const response = await axiosInstance.get<SyncFlowResponse>(
        syncFlowUrl + "/get-sync-flow");
    return response.data;
}

export async function changeSyncFlowStatus(payload:ChangeSyncFlowStatusRequest):Promise<SyncFlowResponse> {
    const response = await axiosInstance.post<SyncFlowResponse>(
        syncFlowUrl + "/change-sync-flow-status",
        payload
    );
    return response.data;
}

export async function changeAllSyncFlowStatus(payload:ChangeSyncFlowStatusRequest):Promise<SyncFlowResponse> {
    const response = await axiosInstance.post<SyncFlowResponse>(
        syncFlowUrl + "/change-all-sync-flow-status",
        payload
    );
    return response.data;
}

export async function manualBackupSyncFlow(payload:ManualBackupRequest):Promise<SyncFlowResponse> {
    const response = await axiosInstance.post<SyncFlowResponse>(
        syncFlowUrl + "/backup",
        payload
    );
    return response.data;
}

export async function getHostName():Promise<FileSystemResponse> {
    const response = await axiosInstance.get<FileSystemResponse>(
        fileSystemUrl + "/get-hostname");
    return response.data;
}

export async function getFolderName(path:string):Promise<FileSystemResponse> {
    const response = await axiosInstance.get<FileSystemResponse>(
        fileSystemUrl + "/get-subfolders",
        {
            params: {
                path: path,
            }
        });
    return response.data;
}

export async function getSystemConfig():Promise<SystemConfigResponse> {
    const response = await axiosInstance.get<SystemConfigResponse>(
        systemConfigUrl + "/get-system-config"
    );
    return response.data;
}

export async function createSystemConfig(payload:SystemConfigEntity):Promise<SystemConfigResponse> {
    const response = await axiosInstance.post<SystemConfigResponse>(
        systemConfigUrl + "/create-system-config",
        payload
    );
    return response.data;
}

export async function updateSystemConfig(payload:SystemConfigEntity):Promise<SystemConfigResponse> {
    const response = await axiosInstance.post<SystemConfigResponse>(
        systemConfigUrl + "/update-system-config",
        payload
    );
    return response.data;
}

export async function getSystemInfo():Promise<SystemInfoResponse> {
    const response = await axiosInstance.get<SystemInfoResponse>(
        systemInfoUrl + "/get-system-info"
    );
    return response.data;
}