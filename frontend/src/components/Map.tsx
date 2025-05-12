// src/components/Map.tsx
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '../types';
import { useRouter } from 'next/router';

// Fix para os ícones no Leaflet com Next.js
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src,
  iconRetinaUrl: markerIcon2x.src,
  shadowUrl: markerShadow.src,
});

interface MapProps {
  locations: Location[];
  center?: [number, number];
  zoom?: number;
}

const Map = ({ locations, center = [-29.6914, -53.8008], zoom = 13 }: MapProps) => {
  const router = useRouter();

  // Ajusta o centro para Santa Maria-RS caso não seja fornecido
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom={true}
      style={{ height: '100%', width: '100%', minHeight: '500px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
        >
          <Popup>
            <div>
              <h3 className="font-bold">{location.name}</h3>
              <p>{location.address}, {location.neighborhood}</p>
              {location.phone && <p>Telefone: {location.phone}</p>}
              {location.openingHours && <p>Horário: {location.openingHours}</p>}
              <button
                className="mt-2 text-blue-600 hover:underline"
                onClick={() => router.push(`/location/${location.id}`)}
              >
                Ver detalhes
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
