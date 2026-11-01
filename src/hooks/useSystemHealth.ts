import useSWR from 'swr';
import { health_services } from '@/services/health.services';
import { ISystemHealthResponse } from '@/interfaces';

export const HEALTH_KEY = '/health';

export function useSystemHealth(refreshInterval: number = 30000) {
    const { data, error, isLoading, mutate } = useSWR<ISystemHealthResponse>(
        HEALTH_KEY,
        () => health_services.checkHealth(),
        {
            refreshInterval,
            revalidateOnFocus: true,
            shouldRetryOnError: false,
        }
    );

    const isHealthy = data?.status === 'healthy';
    const isDbConnected = data?.database?.status === 'connected';
    const isServiceUnavailable = Boolean(error) || data?.status === 'unhealthy' || data?.database?.status === 'disconnected';

    return {
        health: data,
        isHealthy,
        isDbConnected,
        isLoading,
        isError: isServiceUnavailable,
        refreshHealth: mutate,
    };
}
