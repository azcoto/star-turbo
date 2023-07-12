import { useQuery } from '@tanstack/react-query';
import { CustomerParams, getCustomer } from '@/services';

export function useCustomer(customerParams: CustomerParams) {
  return useQuery({
    queryKey: ['telemetry', customerParams],
    queryFn: () => getCustomer(customerParams),
    staleTime: 1000 * 60 * 20,
    enabled: customerParams.uuid !== '', // 20 minutes
  });
}

export function useCustomerTable(customerParams: CustomerParams) {
  return useQuery({
    queryKey: ['telemetry', customerParams],
    queryFn: () => getCustomer(customerParams),
    staleTime: 1000 * 60 * 20,
    enabled: customerParams.uuid !== '', // 20 minutes
    select: data => {
      const nodes = data.nodes.data;
      const filteredNodes = nodes.map(node => {
        return {
          namaNodelink: node.namaNodelink,
          layanan: node.layanan,
          serviceline: node.serviceline,
          uptime: node.uptime,
          currentKitSerialNumber: node.currentKitSerialNumber,
          lastUpdated: node.lastUpdated,
        };
      });
      return filteredNodes;
    },
  });
}
