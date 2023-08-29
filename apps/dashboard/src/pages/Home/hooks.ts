import { useQuery } from '@tanstack/react-query';
import { CustomerParams, getCustomer } from '@/services';
import { intervalToDuration } from 'date-fns';

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
          currentKitSerialNumber: node.currentKitSerialNumber,
          active: node.active,
          lastUpdated: node.lastUpdated,
          startDate: node.starDate,
          // node last updated is less than 15 minutes ago
          isOnline: node.lastUpdated > new Date(Date.now() - 1000 * 60 * 15),
        };
      });
      return filteredNodes;
    },
  });
}

export function useCustomerTableOfflineFiltered(params: CustomerParams & { startMinute: number; endMinute: number }) {
  // add delay 2  second
  const { startMinute, endMinute, ...customerParams } = params;
  return useQuery({
    queryKey: ['telemetry', customerParams],
    queryFn: () => getCustomer(customerParams),
    refetchInterval: 1000 * 60 * 5,
    enabled: customerParams.uuid !== '', // 20 minutes
    select: data => {
      const nodes = data.nodes.data;
      const filteredNodes = nodes.filter(node => {
        if (node.lastUpdated === null) return false;
        const { years, months, days, hours, minutes } = intervalToDuration({
          start: node.lastUpdated,
          end: new Date(),
        });
        const totalMinuteDown =
          (years ?? 0) * 365 * 24 * 60 +
          (months ?? 0) * 30 * 24 * 60 +
          (days ?? 0) * 24 * 60 +
          (hours ?? 0) * 60 +
          (minutes ?? 0);
        if (totalMinuteDown >= startMinute && totalMinuteDown <= endMinute) return true;
      });

      const mappedNodes = filteredNodes.map(node => {
        return {
          namaNodelink: node.namaNodelink,
          layanan: node.layanan,
          serviceline: node.serviceline,
          active: node.active,
          currentKitSerialNumber: node.currentKitSerialNumber,
          lastUpdated: node.lastUpdated,
          startDate: node.starDate,
          // node last updated is less than 15 minutes ago
        };
      });
      return mappedNodes;
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
          mnodelinkid: node.mNodelinkId,
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
