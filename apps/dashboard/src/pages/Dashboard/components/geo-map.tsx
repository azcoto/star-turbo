import { MapContainer, TileLayer } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

function GeoMap() {
  const position: LatLngExpression = [-0.391, 110]; //
  const zoomLevel = 6;
  return (
    <MapContainer center={position} zoom={zoomLevel} scrollWheelZoom={true} className="w-full h-full">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}

export default GeoMap;
