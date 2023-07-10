// import { Button } from '@/components/ui/button';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DownlinkChart, GeoMap, TerminalInfo } from './components';
import { useServiceLine, useTelemetry } from './hooks';
import { TelemetryQuery } from '@/services';
import UplinkChart from './components/uplink-chart';
import LatencyChart from './components/latency-chart';
import PingDropChart from './components/ping-drop-chart';
import SignalChart from './components/signal-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Toggle } from '@/components/ui/toggle';
import { useState } from 'react';
import subDate from 'date-fns/sub';

type RelativeTimeRange = {
  id: number;
  label: string;
  value: number;
};

function Dashboard() {
  const [relTimeRange, setRelTimeRange] = useState<RelativeTimeRange>({
    id: 1,
    label: '15m',
    value: 15 * 60,
  });

  const [telemeryQuery, setTelemetryQuery] = useState<TelemetryQuery>({
    serviceLineNumber: 'AST-1887093-81918-61',
    start: subDate(new Date(), { seconds: relTimeRange.value }),
    end: new Date(),
  });

  const relativeTimeRange = [
    {
      id: 1,
      label: '15m',
      value: 15 * 60,
    },
    {
      id: 2,
      label: '1h',
      value: 60 * 60,
    },
    {
      id: 3,
      label: '3h',
      value: 3 * 60 * 60,
    },
    {
      id: 4,
      label: '12h',
      value: 12 * 60 * 60,
    },
    {
      id: 5,
      label: '24h',
      value: 24 * 60 * 60,
    },
  ];

  const relativeTimeRangeEl = relativeTimeRange.map((range, index) => {
    return (
      <Toggle
        key={index}
        defaultPressed={relTimeRange.id === relativeTimeRange[index].id}
        pressed={relTimeRange.id === relativeTimeRange[index].id}
        onPressedChange={() => {
          setRelTimeRange(relativeTimeRange[index]);
          setTelemetryQuery(state => {
            return {
              ...state,
              start: subDate(new Date(), { seconds: relativeTimeRange[index].value }),
              end: new Date(),
            };
          });
        }}
      >
        <p>{range.label}</p>
      </Toggle>
    );
  });

  const { data } = useTelemetry(telemeryQuery);
  const sln = 'AST-1887093-81918-61';
  const { data: slData } = useServiceLine(sln);

  console.log(data);
  return (
    <main className="px-8 pt-8">
      <div className="flex flex-col border rounded-lg shadow-lg px-6">
        <div className="flex flex-row justify-between items-center py-4 border-b">
          <h4 className="text-xl font-bold">Home</h4>
          <Input type="search" placeholder="Search Dashboard ..." className="w-2/6" />
          <Avatar>
            <AvatarFallback>TS</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-row justify-between pt-4">
          {slData ? <h3>{slData.metadata}</h3> : <Skeleton className="w-96 h-8" />}
          <div className="flex flex-row gap-x-4 items-center">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400"></span>
            </span>
            <h4>ONLINE</h4>
          </div>
        </div>

        <div className="flex flex-row py-4 gap-x-4">
          <div className="flex flex-col w-1/2 p-4 border rounded-lg shadow-md">
            <TerminalInfo />
          </div>
          <div className="flex flex-col w-1/2 h-96 border rounded-lg shadow-md">
            <GeoMap />
          </div>
        </div>
        <div className="flex flex-row justify-between items-center py-4 border-b">
          <h3>NETWORK STATISTICS</h3>
          <div className="flex flex-row justify-between w-64">{relativeTimeRangeEl}</div>
          <Button>DOWNLOAD CSV</Button>
        </div>

        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="flex flex-col h-72 gap-y-4">
            <h4 className="text-muted-foreground">DOWNLINK THROUGHPUT</h4>
            <DownlinkChart tq={telemeryQuery} />
          </div>
          <div className="flex flex-col h-72 gap-y-4">
            <h4 className="text-muted-foreground">UPLINK THROUGHPUT</h4>
            <UplinkChart tq={telemeryQuery} />
          </div>
          <div className="flex flex-col h-72 gap-y-4">
            <h4 className="text-muted-foreground">LATENCY</h4>
            <LatencyChart tq={telemeryQuery} />
          </div>
          <div className="flex flex-col h-72 gap-y-4">
            <h4 className="text-muted-foreground">PING DROP RATE</h4>
            <PingDropChart tq={telemeryQuery} />
          </div>
          <div className="flex flex-col h-72 gap-y-4">
            <h4 className="text-muted-foreground">SIGNAL QUALITY</h4>
            <SignalChart tq={telemeryQuery} />
          </div>
          <div className="flex flex-col h-72 gap-y-4">
            <h4 className="text-muted-foreground">OBSTRUCTION</h4>
            <DownlinkChart tq={telemeryQuery} />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
