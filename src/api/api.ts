import axiosInstance from "../util/http.js";
import {CreateSyncFlowRequest, SyncFlowResponse} from "./SyncFlowDataType"
import {FileSystemResponse} from "./FileSystemDataType"

const syncFlowUrl : string = "/sync-flow";

const fileSystemUrl : string = "/filesystem";

export async function postSyncFlow(payload:CreateSyncFlowRequest): Promise<SyncFlowResponse> {
    const response =
        await axiosInstance.post<SyncFlowResponse>(syncFlowUrl + "/add-sync-flow", payload);
    return response.data;
}

export async function getSyncFlow():Promise<SyncFlowResponse> {
    const response = await axiosInstance.get<SyncFlowResponse>(syncFlowUrl + "/get-sync-flow");
    return response.data;
}

export async function getHostName():Promise<FileSystemResponse> {
    const response = await axiosInstance.get<FileSystemResponse>(fileSystemUrl + "/get-hostname");
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