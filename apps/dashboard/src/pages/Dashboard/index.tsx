// import { Button } from '@/components/ui/button';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LatLngExpression } from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';

function Dashboard() {
  const position: LatLngExpression = [-0.391, 110]; //
  const zoomLevel = 6;

  return (
    <main className="px-8 pt-8">
      <div className="flex flex-col border rounded-lg shadow-lg">
        <div className="flex flex-row justify-between p-4 border-b">
          <h4 className="text-xl font-bold">Home</h4>
          <Input type="search" placeholder="Search Dashboard ..." className="w-2/6" />
          <Avatar>
            <AvatarFallback>TS</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-row justify-between p-4">
          <h3 className="text-4xl font-bold">Bank Mandiri</h3>
          <Button>Download CSV</Button>
        </div>

        <div className="flex flex-row p-4 gap-x-4">
          <div className="flex flex-col w-1/3 p-4 border rounded-lg shadow-md">
            <div className="flex flex-row justify-between">
              <div className="flex flex-col w-1/2">
                <p className="text-xl text-muted-foreground">SERVICE LINE NUMBER</p>
                <p className="font-bold">AST-684089-84700-4</p>
                <br />
                <p className="text-xl text-muted-foreground">KIT SERIAL NUMBER</p>
                <p className="font-bold">KITP00019658</p>
                <br />
                <p className="text-xl text-muted-foreground">LAST UPDATED</p>
                <p className="font-bold">05/07/2023 09:14:42</p>
              </div>
              <div className="flex flex-col w-1/2">
                <p className="text-xl text-muted-foreground">SERVICE ADDRESS</p>
                <p className="font-bold">LAIS, KUNYIL, MELIAU, SANGGAU REGENCY, WEST KALIMANTAN 78571</p>
                <br />
                <p className="text-xl text-muted-foreground">UPTIME</p>
                <p className="font-bold">3 DAYS 11 HOURS 50 MINUTES</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-2/3 h-96 border rounded-lg shadow-md">
            <MapContainer center={position} zoom={zoomLevel} scrollWheelZoom={true} className="w-full h-full">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
            </MapContainer>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
