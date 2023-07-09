import { Skeleton } from '@/components/ui/skeleton';
import { useServiceLine } from '../hooks';

const TerminalInfo = () => {
  const sln = 'AST-1642430-93633-42';

  const { data: slData } = useServiceLine(sln);

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
        <p className="font-bold">05/07/2023 09:14:42</p>
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
        <p className="font-bold">3 DAYS 11 HOURS 50 MINUTES</p>
      </div>
    </div>
  );
};

export default TerminalInfo;
