import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Fix standard Leaflet icon paths in React Vite
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MapView = ({ latitude, longitude, foodName, location, height = '200px' }) => {
  const lat = Number(latitude) || 28.6139;
  const lng = Number(longitude) || 77.2090;

  return (
    <div className="map-wrapper" style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden', marginTop: '10px' }}>
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lng]} icon={customIcon}>
          <Popup>
            <strong>{foodName || 'Donation Location'}</strong>
            <br />
            {location || 'Pickup Point'}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default MapView;
