export interface SystemConfigResponse {
    code: number;

    message: string;

    systemConfigEntity: SystemConfigEntity;
}

export interface SystemConfigEntity {
    systemConfigId: number;

    backupStoragePath: string;

    backupIntervalMillis: number;

    backupPassword: string;
}