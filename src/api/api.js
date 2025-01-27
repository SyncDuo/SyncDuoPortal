import axiosInstance from "../util/http.js";

const syncFlowUrl = "/sync-flow";

const fileSystemUrl = "/filesystem";


export async function getSyncFlow() {
    const response = await axiosInstance.get(syncFlowUrl + "/get-sync-flow");
    return response.data;
}

export async function getHostName() {
    const response = await axiosInstance.get(fileSystemUrl + "/get-hostname");
    return response.data;
}