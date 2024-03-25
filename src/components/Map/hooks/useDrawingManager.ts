import { useEffect } from "react";
import { Loader } from '@googlemaps/js-api-loader';

interface MapDrawingProps {
  map: google.maps.Map | undefined;
  loader: Loader;
}
export const useDrawingManager = ({ map, loader }: MapDrawingProps) => {
  useEffect(() => {
    if (!map) return;

    (async () => {
      const { DrawingManager } = await loader.importLibrary('drawing') as google.maps.DrawingLibrary;

      const drawingManager = new DrawingManager({
        drawingMode: google.maps.drawing.OverlayType.MARKER,
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_CENTER,
          drawingModes: [
            google.maps.drawing.OverlayType.MARKER,
            google.maps.drawing.OverlayType.CIRCLE,
            google.maps.drawing.OverlayType.POLYGON,
            google.maps.drawing.OverlayType.POLYLINE,
            google.maps.drawing.OverlayType.RECTANGLE,
          ],
        },
        markerOptions: {
          icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
        },
        circleOptions: {
          fillColor: "#ffff00",
          fillOpacity: 1,
          strokeWeight: 5,
          clickable: false,
          editable: true,
          zIndex: 1,
        },
      });

      drawingManager.setMap(map);
    })();
  }, [map, loader])
};