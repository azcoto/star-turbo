import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { useServiceLine } from '../hooks';
import { Skeleton } from '@/components/ui/skeleton';

function GeoMap() {
  const sln = 'AST-1642430-93633-42';

  const { data: slData, isSuccess } = useServiceLine(sln);

  const zoomLevel = 6;
  return slData && isSuccess ? (
    <MapContainer
      center={[slData.latitude, slData.longitude]}
      zoom={zoomLevel}
      scrollWheelZoom={true}
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[slData.latitude, slData.longitude]}></Marker>
    </MapContainer>
  ) : (
    <Skeleton className="w-full h-full" />
  );
}

export default GeoMap;
