export interface SystemConfigResponse {
    code: number;

    message: string;

    systemConfigMap: SystemConfig;
}

export interface UpdateSystemConfigRequest {
    systemConfigMap: SystemConfig;
}

export interface SystemConfig {
    systemConfigId: string;

    syncStoragePath: string;

    backupStoragePath: string;
}