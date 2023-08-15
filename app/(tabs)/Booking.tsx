import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Screen from "../../components/Screen";
import { useLocalSearchParams, useRouter } from "expo-router";
import Listing, { ListingBk } from "../../components/Cards/Listing";
import InnerListings from "../InnerListings";
import { makeSecuredRequest } from "../../utils/makeSecuredRequest";
import { useQueries, useQuery } from "@tanstack/react-query";
import { ErrorComponent, LoadingComponent } from "./Home";

const fetchBookings = async () => {
  const response = await makeSecuredRequest("/bookings/", {
    method: "GET",
  });

  return response;
};

const fetchSaved = async () => {
  const response = await makeSecuredRequest("/listing-bookmarks/", {
    method: "GET",
  });

  return response;
};

const buttonsState: { clicked: string; unclicked: string } = {
  unclicked:
    "flex items-center justify-center border-r-2 border-gray-300 w-[50%] bg-gray-300",
  clicked:
    "flex items-center justify-center w-[50%] border-gray-300 border-r-2",
};

const Booking = () => {
  const [btState, setbtSetate] = useState("current");
  const router = useRouter();
  // const data = useLocalSearchParams();

  const [
    { data: bookings, isLoading, isError },
    { data: savedHostels, isLoading: isLoadingSave, isError: isErrorSaved },
  ] = useQueries({
    queries: [
      {
        queryKey: ["bookings"],
        queryFn: fetchBookings,
      },
      {
        queryKey: ["saved"],
        queryFn: fetchSaved,
      },
    ],
  });

  console.log("Saved Hostels", savedHostels);

  if (isLoading || isLoadingSave) {
    return (
      <Screen>
        <Text>Loading...</Text>
      </Screen>
    );
  }

  if (isError || isErrorSaved) {
    return (
      <Screen>
        <Text>Error</Text>
      </Screen>
    );
  }

  const hasBooking = bookings.length > 0;
  const hasSaved = savedHostels["count"];
  const Bookings = hasBooking ? bookings[0]["listing"] : [];

  const TransactionsDetails = hasBooking && {
    amountPaid: `GHS ${bookings[0]["transaction"]["amount"] / 100}.00`,
    modeOfPayment:
      bookings[0]["transaction"]["channel"] === "mobile_money"
        ? "Mobile Money"
        : "Card",
    transactionTime: new Date(
      bookings[0]["transaction"]["created_at"]
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }),
    transactionDate: new Date(
      bookings[0]["transaction"]["created_at"]
    ).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  const HostelDetails = hasBooking && {
    hostelName: Bookings["name"],
    hostelReviews: Bookings["reviews_count"],
    hostelRating: Bookings["rating"],
    hostelPrice: Bookings["price"],
    hostelRoomType: Bookings["room_types"][0].split("-").join(" "),
    hostelAmenities: Bookings["covered_amenities"],
    hostelImages: Bookings["images"],
    hostelModel: Bookings["pricing_model"],
    OwnerImage: Bookings["owner"]["image"],
    OwnerName:
      Bookings["owner"]["first_name"] + " " + Bookings["owner"]["last_name"],
    DateJoined: new Date(Bookings["owner"]["date_joined"]).toDateString(),
  };

  const HasNothing = ({ text }: { text: string }) => {
    return (
      <View className="flex h-full items-center justify-center -mb-20">
        <Image
          source={require("../../assets/images/nomessages.png")}
          fadeDuration={500}
          className="my-4"
        />

        <Text className="font-bold text-2xl text-center mt-4">{text}</Text>
        <Text className="text-gray-500 text-center my-3 text-base">
          Explore more than 100+ rentals and available apartments and book stays
        </Text>

        <TouchableOpacity
          onPress={() => {
            router.push("/Home");
          }}
        >
          <View className="bg-primary rounded-lg px-5 py-2">
            <Text className="text-white font-medium text-base">Explore</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Screen>
      {isLoading && isLoadingSave && <LoadingComponent />}
      {isError && isErrorSaved && <ErrorComponent />}
      {bookings && savedHostels && (
        <View>
          <Text className="text-xl text-center font-semibold my-2">
            Booking
          </Text>

          <View>
            <View className="mb-5 border-l-2 border-t-2 border-b-2 border-gray-300 h-10 w-full rounded-md  flex-row ">
              <TouchableOpacity
                onPress={() => {
                  setbtSetate("current");
                }}
                className={
                  btState == "current"
                    ? buttonsState.clicked
                    : buttonsState.unclicked
                }
              >
                <View>
                  <Text className="text-gray-500 text-sm ">Current</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setbtSetate("Saved");
                }}
                className={
                  btState == "current"
                    ? buttonsState.unclicked
                    : buttonsState.clicked
                }
              >
                <View>
                  <Text className="text-gray-500 text-sm">Saved</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View>
              {btState == "current" && (
                <View className="mb-32">
                  {hasBooking && TransactionsDetails && HostelDetails ? (
                    <InnerListings
                      hostelName={HostelDetails.hostelName}
                      hostelRating={HostelDetails.hostelRating}
                      hostelReviews={HostelDetails.hostelReviews}
                      hostelPrice={HostelDetails.hostelPrice}
                      hostelModel={HostelDetails.hostelModel}
                      hostelRoomType={HostelDetails.hostelRoomType}
                      hostelAmenities={HostelDetails.hostelAmenities}
                      hostelImages={HostelDetails.hostelImages}
                      OwnerImage={HostelDetails.OwnerImage}
                      OwnerName={HostelDetails.OwnerName}
                      DateJoined={HostelDetails.DateJoined}
                      TransactionDetails={TransactionsDetails}
                    />
                  ) : (
                    <HasNothing text="Bookings not found?" />
                  )}
                </View>
              )}

              {btState == "Saved" && (
                <View>
                  {hasSaved > 0 ? (
                    <View>
                      {savedHostels.results.map((hostel: any) => {
                        return <Listing data={hostel} />;
                      })}
                    </View>
                  ) : (
                    <HasNothing text="No bookmarks?" />
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      )}
    </Screen>
  );
};

export default Booking;
