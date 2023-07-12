import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import { useServiceLine } from '../hooks';
import { Skeleton } from '@/components/ui/skeleton';
import { TelemetryQuery } from '@/services';

type Props = {
  serviceLine: string;
};

function GeoMap(props: Props) {
  const { serviceLine } = props;
  const { data: slData, isSuccess } = useServiceLine(serviceLine);

  const zoomLevel = 6;
  return slData && isSuccess ? (
    <MapContainer
      center={[slData.latitude, slData.longitude]}
      zoom={zoomLevel}
      scrollWheelZoom={true}
      className="w-full h-full z-0"
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
