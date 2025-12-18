import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

type Props = {
  lat?: number;
  lng?: number;
  label?: string;
};

export default function MapCard({
  lat = 53.0793, // Bremen по умолчанию
  lng = 8.8017,
  label = "Pickup location",
}: Props) {
  return (
    <div className="map-card">
      <MapContainer center={[lat, lng]} zoom={10} scrollWheelZoom={false} style={{ height: 260, width: "100%", borderRadius: 12 }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]}>
          <Popup>{label}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}