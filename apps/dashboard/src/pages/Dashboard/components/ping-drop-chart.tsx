import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { TelemetryQuery } from '@/services';
import { useTelemetry } from '../hooks';
import format from 'date-fns/format';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';

interface PingDropChartProps {
  tq: TelemetryQuery;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    const pingDropRate = payload[0].value as number;
    const dateTime = format(new Date(label as number), 'dd/MM/yyyy HH:mm');
    const formatted = `${(pingDropRate * 100).toFixed(2)} %`;
    return (
      <div className="custom-tooltip bg-white rounded-md p-4 border-2">
        <p className="font-bold">{`${dateTime}`}</p>
        <p className="label">{`${formatted}`}</p>
      </div>
    );
  }

  return null;
};

const PingDropChart = (props: PingDropChartProps) => {
  const { tq } = props;
  const { data } = useTelemetry(tq);
  const domain = data ? [data[0].time, data[data.length - 1].time] : [0, 0];
  const isSameDay = data && data[0].hari === data[data.length - 1].hari ? true : false;

  return (
    <ResponsiveContainer width="100%" height="100%" className="h-full w-full">
      <AreaChart
        width={500}
        height={800}
        data={data}
        margin={{
          top: 10,
          right: 20,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          style={{
            fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont',
            fontSize: '12px',
          }}
          tickFormatter={time => {
            const date = new Date(time);
            const hours = `${date.getHours()}`.padStart(2, '0');
            const minutes = `${date.getMinutes()}`.padStart(2, '0');
            //add 0 pad
            return `${hours}:${minutes}`;
          }}
          dataKey="time"
          scale="time"
          type="number"
          domain={domain}
        />
        {!isSameDay && (
          <XAxis
            xAxisId={1}
            style={{
              fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont',
              fontSize: '12px',
            }}
            tickFormatter={time => {
              const date = new Date(time);
              const day = `${date.getDate()}`.padStart(2, '0');
              const month = `${date.getMonth()}`.padStart(2, '0');
              return `${day}/${month}`;
            }}
            dataKey="hari"
            scale="time"
            type="number"
            domain={domain}
          />
        )}
        <YAxis
          style={{
            fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont',
            fontSize: '12px',
          }}
          dx={-10}
          width={70}
          tickFormatter={pingDropRate => {
            return `${(pingDropRate * 100).toFixed(2)}%`;
          }}
        />
        <Tooltip content={<CustomTooltip />}></Tooltip>
        <Area type="monotone" dataKey="pingDropRateAvg" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default PingDropChart;
