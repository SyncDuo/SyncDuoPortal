export interface SystemConfigResponse {
    code: number;

    message: string;

    systemConfigEntity: SystemConfigEntity;
}

export interface SystemConfigEntity {
    systemConfigId: bigint;

    backupStoragePath: string;

    backupIntervalMillis: bigint;
}