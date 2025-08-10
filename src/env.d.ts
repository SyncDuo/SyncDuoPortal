interface ImportMetaEnv {
    readonly VITE_GLOBAL_TIMER_INTERVAL: number;  // env vars are always strings by default
    readonly VITE_API_BASE_URL: string;
    // To Add more variables here as needed

    // Optional: you can mark some as optional if they might be missing
    readonly VITE_OPTIONAL_VAR?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}