'use client'

import { Loader } from '@googlemaps/js-api-loader';
import { useEffect, useMemo, useState } from 'react';
import { mapContainer } from './Map.css';
import { getEncodedPolylines, generateRandomCoordinates, sortCoordinates } from './utils';
import { MapLegend } from './MapLegend';
import { useDrawingManager } from './hooks/useDrawingManager';
import routes from './routes.json';
import { useDrawPolylines } from './hooks/useDrawPolylines';
import { useMapMarkers } from './hooks/useMapMarkers';

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
  version: "weekly",
});

export const Map = () => {
  const [map, setMap] = useState<google.maps.Map>();
  const [polylines, setPolylines] = useState<string[]>([]);

  const randomCoordinates = useMemo(() => generateRandomCoordinates(100), []);
  const randomCoordinates2 = useMemo(() => generateRandomCoordinates(100), []);

  const coordinates = useMemo(() => sortCoordinates(randomCoordinates, randomCoordinates.length), [randomCoordinates]);
  const coordinates2 = useMemo(() => sortCoordinates(randomCoordinates2, randomCoordinates2.length), [randomCoordinates2]);

  const mapOptions = useMemo(() => ({
    center: { lat: randomCoordinates[0].lat, lng: randomCoordinates[0].lng },
    zoom: 10,
    mapId: 'MAP_ID_TEST'
  }), [randomCoordinates]);

  useDrawingManager({ loader, map });
  useDrawPolylines({ loader, map, polylines });
  useMapMarkers({ loader, map, coordinates });
  useMapMarkers({ loader, map, coordinates: coordinates2 });

  useEffect(() => {
    const loadMap = async () => {
      const googleMaps = await loader.importLibrary('maps') as google.maps.MapsLibrary;
      const googleMap = new googleMaps.Map(document.getElementById("map") as HTMLElement, mapOptions);

      setMap(googleMap);
    };

    loadMap();
  }, [mapOptions]);

  // Mimick Google Routes API Response
  useEffect(() => {
    const encodedPolylines = getEncodedPolylines(routes);
    setPolylines(encodedPolylines);
  }, []);

  return (
    <div className={mapContainer}>
      <div id="map" style={{ height: '800px', width: '100%' }} />
      <MapLegend map={map} />
    </div>
  )
};
