const getRandomCoordinate = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

export const generateRandomCoordinates = (count: number) => {
  const minLatitude = 40.700959;
  const maxLatitude = 40.879036;
  const minLongitude = -74.047285;
  const maxLongitude = -73.906650;

  const randomCoordinates = [];

  for (let i = 0; i < count; i++) {
    const lat = getRandomCoordinate(minLatitude, maxLatitude);
    const lng = getRandomCoordinate(minLongitude, maxLongitude);
    randomCoordinates.push({ lat, lng });
  }

  return randomCoordinates;
};



// export const randomCoordinates = generateRandomCoordinates(100);
// export const randomCoordinates = [
//   {
//     "lat": 40.835299587437504,
//     "lng": -74.02701821266214
//   },
//   {
//     "lat": 40.82724237961019,
//     "lng": -74.00110963102554
//   },
//   {
//     "lat": 40.8458058372461,
//     "lng": -73.9916724847626
//   },
//   {
//     "lat": 40.86607960827188,
//     "lng": -73.97520399637637
//   },
//   {
//     "lat": 40.85943676514228,
//     "lng": -73.95172200393847
//   },
//   {
//     "lat": 40.857116577012384,
//     "lng": -73.92247264362035
//   },
//   {
//     "lat": 40.842556841568836,
//     "lng": -73.92429774951657
//   },
//   {
//     "lat": 40.824975836678746,
//     "lng": -73.9576485728935
//   },
//   {
//     "lat": 40.80398006691272,
//     "lng": -73.95118678607831
//   },
//   {
//     "lat": 40.80040791707301,
//     "lng": -73.95331261457835
//   },
//   {
//     "lat": 40.79266539451199,
//     "lng": -73.96174933315412
//   },
//   {
//     "lat": 40.7919522902551,
//     "lng": -73.93225798944275
//   },
//   {
//     "lat": 40.755825284931674,
//     "lng": -73.90748699532263
//   },
//   {
//     "lat": 40.74519812891624,
//     "lng": -73.92309735258605
//   },
//   {
//     "lat": 40.71806707343362,
//     "lng": -73.91233415172013
//   },
//   {
//     "lat": 40.71406671179049,
//     "lng": -73.90908590924289
//   },
//   {
//     "lat": 40.70820751254035,
//     "lng": -73.95192450282437
//   },
//   {
//     "lat": 40.702135943790374,
//     "lng": -73.99441497614467
//   },
//   {
//     "lat": 40.715542949974164,
//     "lng": -74.03366967117474
//   },
//   {
//     "lat": 40.72606712858932,
//     "lng": -74.03399738798743
//   },
//   {
//     "lat": 40.77150268547057,
//     "lng": -74.02386468773426
//   },
//   {
//     "lat": 40.78542051805479,
//     "lng": -74.00835568856952
//   },
//   {
//     "lat": 40.774942147943676,
//     "lng": -73.98683159937794
//   },
//   {
//     "lat": 40.76623522675528,
//     "lng": -73.9900033661382
//   },
//   {
//     "lat": 40.867095663941775,
//     "lng": -74.01872352373557
//   }
// ]

export const formatGoogleRouteCoordinates = (coordinates: ICoordinate[]) => {
  return coordinates.map((coordinate) => {
    return {
      "location": {
        "latLng": {
          "latitude": coordinate.lat,
          "longitude": coordinate.lng,
        }
      }
    }
  });
};

export interface ICoordinate { lat: number, lng: number, distanceFromOrigin?: number };

// Haversine formula: https://www.movable-type.co.uk/scripts/latlong.html
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const radlat1 = (Math.PI * lat1) / 180;
  const radlat2 = (Math.PI * lat2) / 180;

  const theta = lon1 - lon2;
  const radtheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;

  return dist;
};

export const sortCoordinates = (coordinates: ICoordinate[], totalCoordinates: number, sortedCoordinates: ICoordinate[] = []): ICoordinate[] => {
  if (sortedCoordinates.length === totalCoordinates) return sortedCoordinates;

  for (let loc of coordinates) {
    loc.distanceFromOrigin = getDistance(loc.lat, loc.lng, coordinates[0].lat, coordinates[0].lng);
  }

  const sortedLocations = [...coordinates]
    .sort((a, b) => {
      if (!a.distanceFromOrigin || !b.distanceFromOrigin) return 0;
      return a.distanceFromOrigin - b.distanceFromOrigin;
    })
    .map((loc) => {
      delete loc.distanceFromOrigin;
      return loc;
    });

  return sortCoordinates(sortedLocations.slice(1), totalCoordinates, [...sortedCoordinates, sortedLocations[0]]);
}

// https://stackoverflow.com/questions/73966323/sorting-latitude-and-longitude-by-distance-and-grouping-them-based-on-tolerance
const getGroupsByDistance = (coordinates: ICoordinate[], tolerance: number) => {
  const coordinatesToleranceMap = Array(coordinates.length).fill(1); // 1 = true

  return coordinates.reduce(
    (groups: any[], coordinate, index) => {
      // The tolerance map contains true/false (0/1) values, ignore anything with 0
      if (coordinatesToleranceMap[index] === 0) return groups;

      const { lat, lng } = coordinate;

      // This will return the current listing because it's the same lat/lng. We don't need to check it's length because it always has one
      const coordinatesWithinTolerance = coordinates.filter(
        (coordinate, index) => {
          // We're not interested in any listing that have been filtered out already
          if (coordinatesToleranceMap[index] === 0) {
            return false;
          }

          const isSameLatLng =
            lat === coordinate.lat &&
            lng === coordinate.lng;

          // Measure distance using Haversine formula
          const isWithinTolerance =
            isSameLatLng ||
            getDistance(
              lat,
              lng,
              coordinate.lat,
              coordinate.lng
            ) <= tolerance;

          // Ignore the current listing on the next filter
          if (isWithinTolerance) coordinatesToleranceMap[index] = 0;

          return isWithinTolerance;
        }
      );

      groups.push({
        lat,
        lng,
        properties: coordinatesWithinTolerance
      });

      return groups;
    },
    []
  );
};

export const getEncodedPolylines = (routes: any) => {
  console.log(routes);
  return routes.routes[0].legs.map((leg: any) => {
    return leg.polyline.encodedPolyline
  })
}

export const shuffle = <T>(array: T[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}; 