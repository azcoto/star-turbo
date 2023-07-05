// import { Button } from '@/components/ui/button';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DownlinkChart, GeoMap, TerminalInfo } from './components';

function Dashboard() {
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
          <h3>PT. BANK MANDIRI - TOBA</h3>
          <div className="flex flex-row gap-x-4 items-center">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <h4>ONLINE</h4>
          </div>
        </div>

        <div className="flex flex-row py-4 gap-x-4">
          <div className="flex flex-col w-1/3 p-4 border rounded-lg shadow-md">
            <TerminalInfo />
          </div>
          <div className="flex flex-col w-2/3 h-96 border rounded-lg shadow-md">
            <GeoMap />
          </div>
        </div>
        <div className="flex flex-row justify-between py-4 border-b">
          <h3>NETWORK STATISTICS</h3>
          <Button>DOWNLOAD CSV</Button>
        </div>
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="flex flex-col h-72 gap-y-4">
            <h4 className="text-muted-foreground">DOWNLINK THROUGHPUT</h4>
            <DownlinkChart />
          </div>
          <div className="flex flex-col h-72 gap-y-4">
            <h4 className="text-muted-foreground">UPLINK THROUGHPUT</h4>
            <DownlinkChart />
          </div>
          <div className="flex flex-col h-72 gap-y-4">
            <h4 className="text-muted-foreground">LATENCY</h4>
            <DownlinkChart />
          </div>
          <div className="flex flex-col h-72 gap-y-4">
            <h4 className="text-muted-foreground">PING DROP RATE</h4>
            <DownlinkChart />
          </div>
          <div className="flex flex-col h-72 gap-y-4">
            <h4 className="text-muted-foreground">SIGNAL QUALITY</h4>
            <DownlinkChart />
          </div>
          <div className="flex flex-col h-72 gap-y-4">
            <h4 className="text-muted-foreground">OBSTRUCTION</h4>
            <DownlinkChart />
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
