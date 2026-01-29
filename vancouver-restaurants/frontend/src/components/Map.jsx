import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function Map({ restaurants }) {
  return (
    <MapContainer
      center={[49.2827, -123.1207]} // Vancouver
      zoom={12}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {restaurants.map(r => (
        <Marker key={r.id} position={[r.latitude, r.longitude]}>
          <Popup>
            <strong>{r.name}</strong><br />
            {r.cuisine}<br />
            {r.price_range}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}