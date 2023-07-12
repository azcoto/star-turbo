import { Skeleton } from '@/components/ui/skeleton';
import { useServiceLine, useUptime } from '../hooks';

type Props = {
  serviceLine: string;
};

const TerminalInfo = (props: Props) => {
  const { serviceLine } = props;
  const { data: slData } = useServiceLine(serviceLine);
  const { data: uptimeData } = useUptime(serviceLine);

  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col w-1/2">
        <p className="text-xl text-muted-foreground">SERVICE LINE NUMBER</p>
        {slData ? <p className="font-bold">{slData.serviceLineNumber}</p> : <Skeleton className="w-48 h-4" />}
        <br />
        <p className="text-xl text-muted-foreground">KIT SERIAL NUMBER</p>
        {slData ? (
          <p className="font-bold">{slData.kitSerialNumber ? slData.kitSerialNumber : '-'}</p>
        ) : (
          <Skeleton className="w-48 h-4" />
        )}
        <br />
        <p className="text-xl text-muted-foreground">LAST UPDATED</p>

        {uptimeData ? (
          <p className="font-bold">{uptimeData.lastUpdated ? uptimeData.lastUpdated : '-'}</p>
        ) : (
          <Skeleton className="w-48 h-4" />
        )}
      </div>
      <div className="flex flex-col w-1/2">
        <p className="text-xl text-muted-foreground">SERVICE ADDRESS</p>
        {slData ? (
          <p className="font-bold">{slData.formattedAddress ? slData.formattedAddress : '-'}</p>
        ) : (
          <Skeleton className="w-48 h-4" />
        )}
        <br />
        <p className="text-xl text-muted-foreground">UPTIME</p>

        {uptimeData ? (
          <p className="font-bold">{uptimeData.uptimeFormatted ? uptimeData.uptimeFormatted : '-'}</p>
        ) : (
          <Skeleton className="w-48 h-4" />
        )}
      </div>
    </div>
  );
};

export default TerminalInfo;
