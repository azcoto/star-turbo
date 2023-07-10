import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TelemetryQuery } from '@/services';
import { useTelemetry } from '../hooks';

interface LatencyChartProps {
  tq: TelemetryQuery;
}

const LatencyChart = (props: LatencyChartProps) => {
  const { tq } = props;
  const { data } = useTelemetry(tq);

  const domain = data ? [data[0].time, data[data.length - 1].time] : [0, 0];

  return (
    <ResponsiveContainer width="100%" height="100%" className="h-full w-full">
      <AreaChart
        width={500}
        height={800}
        data={data}
        margin={{
          top: 10,
          right: 30,
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
          interval={40}
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
        <YAxis
          style={{
            fontFamily: 'Segoe UI, -apple-system, BlinkMacSystemFont',
            fontSize: '12px',
          }}
          dx={-10}
          width={70}
          tickFormatter={latency => {
            return `${latency} ms`;
          }}
        />
        <Tooltip />
        <Area type="monotone" dataKey="pingLatencyMsAvg" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default LatencyChart;
