import { Skeleton } from '@/components/ui/skeleton';
import { useServiceLine, useUptime } from '../hooks';
import { format } from 'date-fns';
import { useCustomer } from '@/pages/Home/hooks';
import { useAuthTokenStore } from '@/store/auth';

type Props = {
  serviceLine: string;
};

const TerminalInfo = (props: Props) => {
  const { serviceLine } = props;
  const authTokenStore = useAuthTokenStore();
  const { data: slData } = useServiceLine(serviceLine);
  const { data: uptimeData } = useUptime(serviceLine);
  const { data: customerData } = useCustomer({
    uuid: authTokenStore.userUUID,
  });

  const cData = customerData?.nodes.data.find(c => c.serviceline === serviceLine);

  return (
    <div className="flex flex-row justify-between ">
      <div className="flex flex-col w-1/2">
        {cData ? (
          <>
            <p className="text-xl text-white">CUSTOMER</p>
            <p className="font-bold text-[#66D1FF]">{cData.namaCustomer}</p>
          </>
        ) : (
          <Skeleton className="w-48 h-8" />
        )}
        <br />
        <p className="text-xl text-white">SERVICE LINE NUMBER</p>
        {slData ? (
          <p className="font-bold text-[#66D1FF]">{slData.serviceLineNumber}</p>
        ) : (
          <Skeleton className="w-48 h-4" />
        )}
        <br />
        <p className="text-xl text-white">KIT SERIAL NUMBER</p>
        {slData ? (
          <p className="font-bold text-[#66D1FF]">{slData.kitSerialNumber ? slData.kitSerialNumber : '-'}</p>
        ) : (
          <Skeleton className="w-48 h-4" />
        )}
        <br />
        {cData ? (
          <>
            <p className="text-xl text-white">IP KIT</p>
            <p className="font-bold text-[#66D1FF]">{cData.ipKit ? cData.ipKit : '-'}</p>
          </>
        ) : (
          <Skeleton className="w-48 h-8" />
        )}
        <br />
      </div>
      <div className="flex flex-col w-1/2">
        {cData ? (
          <>
            <p className="text-xl text-white">SID</p>
            <p className="font-bold text-[#66D1FF]">{cData.sid}</p>
          </>
        ) : (
          <Skeleton className="w-48 h-8" />
        )}
        <br />
        <p className="text-xl text-white">SERVICE ADDRESS</p>
        {slData ? (
          <p className="font-bold text-[#66D1FF]">{slData.formattedAddress ? slData.formattedAddress : '-'}</p>
        ) : (
          <Skeleton className="w-48 h-4" />
        )}
        <br />
        <p className="text-xl text-white">UPTIME</p>

        {uptimeData ? (
          <p className="font-bold text-[#66D1FF]">{uptimeData.uptimeFormatted ? uptimeData.uptimeFormatted : '-'}</p>
        ) : (
          <Skeleton className="w-48 h-4" />
        )}
        <br />
        <p className="text-xl text-white">LAST UPDATED</p>

        {uptimeData ? (
          <p className="font-bold text-[#66D1FF]">
            {uptimeData.lastUpdated ? format(uptimeData.lastUpdated, 'dd/MM/yyyy HH:mm') : '-'}
          </p>
        ) : (
          <Skeleton className="w-48 h-4" />
        )}
      </div>
    </div>
  );
};

export default TerminalInfo;
