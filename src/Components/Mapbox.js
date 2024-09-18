import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { getDatabase, ref, onValue } from "firebase/database";
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';

const Mapbox = ({ agentId }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const agentMarker = useRef(null);
  const clientMarker = useRef(null);
  const shopMarker = useRef(null);

  const [agentLocation, setAgentLocation] = useState(null);
  const [clientLocation, setClientLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);

  // Mapbox access token
  mapboxgl.accessToken = 'pk.eyJ1IjoibXVoYW5uYWQtMzciLCJhIjoiY20wcHJmOHZ3MDN2MDJyb2JteXR5N3lrYiJ9.1i3rODwJmxyeIWmr7Bc7fQ';

  // Shop location (Winnipeg)
  const shopLocation = { latitude: 49.8167, longitude: -97.0929 };

  // Function to get client location using browser's geolocation API
  const getClientLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Client location:", { latitude, longitude }); // Log client location
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

  // Draw path between shop, agent, and client locations
  const drawPath = (map, start, waypoint, end) => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${waypoint[0]},${waypoint[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const coordinates = route.geometry.coordinates;

          // Remove existing path if it exists
          if (map.getSource('route')) {
            map.removeLayer('route');
            map.removeSource('route');
          }

          // Add the new path to the map
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
              'line-color': '#ff0000', // Red line
              'line-width': 5,
            },
          });

          // Set distance and ETA between agent and client
          setDistance((route.distance / 1000).toFixed(2)); // Convert meters to kilometers
          setDuration((route.duration / 60).toFixed(2)); // Convert seconds to minutes
        }
      })
      .catch((error) => {
        console.error('Error fetching route details:', error);
      });
  };

  // Effect to update agent and client markers and draw path
  useEffect(() => {
    if (agentLocation && clientLocation) {
      console.log("Agent location:", agentLocation); // Log agent location for debugging
      if (!agentMarker.current) {
        // Initialize agent marker
        agentMarker.current = new mapboxgl.Marker({ color: 'blue' })
          .setLngLat([agentLocation.longitude, agentLocation.latitude])
          .addTo(map.current);
      } else {
        // Update agent marker position
        agentMarker.current.setLngLat([agentLocation.longitude, agentLocation.latitude]);
        map.current.flyTo({ center: [agentLocation.longitude, agentLocation.latitude], speed: 0.5 });
      }

      // Draw the path if both agent and client locations are available
      drawPath(
        map.current,
        [shopLocation.longitude, shopLocation.latitude], // Shop location
        [agentLocation.longitude, agentLocation.latitude], // Agent location
        [clientLocation.longitude, clientLocation.latitude] // Client location
      );
    }
  }, [agentLocation, clientLocation]);

  // Initialize the map and set client and shop markers
  useEffect(() => {
    if (!map.current) {
      getClientLocation(); // Fetch client location on first render

      // Initialize the map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [shopLocation.longitude, shopLocation.latitude], // Center on the shop
        zoom: 12,
      });

      // Add shop marker
      shopMarker.current = new mapboxgl.Marker({ color: 'green' })
        .setLngLat([shopLocation.longitude, shopLocation.latitude])
        .addTo(map.current);
    }

    // Set client marker once client location is available
    if (clientLocation && !clientMarker.current) {
      clientMarker.current = new mapboxgl.Marker({ color: 'red' })
        .setLngLat([clientLocation.longitude, clientLocation.latitude])
        .addTo(map.current);
    }
  }, [clientLocation]);

  // Fetch agent's real-time location from Firebase
  useEffect(() => {
    if (agentId) {
      const database = getDatabase();
      const agentLocationRef = ref(database, `Agents/${agentId}/location`);

      const unsubscribe = onValue(agentLocationRef, (snapshot) => {
        const locationData = snapshot.val();
        if (locationData?.latitude && locationData?.longitude) {
          setAgentLocation({
            latitude: locationData.latitude,
            longitude: locationData.longitude,
          });
        //   alert(`Agent location updated: Latitude: ${locationData.latitude}, Longitude: ${locationData.longitude}`);
        } else {
          alert("No agent location available");
        }
      }, (error) => {
        alert(`Error fetching agent location: ${error.message}`);
      });

      return () => unsubscribe(); // Clean up the listener on unmount
    } else {
      alert("No agentId provided");
    }
  }, [agentId]);

  return (
    <div>
      <div ref={mapContainer} className="map-container" style={{ height: '50vh', width: '100%', position: 'relative' }}>
        {distance && duration ? (
          <div style={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: '#e0e0e0',  // Light grey color
            padding: '10px',
            borderRadius: '15px',
            zIndex: 1 // Ensure it's above the map
          }}>
            <p>Distance: {distance} km</p>
            <p>ETA: {duration} mins</p>
          </div>
        ) : (
          <div style={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '15px',
            zIndex: 1
          }}>
            <p>Loading distance and ETA...</p>
          </div>
        )}
      </div>
    </div>
  );

};

export default Mapbox;
