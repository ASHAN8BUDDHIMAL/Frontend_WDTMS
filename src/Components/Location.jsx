import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const locationIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const MapWithSearchAndLocate = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [latLng, setLatLng] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const map = L.map('map').setView([6.9271, 79.8612], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setLatLng({ lat, lng });
      if (markerRef.current) markerRef.current.remove();

      const marker = L.marker([lat, lng], { icon: locationIcon }).addTo(map);
      markerRef.current = marker;
    });

    return () => {
      map.remove();
    };
  }, []);

  const handleSearch = async () => {
    if (!searchQuery) return alert('Please enter a location to search.');

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      searchQuery
    )}`;

    try {
      const response = await fetch(url);
      const results = await response.json();

      if (results.length === 0) {
        alert('Location not found.');
        return;
      }

      const { lat, lon } = results[0];

      setLatLng({ lat: parseFloat(lat), lng: parseFloat(lon) });

      if (markerRef.current) markerRef.current.remove();

      const marker = L.marker([lat, lon], { icon: locationIcon }).addTo(mapRef.current);
      markerRef.current = marker;
      mapRef.current.setView([lat, lon], 14);
    } catch (error) {
      alert('Error searching location.');
      console.error(error);
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatLng({ lat: latitude, lng: longitude });

        if (markerRef.current) markerRef.current.remove();

        const marker = L.marker([latitude, longitude], { icon: locationIcon }).addTo(mapRef.current);
        markerRef.current = marker;
        mapRef.current.setView([latitude, longitude], 14);
      },
      (error) => {
        alert('Unable to retrieve your location');
        console.error(error);
      }
    );
  };

  return (
    <div>
      <h2>Search, Mark, and Locate on Map</h2>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          placeholder="Search location"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '5px', width: '60%' }}
        />
        <button onClick={handleSearch} style={{ marginLeft: '10px' }}>
          🔍 Search
        </button>
        <button onClick={handleLocateMe} style={{ marginLeft: '10px' }}>
          📍 Find My Location
        </button>
      </div>

      <div
        id="map"
        style={{ height: '400px', width: '100%', marginBottom: '10px' }}
      ></div>

      {latLng ? (
        <div>
          <strong>Selected Location:</strong>
          <p>Latitude: {latLng.lat.toFixed(6)}</p>
          <p>Longitude: {latLng.lng.toFixed(6)}</p>
        </div>
      ) : (
        <p>No location selected yet. Click, search, or use "Find My Location".</p>
      )}
    </div>
  );
};

export default MapWithSearchAndLocate;
