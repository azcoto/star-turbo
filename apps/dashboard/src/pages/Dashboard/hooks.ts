import { useQuery } from '@tanstack/react-query';
import { TelemetryQuery, getTelemetry } from '@/services';
import instance from '@/services/axios';

export function useTelemetry(telemetryQuery: TelemetryQuery) {
  return useQuery({
    queryKey: ['telemetry', telemetryQuery],
    queryFn: () => getTelemetry(telemetryQuery),
    select: data => {
      return data.map(d => {
        return {
          time: d.ts.getTime(),
          ...d,
        };
      });
    },
  });
}
