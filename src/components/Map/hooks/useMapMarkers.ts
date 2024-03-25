import { Loader } from '@googlemaps/js-api-loader';
import { useEffect, useState } from 'react';
import { ICoordinate, randomCoordinates, sortCoordinates } from '../utils';
import { MarkerClusterer } from "@googlemaps/markerclusterer";

interface IMapMarkersProps {
  loader: Loader,
  map: google.maps.Map | undefined,
  coordinates: ICoordinate[],
}

export const useMapMarkers = ({ loader, map, coordinates }: IMapMarkersProps) => {
  const [markers, setMarkers] = useState<google.maps.marker.AdvancedMarkerElement[]>([]);

  useEffect(() => {
    if (!map || !loader) return;

    const loadMarkers = async () => {
      const { AdvancedMarkerElement } = await loader.importLibrary('marker') as google.maps.MarkerLibrary;

      const color = generateRandomColor();
      const mapPins = await Promise.all(coordinates.map(() => createMapPin({ loader, color })));

      const markers = mapPins.map(({ infoWindow, pinElement }, index) => {
        const position = coordinates[index];

        const marker = new AdvancedMarkerElement({
          position,
          map,
          content: pinElement.element,
          title: 'Hello World!',
        });

        marker?.content?.addEventListener('mouseover', () => {
          infoWindow.setContent(position.lat + ", " + position.lng);
          infoWindow.open(map, marker);
        });
        marker?.content?.addEventListener('mouseout', () => {
          infoWindow.close();
        });

        return marker;
      });

      new MarkerClusterer({ markers, map });

      setMarkers(markers);
    };

    loadMarkers();
  }, [map, loader, coordinates]);

  return { markers }
};

interface ICreateMapPin {
  loader: Loader,
  color: string,
}

export const createMapPin = async ({ loader, color }: ICreateMapPin): Promise<{ infoWindow: google.maps.InfoWindow, pinElement: google.maps.marker.PinElement }> => {
  const { PinElement } = await loader.importLibrary('marker') as google.maps.MarkerLibrary;
  const { InfoWindow } = await loader.importLibrary("maps") as google.maps.MapsLibrary;

  const beachFlagImg = document.createElement('img');
  beachFlagImg.src = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

  const glyphImg = document.createElement('img');
  glyphImg.src = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/google_logo_g.svg';

  const pinElement = new PinElement({
    background: color,
    borderColor: color,
    glyph: glyphImg,
  });

  const infoWindow = new InfoWindow({
    content: "",
    disableAutoPan: true,
  });

  return { infoWindow, pinElement };
};

const generateRandomColor = () => {
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);
  return "#" + randomColor;
};
