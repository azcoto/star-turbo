import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import data from './data.json';
// from data. json
const cleanedData = data.map(item => {
  return {
    // convert time to epoch
    time: new Date(item['Time']).getTime(),
    downlinkThroughput: item['downlink_throughput'],
  };
});

// interface CustomTooltipProps {
//   active?: boolean;
//   payload?: { value: number }[];
//   label: string;
// }

// const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
//   const getIntroOfPage = (label: string) => {
//     // return the intro of the page
//     return `Intro of ${label}`;
//   };

//   if (active && payload && payload.length) {
//     return (
//       <div className="custom-tooltip">
//         <p className="label">{`${label} : ${payload[0].value}`}</p>
//         <p className="intro">{getIntroOfPage(label)}</p>
//         <p className="desc">Anything you want can be displayed here.</p>
//       </div>
//     );
//   }

//   return null;
// };

const DownlinkChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%" className="h-full w-full">
      <AreaChart
        width={500}
        height={800}
        data={cleanedData}
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
            fontFamily: 'Segoe UI',
            fontSize: '14px',
          }}
          interval={20}
          tickFormatter={time => {
            const date = new Date(time);
            return `${date.getHours()}:${date.getMinutes()}`;
          }}
          dataKey="time"
          scale="time"
          type="number"
          domain={[cleanedData[0].time, cleanedData[cleanedData.length - 1].time]}
        />
        <YAxis
          style={{
            fontFamily: 'Segoe UI',
            fontSize: '14px',
          }}
          dx={-10}
          width={70}
          tickFormatter={throughput => {
            return `${throughput} Mb/s`;
          }}
        />
        <Tooltip />
        <Area type="monotone" dataKey="downlinkThroughput" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default DownlinkChart;
