import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import * as Geolocation from "expo-location";
import { LatLng } from "react-native-maps";

interface contextProps {
  location: LatLng;
  city: string;
  setLocation: Dispatch<SetStateAction<LatLng>>;
}

const LocationContext = createContext<contextProps | null>(null);

export const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<LatLng>({
    latitude: 0,
    longitude: 0,
  });
  const [city, setCity] = useState<string>("");

  useEffect(() => {
    (async () => {
      let { status } = await Geolocation.requestForegroundPermissionsAsync();
      if (status === "granted") {
        await Geolocation.watchPositionAsync(
          {
            accuracy: 6,
          },
          async (location) => {
            setLocation({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            });

            // Reverse geocoding to get the current city
            const geocode = await Geolocation.reverseGeocodeAsync(
              location.coords
            );
            if (geocode.length > 0) {
              setCity(geocode[0].city || "");
            }
          }
        );
      }
    })();
  }, []);

  return (
    <LocationContext.Provider value={{ location, city, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);

  if (!context) {
    throw Error("useLocation was called without a provider");
  }
  return context;
};
