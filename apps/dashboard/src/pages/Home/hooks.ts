import { useQuery } from '@tanstack/react-query';
import { CustomerParams, getCustomer } from '@/services';

export function useCustomer(customerParams: CustomerParams) {
  return useQuery({
    queryKey: ['telemetry', customerParams],
    queryFn: () => getCustomer(customerParams),
    refetchInterval: 1000 * 60 * 5, // 20 minutes
    enabled: customerParams.uuid !== '',
  });
}

export function useCustomerTable(customerParams: CustomerParams) {
  // add delay 2  second

  return useQuery({
    queryKey: ['telemetry', customerParams],
    queryFn: () => getCustomer(customerParams),
    refetchInterval: 1000 * 60 * 5,
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
          // node last updated is less than 15 minutes ago
          isOnline: node.lastUpdated > new Date(Date.now() - 1000 * 60 * 15),
        };
      });
      return filteredNodes;
    },
  });
}

export function useCustomerCombo(customerParams: CustomerParams) {
  return useQuery({
    queryKey: ['telemetry', customerParams],
    queryFn: () => getCustomer(customerParams),
    refetchInterval: 1000 * 60 * 5,
    enabled: customerParams.uuid !== '', // 20 minutes
    select: data => {
      const nodes = data.nodes.data;
      const filteredNodes = nodes.map(node => {
        return {
          namaNodelink: node.namaNodelink,
          serviceline: node.serviceline,
          currentKitSerialNumber: node.currentKitSerialNumber,
          // node last updated is less than 15 minutes ago
          isOnline: node.lastUpdated > new Date(Date.now() - 1000 * 60 * 15),
        };
      });
      return filteredNodes;
    },
  });
}
