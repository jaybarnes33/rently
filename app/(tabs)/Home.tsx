import { Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Listing from "../../components/Cards/Listing";
import Screen from "../../components/Screen";
import Colors from "../../constants/Colors";
import { Listings } from "../../types/data";
import { makeSecuredRequest } from "../../utils/makeSecuredRequest";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery } from "@tanstack/react-query";

export const fetchListings = async () => {
  const response = await makeSecuredRequest("/listings/", {
    method: "GET",
  });

  return response;
};

export const fetchSearch = async (searchQuery: string) => {
  const response = await makeSecuredRequest(
    `/listings/search?name=${searchQuery}`,
    {
      method: "GET",
    }
  );

  return response;
};

export const LoadingComponent = () => {
  return (
    <SafeAreaView className="h-full flex text-center flex-col justify-center items-center">
      <Text className="text-xl font-semibold mb-2">Loading...</Text>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
};

// Fix Refetch Types
export const ErrorComponent = () => {
  return (
    <SafeAreaView className="h-full flex text-center flex-col justify-center items-center">
      <Text className="text-xl font-semibold mb-2">
        An error occured. Please check your internet connection and try again
      </Text>
    </SafeAreaView>
  );
};

const Home = () => {
  const navigation = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [refreshing, setRefreshing] = React.useState(false);

  const {
    data: listings,
    error,
    isLoading,
    isError,
    refetch: refetchListings,
  } = useQuery(["listings"], fetchListings);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetchListings().then(() => setRefreshing(false));
  }, []);

  const {
    data: search,
    error: searchError,
    isLoading: searchIsLoading,
    isError: searchIsError,
    refetch,
  } = useQuery({
    queryKey: ["search", searchValue],
    queryFn: () => fetchSearch(searchValue),
    enabled: false,
  });

  return (
    <Screen>
      {isError && <ErrorComponent />}
      {isLoading && <LoadingComponent />}
      {listings && (
        <>
          <View className="flex-row items-center px-3 shadow-md bg-neutral-100 rounded-xl">
            <TextInput
              placeholder="Search"
              className="flex-1 px-2 py-3 font-semibold"
              value={searchValue}
              onChangeText={(e) => {
                setSearchValue(e);
              }}
            />
            <TouchableOpacity
              onPress={() => {
                refetch();
                console.log("Search Results", searchValue);
              }}
            >
              <Octicons name="search" size={16} color={Colors.light.primary} />
            </TouchableOpacity>
          </View>
          <View className="pt-5 ">
            <View className="items-center -top-5 ">
              <Octicons
                className="absolute"
                name="dash"
                size={30}
                color={Colors.light.secondary}
              />
            </View>

            {!search && listings.results.length > 0 && (
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }
                className="mb-32 -top-6"
                showsVerticalScrollIndicator={false}
              >
                {listings.results.map((listing: any) => {
                  return <Listing data={listing} key={listing.id} />;
                })}
              </ScrollView>
            )}

            {!search && !(listings.results.length > 0) && (
              <ScrollView
                className="mb-32 -top-6"
                showsVerticalScrollIndicator={false}
              >
                <View className="flex mt-10 text-center flex-col justify-center items-center">
                  <Text className="text-xl font-semibold mb-2">
                    No Hostel Available
                  </Text>
                </View>
              </ScrollView>
            )}

            {searchValue && searchIsLoading && (
              <View className="flex text-center flex-col justify-center items-center">
                <Text className="text-xl font-semibold mb-2">Searching...</Text>
                <ActivityIndicator size="large" />
              </View>
            )}

            {searchValue && searchIsError && <ErrorComponent />}

            {search && !(search.length > 0) && (
              <ScrollView
                className="mb-32 -top-6"
                showsVerticalScrollIndicator={false}
              >
                <View className="flex mt-10 text-center flex-col justify-center items-center">
                  <Text className="text-xl font-semibold mb-2">
                    No Hostel Found
                  </Text>
                </View>
              </ScrollView>
            )}

            {search && search.length > 0 && (
              <ScrollView
                className="mb-32 -top-6"
                showsVerticalScrollIndicator={false}
              >
                {search.map((listing: any) => {
                  console.log("Search Listing", listing);
                  return <Listing data={listing} key={listing.id} />;
                })}
              </ScrollView>
            )}
          </View>
        </>
      )}
    </Screen>
  );
};

export default Home;
