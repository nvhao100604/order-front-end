export interface IDatabaseHealth {
    status: 'connected' | 'disconnected' | string;
    latency_ms: number | null;
    error: string | null;
}

export interface ISystemHealthResponse {
    status: 'healthy' | 'unhealthy' | string;
    timestamp: string;
    environment: string;
    database: IDatabaseHealth;
}

