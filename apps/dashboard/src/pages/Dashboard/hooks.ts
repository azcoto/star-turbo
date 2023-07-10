import { useQuery } from '@tanstack/react-query';
import { TelemetryQuery, getTelemetry } from '@/services';
import { getServiceLine, getUptime } from '@/services/service-line';

export function useTelemetry(telemetryQuery: TelemetryQuery) {
  return useQuery({
    queryKey: ['telemetry', telemetryQuery],
    queryFn: () => getTelemetry(telemetryQuery),
    select: data => {
      console.log(data);
      return data.map(d => {
        return {
          time: d.ts.getTime(),
          ...d,
        };
      });
    },
  });
}

export function useServiceLine(serviceLineNumber: string) {
  return useQuery({
    queryKey: ['get-service-line', serviceLineNumber],
    queryFn: () => getServiceLine(serviceLineNumber),
  });
}

export function useUptime(serviceLineNumber: string) {
  return useQuery({
    queryKey: ['get-uptime', serviceLineNumber],
    queryFn: () => getUptime(serviceLineNumber),
  });
}
