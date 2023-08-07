import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useCallback, useEffect, useMemo, useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import MapView, { Marker } from "react-native-maps";
import { useLocation } from "../../hooks/useLocation";
import Listing from "../../components/Cards/Listing";
import { fetchListings, LoadingComponent, ErrorComponent } from "./Home";
import { useQuery } from "@tanstack/react-query";
import { Listings } from "../../types/data";

const App = () => {
  const mapRef = useRef<MapView | null>(null);

  const { location, city } = useLocation();
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const zoomIn = () => {
    const region = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.005 * 3,
      longitudeDelta: 0.005 * 3,
    };
    mapRef.current?.animateToRegion(region, 2500);
  };

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["20%", "50%", "85%"], []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  useEffect(() => {
    zoomIn();
  }, []);

  const {
    data: listings,
    isLoading,
    isError,
  } = useQuery(["listings"], fetchListings);

  return (
    <View style={styles.container}>
      <View className="h-full w-screen z-0 absolute top-[-60px]">
        <MapView
          ref={mapRef}
          className="flex-1 h-full"
          zoomControlEnabled={true}
          region={{
            ...location,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onMarkerDragEnd={(e) =>
            setCurrentLocation({
              longitude: e.nativeEvent.coordinate.longitude,
              latitude: e.nativeEvent.coordinate.latitude,
              longitudeDelta: e.nativeEvent.coordinate.longitude,
              latitudeDelta: e.nativeEvent.coordinate.latitude,
            })
          }
        >
          <Marker coordinate={location} />
        </MapView>
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
      >
        {isError && <ErrorComponent />}
        {isLoading && <LoadingComponent />}
        {listings && (
          <View className="px-4 pt-2">
            <Text className="text-2xl font-bold mb-4">Rentals near {city}</Text>
            <View>
              <ScrollView
                className="mb-32"
                showsVerticalScrollIndicator={false}
              >
                {listings.results.map((item: Listings) => (
                  <Listing data={item} key={item.id} />
                ))}
              </ScrollView>
            </View>
          </View>
        )}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "transparent",
  },
});

export default App;
