import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const locationIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const WorkerLocationMap = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [latLng, setLatLng] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [city, setCity] = useState('');

  const fetchCityFromCoords = async (lat, lon) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
      const data = await response.json();
      const cityName = data.address.city || data.address.town || data.address.village || 'Unknown';
      setCity(cityName);
    } catch (error) {
      console.error('Error fetching city:', error);
      setCity('Unknown');
    }
  };

  const fetchSavedLocation = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/location/task', {
        credentials: 'include',
      });
      if (!response.ok) return;

      const data = await response.json();
      if (data.latitude && data.longitude) {
        const lat = parseFloat(data.latitude);
        const lng = parseFloat(data.longitude);
        setLatLng({ lat, lng });
        fetchCityFromCoords(lat, lng);

        const marker = L.marker([lat, lng], { icon: locationIcon }).addTo(mapRef.current);
        markerRef.current = marker;
        mapRef.current.setView([lat, lng], 14);
      }
    } catch (error) {
      console.error('Error fetching saved location:', error);
    }
  }, []);

  useEffect(() => {
    const map = L.map('map').setView([6.9271, 79.8612], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      setLatLng({ lat, lng });
      fetchCityFromCoords(lat, lng);

      if (markerRef.current) markerRef.current.remove();
      const marker = L.marker([lat, lng], { icon: locationIcon }).addTo(map);
      markerRef.current = marker;
    });

    fetchSavedLocation();
    return () => map.remove();
  }, [fetchSavedLocation]);

  const handleSearch = async () => {
    if (!searchQuery) return alert('Enter a location name');

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const results = await res.json();

      if (results.length === 0) {
        alert('Location not found.');
        return;
      }

      const { lat, lon } = results[0];
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);
      setLatLng({ lat: latNum, lng: lonNum });
      fetchCityFromCoords(latNum, lonNum);

      if (markerRef.current) markerRef.current.remove();
      const marker = L.marker([latNum, lonNum], { icon: locationIcon }).addTo(mapRef.current);
      markerRef.current = marker;
      mapRef.current.setView([latNum, lonNum], 14);
    } catch (err) {
      console.error(err);
      alert('Search failed.');
    }
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatLng({ lat: latitude, lng: longitude });
        fetchCityFromCoords(latitude, longitude);

        if (markerRef.current) markerRef.current.remove();
        const marker = L.marker([latitude, longitude], { icon: locationIcon }).addTo(mapRef.current);
        markerRef.current = marker;
        mapRef.current.setView([latitude, longitude], 14);
      },
      (error) => {
        console.error(error);
        alert('Location access failed.');
      }
    );
  };

  const handleSaveLocation = async () => {
    if (!latLng) return alert('No location selected');

    try {
      const res = await fetch('http://localhost:8080/api/location/task', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          latitude: latLng.lat,
          longitude: latLng.lng,
          city: city,
        }),
      });

      if (!res.ok) throw new Error('Save failed');
      alert('Location saved!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Error saving location');
    }
  };

  return (
    <div className="space-y-5 border border-blue-200 rounded-xl p-5 bg-white">
      <h2 className="text-xl font-semibold mb-3">Now, select the location of task</h2>

      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter a location"
          className="p-2 border border-gray-300 rounded w-full sm:w-2/3"
        />
        <div className="flex gap-2">
          <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
            🔍 Search
          </button>
          <button onClick={handleLocateMe} className="bg-green-500 text-white px-2 py-2 rounded">
            📍 My Location
          </button>
        </div>
      </div>

      <div id="map" className="h-[400px] w-full mb-4 rounded border"></div>

      {latLng && (
        <div className="bg-gray-100 p-3 rounded shadow">
          <p><strong>Latitude:</strong> {latLng.lat.toFixed(6)}</p>
          <p><strong>Longitude:</strong> {latLng.lng.toFixed(6)}</p>
          <p><strong>City:</strong> {city}</p>
          <button
            onClick={handleSaveLocation}
            className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Save Location
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkerLocationMap;
