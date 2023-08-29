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
import { useEffect, useState } from 'react';
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
import RelativeTimeRangeSelector from './components/relative-time-range';
import DownloadCSVDialog from './components/download-csv-dialog';

export type RelativeTimeRange = {
  id: number;
  label: string;
  value: number;
};

function Dashboard() {
  const { serviceLine } = useParams();
  const [csvOpen, setCsvOpen] = useState<boolean>(false);
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

  useEffect(() => {
    if (serviceLine) {
      setTelemetryQuery(state => {
        return {
          ...state,
          serviceLineNumber: serviceLine,
        };
      });
    }
  }, [serviceLine]);

  const relativeTimeRangeChanged = (tr: RelativeTimeRange) => {
    setRelTimeRange(tr);
    setTelemetryQuery(state => {
      return {
        ...state,
        start: subDate(new Date(), { seconds: tr.value }),
        end: new Date(),
      };
    });
    setAbsTimeRange(undefined);
    setIsRelTimeRange(true);
  };

  const { data: slData } = useServiceLine(serviceLine);
  const { data: upData } = useUptime(serviceLine);

  const calendarOnChange: SelectRangeEventHandler = (range: DateRange | undefined) => {
    if (range) {
      setAbsTimeRange({
        from: range.from,
        to: range.to ? subSeconds(addDays(range.to, 1), 1) : undefined,
      });
    }
  };

  return (
    <>
      <div className="flex flex-row flex-wrap justify-between pt-4">
        {slData ? <h3 className="text-white">{slData.metadata}</h3> : <Skeleton className="w-96 h-8" />}
        {upData && <OnlineIndicator isOnline={upData.checkOnline} />}
      </div>

      <div className="flex flex-row flex-wrap py-4 gap-x-4 gap-y-4">
        <div className="flex flex-col md:basis-1/2-gap-4 w-full p-4  rounded-lg shadow-md bg-[#57B5DD66]">
          {serviceLine && <TerminalInfo serviceLine={serviceLine} />}
        </div>
        <div className="flex flex-col md:basis-1/2-gap-4 w-full h-96 border rounded-lg shadow-md z-0">
          {serviceLine && <GeoMap serviceLine={serviceLine} />}
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-between items-center py-4 border-b gap-y-4">
        <div className="flex flex-row items-center lg:basis-1/3 w-full">
          <h3 className="text-[#66D1FF]">NETWORK STATISTICS</h3>
        </div>

        <div className="flex flex-row flex-wrap items-center  gap-4 lg:basis-1/3 w-full">
          <RelativeTimeRangeSelector
            onToggleChange={relativeTimeRangeChanged}
            isRelTimeRange={isRelTimeRange}
            relTimeRange={relTimeRange}
          />
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
              <Button variant="outline" className="hover:bg-[#66D1FF]">
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
            <PopoverContent className="w-auto p-0" align="start" side="bottom">
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
        <div className="flex flex-row items-center md:justify-end md:basis-1/3 w-full">
          <Popover onOpenChange={open => setCsvOpen(open)} open={csvOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline">
                DOWNLOAD CSV
                <DownloadIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" side="bottom">
              <DownloadCSVDialog serviceLine={serviceLine ?? ''} setCsvOpen={setCsvOpen} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex flex-row flex-wrap md:gap-x-4">
        <div className="flex flex-col h-72 w-full md:basis-1/3-gap-4 gap-y-4">
          <h4 className="text-[#66D1FF]">DOWNLINK THROUGHPUT</h4>
          <DownlinkChart tq={telemeryQuery} />
        </div>
        <div className="flex flex-col h-72 w-full md:basis-1/3-gap-4 gap-y-4">
          <h4 className="text-[#66D1FF]">UPLINK THROUGHPUT</h4>
          <UplinkChart tq={telemeryQuery} />
        </div>
        <div className="flex flex-col h-72 w-full md:basis-1/3-gap-4 gap-y-4">
          <h4 className="text-[#66D1FF]">LATENCY</h4>
          <LatencyChart tq={telemeryQuery} />
        </div>
      </div>
      <div className="flex flex-row flex-wrap md:gap-x-4">
        <div className="flex flex-col h-72 w-full md:basis-1/3-gap-4 gap-y-4">
          <h4 className="text-[#66D1FF]">PING DROP RATE</h4>
          <PingDropChart tq={telemeryQuery} />
        </div>
        <div className="flex flex-col h-72 w-full md:basis-1/3-gap-4 gap-y-4">
          <h4 className="text-[#66D1FF]">SIGNAL QUALITY</h4>
          <SignalChart tq={telemeryQuery} />
        </div>
        <div className="flex flex-col h-72 w-full md:basis-1/3-gap-4 gap-y-4">
          <h4 className="text-[#66D1FF]">OBSTRUCTION</h4>
          <ObstructionChart tq={telemeryQuery} />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
