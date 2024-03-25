/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect, useRef } from "react";
import { mapLegendStyle, mapLegendIconStyle, mapLegendIconTextStyle, mapIconContainer } from "./Map.css";

const icons: Record<string, any> = {
  assigned: {
    name: "Assigned Routes",
    icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
  },
  unassigned: {
    name: "Unassigned Stops",
    icon: "https://developers.google.com/maps/documentation/javascript/examples/full/images/google_logo_g.svg"
  },
  dump: {
    name: "Dump Sites",
    icon: "https://maps.google.com/mapfiles/kml/shapes/parking_lot_maps.png"
  },
  yard: {
    name: "Yards",
    icon: "https://maps.google.com/mapfiles/kml/shapes/library_maps.png"
  },
}

interface MapLegendProps {
  map?: google.maps.Map;
}

export const MapLegend = ({ map }: MapLegendProps) => {
  const legendRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!map) return;
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legendRef.current as HTMLElement);
  }, [map]);

  return (
    <div id="legend" ref={legendRef} className={mapLegendStyle} style={{ left: '35px' }}>
      <h1>Map Key</h1>
      {Object.entries(icons).map(([_, value]) => {
        return <div key={value.name} className={mapIconContainer}>
          <img className={mapLegendIconStyle} src={value.icon} alt={value.name} />
          <span className={mapLegendIconTextStyle}>{value.name}</span>
        </div>
      })}
    </div>
  )
};
