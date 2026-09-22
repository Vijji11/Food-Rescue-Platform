import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});

function MapEventsHandler({ onSelectLocation }) {
  useMapEvents({
    click(e) {
      onSelectLocation(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const LocationPickerMap = ({ latitude, longitude, onSelectLocation, height = '220px' }) => {
  const lat = Number(latitude) || 28.6139;
  const lng = Number(longitude) || 77.2090;

  return (
    <div className="location-picker-map" style={{ height, width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <p style={{ fontSize: '0.85rem', color: '#4b5563', margin: '4px 0' }}>
        💡 <em>Click anywhere on the map to select pickup location coordinates:</em>
      </p>
      <MapContainer
        center={[lat, lng]}
        zoom={12}
        scrollWheelZoom={true}
        style={{ height: 'calc(100% - 24px)', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEventsHandler onSelectLocation={onSelectLocation} />
        <Marker position={[lat, lng]} icon={customIcon} />
      </MapContainer>
    </div>
  );
};

export default LocationPickerMap;
