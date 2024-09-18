import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';

const Mapbox = ({ agentLocation }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const agentMarker = useRef(null); // For agent's dynamic location (car marker)
  const clientMarker = useRef(null); // For client's static location (home marker)
  const shopMarker = useRef(null); // For shop's static location (shop marker)
  const directions = useRef(null); // For handling directions

  const [clientLocation, setClientLocation] = useState(null);
  const [distance, setDistance] = useState(null); // Distance between agent and client
  const [duration, setDuration] = useState(null); // ETA between agent and client

  // Set your Mapbox access token
  mapboxgl.accessToken = 'pk.eyJ1IjoibXVoYW5uYWQtMzciLCJhIjoiY20wcHJmOHZ3MDN2MDJyb2JteXR5N3lrYiJ9.1i3rODwJmxyeIWmr7Bc7fQ';

  // Default coordinates in case agentLocation is not available
  const defaultLocation = { latitude: 40.7128, longitude: -74.0060 }; // Default NYC location

  // Shop coordinates
  const shopLocation = { latitude: 49.8167, longitude: -97.0929 }; // Coordinates for the shop

  // Prompt the user for their current location
  const getClientLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setClientLocation({ latitude, longitude });
        },
        (error) => {
          alert('Unable to retrieve your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const drawPath = (map, start, waypoint, end) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${waypoint[0]},${waypoint[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coordinates = route.geometry.coordinates;

          // Remove existing line if it exists
          if (map.getSource('route')) {
            map.removeLayer('route');
            map.removeSource('route');
          }

          // Add the line (path) to the map
          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates,
              },
            },
          });

          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round',
            },
            paint: {
              'line-color': '#ff0000', // Yellow line
              'line-width': 10,
            },
          });

          // Set the distance and ETA between agent and client
          setDistance((route.distance / 1000).toFixed(2)); // Convert meters to kilometers
          setDuration((route.duration / 60).toFixed(2)); // Convert seconds to minutes
        }
      })
      .catch((error) => {
        console.error('Error fetching route details:', error);
      });
  };

  useEffect(() => {
    if (!map.current) {
      getClientLocation(); // Request client location when the map first renders

      // Initialize the map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [defaultLocation.longitude, defaultLocation.latitude], // Default center (will change when locations are fetched)
        zoom: 12,
      });

      // Add shop marker (static marker for the shop)
      shopMarker.current = new mapboxgl.Marker({ color: 'green' }) // Green marker for the shop
        .setLngLat([shopLocation.longitude, shopLocation.latitude])
        .addTo(map.current);
    }

    // Update the agent marker when agentLocation changes
    if (agentLocation) {
      if (!agentMarker.current) {
        // Use Mapbox's default marker for the agent
        agentMarker.current = new mapboxgl.Marker({ color: 'blue' }) // Blue marker for the agent
          .setLngLat([agentLocation.longitude, agentLocation.latitude])
          .addTo(map.current);
      } else {
        agentMarker.current.setLngLat([agentLocation.longitude, agentLocation.latitude]);
        map.current.flyTo({ center: [agentLocation.longitude, agentLocation.latitude], speed: 0.5 });
      }

      // If client location is set, draw the path
      if (clientLocation) {
        drawPath(
          map.current,
          [shopLocation.longitude, shopLocation.latitude], // Shop location
          [agentLocation.longitude, agentLocation.latitude], // Agent's location
          [clientLocation.longitude, clientLocation.latitude] // Client's location
        );
      }
    }

    // Set client marker once client location is available
    if (clientLocation && !clientMarker.current) {
      // Use Mapbox's default marker for the client
      clientMarker.current = new mapboxgl.Marker({ color: 'red' }) // Red marker for the client
        .setLngLat([clientLocation.longitude, clientLocation.latitude])
        .addTo(map.current);
    }
  }, [agentLocation, clientLocation]);

  return (
    <div>
      <div ref={mapContainer} className="map-container" style={{ height: '100vh', width: '100%' }} />
      <div style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'white', padding: '10px', borderRadius: '8px' }}>
        {distance && duration ? (
          <div>
            <p>Distance: {distance} km</p>
            <p>ETA: {duration} mins</p>
          </div>
        ) : (
          <p>Loading distance and ETA...</p>
        )}
      </div>
    </div>
  );
};

export default Mapbox;
