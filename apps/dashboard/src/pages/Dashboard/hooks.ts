import { useQuery } from '@tanstack/react-query';
import { TelemetryQuery, getTelemetry } from '@/services';
import { getServiceLine, getUptime } from '@/services/service-line';

export function useTelemetry(telemetryQuery: TelemetryQuery) {
  return useQuery({
    queryKey: ['telemetry', telemetryQuery],
    queryFn: () => getTelemetry(telemetryQuery),
    refetchInterval: 1000 * 60 * 5, // 20 minutes

    select: data => {
      return data.map(d => {
        return {
          time: d.ts.getTime(),
          hari: new Date(d.ts).setHours(0, 0, 0, 0),
          downlinkThroughputKbps:
            d.downlinkThroughput !== null ? Math.round(d.downlinkThroughput * 100000) / 100 : null,
          ...d,
        };
      });
    },
  });
}

export function useServiceLine(serviceLineNumber: string | undefined) {
  return useQuery({
    queryKey: ['get-service-line', serviceLineNumber],
    refetchInterval: 1000 * 60 * 5, // 20 minutes
    queryFn: () => getServiceLine(serviceLineNumber ?? ''),
    enabled: serviceLineNumber !== undefined,
  });
}

export function useUptime(serviceLineNumber: string | undefined) {
  return useQuery({
    queryKey: ['get-uptime', serviceLineNumber],
    refetchInterval: 1000 * 60 * 5, // 20 minutes
    queryFn: () => getUptime(serviceLineNumber ?? ''),
    enabled: serviceLineNumber !== undefined,
  });
}
