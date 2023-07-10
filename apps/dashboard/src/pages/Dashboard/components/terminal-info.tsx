import { Skeleton } from '@/components/ui/skeleton';
import { useServiceLine, useUptime } from '../hooks';

const TerminalInfo = () => {
  const sln = 'AST-1642430-93633-42';

  const { data: slData } = useServiceLine(sln);
  const { data: uptimeData } = useUptime(sln);

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

        {uptimeData ? <p className="font-bold">{uptimeData.lastUpdated}</p> : <Skeleton className="w-48 h-4" />}
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

        {uptimeData ? <p className="font-bold">3 DAYS 11 HOURS 50 MINUTES</p> : <Skeleton className="w-48 h-4" />}
      </div>
    </div>
  );
};

export default TerminalInfo;
