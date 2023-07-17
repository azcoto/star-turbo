// import { Button } from '@/components/ui/button';

import { Button } from '@/components/ui/button';
import { DownlinkChart, GeoMap, TerminalInfo } from './components';
import { useServiceLine, useUptime } from './hooks';
import { TelemetryQuery } from '@/services';
import UplinkChart from './components/uplink-chart';
import LatencyChart from './components/latency-chart';
import PingDropChart from './components/ping-drop-chart';
import SignalChart from './components/signal-chart';
import { Skeleton } from '@/components/ui/skeleton';
import { Toggle } from '@/components/ui/toggle';
import { useState } from 'react';
import subDate from 'date-fns/sub';
import ObstructionChart from './components/obstruction-chart';
import OnlineIndicator from './components/online-indicator';

import { DateRange, SelectRangeEventHandler } from 'react-day-picker';
import { MdCalendarMonth as CalendarIcon, MdFileDownload as DownloadIcon } from 'react-icons/md';
import { addDays, format, subMonths, subSeconds } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { PopoverClose } from '@radix-ui/react-popover';
import { useParams } from 'react-router-dom';

type RelativeTimeRange = {
  id: number;
  label: string;
  value: number;
};

function Dashboard() {
  const { serviceLine } = useParams();

  const [isRelTimeRange, setIsRelTimeRange] = useState<boolean>(true);

  const [absTimeRange, setAbsTimeRange] = useState<DateRange | undefined>(undefined);

  const [relTimeRange, setRelTimeRange] = useState<RelativeTimeRange>({
    id: 1,
    label: '15m',
    value: 15 * 60,
  });

  const [telemeryQuery, setTelemetryQuery] = useState<TelemetryQuery>({
    serviceLineNumber: serviceLine ?? '',
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
        pressed={isRelTimeRange && relTimeRange.id === relativeTimeRange[index].id}
        className="hover:bg-[#66D1FF] data-[state=on]:bg-[#66D1FF] "
        onPressedChange={() => {
          setRelTimeRange(relativeTimeRange[index]);
          setTelemetryQuery(state => {
            return {
              ...state,
              start: subDate(new Date(), { seconds: relativeTimeRange[index].value }),
              end: new Date(),
            };
          });
          setAbsTimeRange(undefined);
          setIsRelTimeRange(true);
        }}
      >
        <p className="text-white">{range.label}</p>
      </Toggle>
    );
  });

  const { data: slData } = useServiceLine(serviceLine);
  const { data: upData } = useUptime(serviceLine);

  const calendarOnChange: SelectRangeEventHandler = (range: DateRange | undefined) => {
    console.log(range);
    if (range) {
      if (range.to) console.log(subSeconds(addDays(range.to, 1), 1));
      setAbsTimeRange({
        from: range.from,
        to: range.to ? subSeconds(addDays(range.to, 1), 1) : undefined,
      });
    }
  };

  return (
    <>
      <div className="flex flex-row justify-between pt-4">
        {slData ? <h3 className="text-white">{slData.metadata}</h3> : <Skeleton className="w-96 h-8" />}
        {upData && <OnlineIndicator isOnline={upData.checkOnline} />}
      </div>

      <div className="flex flex-row py-4 gap-x-4">
        <div className="flex flex-col w-1/2 p-4  rounded-lg shadow-md bg-[#57B5DD66]">
          {serviceLine && <TerminalInfo serviceLine={serviceLine} />}
        </div>
        <div className="flex flex-col w-1/2 h-96 border rounded-lg shadow-md z-0">
          {serviceLine && <GeoMap serviceLine={serviceLine} />}
        </div>
      </div>
      <div className="flex flex-row justify-between items-center py-4 border-b">
        <div className="flex flex-row items-center gap-4">
          <h3 className="text-[#66D1FF]">NETWORK STATISTICS</h3>
          <DownloadIcon className="w-7 h-7" />
        </div>

        <div className="flex flex-row justify-between w-64">{relativeTimeRangeEl}</div>
        <Popover
          onOpenChange={open => {
            if (!open && absTimeRange && absTimeRange.from && absTimeRange.to) {
              setIsRelTimeRange(false);
              setTelemetryQuery(state => {
                return {
                  ...state,
                  start: absTimeRange.from as Date,
                  end: absTimeRange.to as Date,
                };
              });
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button variant="outline">
              <div className="flex flex-row gap-2 items-center justify-start">
                <CalendarIcon />
                {absTimeRange && absTimeRange.from && absTimeRange.to ? (
                  <p>{`${format(absTimeRange.from, 'dd/MM/yyyy')} - ${format(absTimeRange.to, 'dd/MM/yyyy')}`}</p>
                ) : (
                  <p>Pick a date</p>
                )}
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" side="left">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={subMonths(new Date(), 1)}
              selected={absTimeRange}
              onSelect={calendarOnChange}
              numberOfMonths={2}
              toDate={subDate(new Date(), { days: 1 })}
            />
            <div className="px-4 py-4">
              <PopoverClose className="rounded-md bg-sky-400 px-4 py-4">Filter Date</PopoverClose>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-3 gap-4 py-4">
        <div className="flex flex-col h-72 gap-y-4">
          <h4 className="text-[#66D1FF]">DOWNLINK THROUGHPUT</h4>
          <DownlinkChart tq={telemeryQuery} />
        </div>
        <div className="flex flex-col h-72 gap-y-4">
          <h4 className="text-[#66D1FF]">UPLINK THROUGHPUT</h4>
          <UplinkChart tq={telemeryQuery} />
        </div>
        <div className="flex flex-col h-72 gap-y-4">
          <h4 className="text-[#66D1FF]">LATENCY</h4>
          <LatencyChart tq={telemeryQuery} />
        </div>
        <div className="flex flex-col h-72">
          <h4 className="text-[#66D1FF]">PING DROP RATE</h4>
          <PingDropChart tq={telemeryQuery} />
        </div>
        <div className="flex flex-col h-72 gap-y-4">
          <h4 className="text-[#66D1FF]">SIGNAL QUALITY</h4>
          <SignalChart tq={telemeryQuery} />
        </div>
        <div className="flex flex-col h-72 gap-y-4">
          <h4 className="text-[#66D1FF]">OBSTRUCTION</h4>
          <ObstructionChart tq={telemeryQuery} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
