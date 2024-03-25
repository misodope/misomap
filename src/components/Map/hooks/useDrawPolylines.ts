import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useState } from "react";

interface IDrawPolylinesProps {
  loader: Loader;
  polylines: string[];
  map: google.maps.Map | undefined;
}
export const useDrawPolylines = ({ loader, polylines, map }: IDrawPolylinesProps) => {
  const [decodedPolylines, setDecodedPolylines] = useState<{
    lat: number;
    lng: number;
  }[]>([]);

  useEffect(() => {
    if (!loader || !polylines.length) return;

    (async () => {
      const { encoding } = await loader.importLibrary('geometry') as google.maps.GeometryLibrary;
      const decodedPolylines = polylines.map(polyline => encoding.decodePath(polyline));

      const transformedPolylines = decodedPolylines.map(decodedPolyline => {
        return decodedPolyline.map(decodedPolyline => {
          return {
            lat: decodedPolyline.lat(),
            lng: decodedPolyline.lng()
          }
        });
      });

      const flattenedPolylines = transformedPolylines.flat();

      setDecodedPolylines(flattenedPolylines);
    })();
  }, [polylines, loader]);

  useEffect(() => {
    if (!map || !decodedPolylines.length) return;

    const paths = new google.maps.Polyline({
      path: decodedPolylines,
      geodesic: true,
      strokeColor: "#0d6a18",
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });

    paths.setMap(map);
  }, [decodedPolylines, map])

  return {
    decodedPolylines
  }
}