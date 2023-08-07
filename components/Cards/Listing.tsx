import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import type { Listings as IListing } from "../../types/data";
import { AntDesign, Entypo, Ionicons } from "@expo/vector-icons";
import Colors from "../../constants/Colors";

import { useRouter } from "expo-router";

const Listing = ({
  data: hostel,
  booking,
}: {
  data: IListing;
  booking?: boolean;
}) => {
  const navigation = useRouter();

  const data = hostel.listing ? hostel.listing : hostel;

  console.log("Listing", data);

  const images = [
    "https://umat.gh-accommodation.online/wp-content/uploads/2023/06/2019-10-14.jpg",
    "https://umat.gh-accommodation.online/wp-content/uploads/2023/02/WhatsApp-Image-2023-06-21-at-08.03.49-1.jpg",
    "https://umat.gh-accommodation.online/wp-content/uploads/2023/02/WhatsApp-Image-2023-06-21-at-08.03.49.jpg",
    "https://umat.gh-accommodation.online/wp-content/uploads/2023/06/IMG_20220514_140601_319.jpg",
    "https://umat.gh-accommodation.online/wp-content/uploads/2023/06/The-Point-e1687548443819.jpg",
    "https://umat.gh-accommodation.online/wp-content/uploads/2023/06/1687523072624-oldbuilding.jpg",
    "https://umat.gh-accommodation.online/wp-content/uploads/2023/06/IMG-20230623-WA0055.jpg",
    "https://umat.gh-accommodation.online/wp-content/uploads/2023/06/IMG-20230623-WA0056.jpg",
  ];

  return (
    <TouchableOpacity
      onPress={() => {
        console.log("Lising", JSON.stringify(data, null, 2));

        navigation.push({
          pathname: "Listing",
          params: {
            booking: booking,
            hostelName: data.name,
            hostelId: data.id,
            hostelDescription: data.description,
            hostelRating: data.rating,
            hostelReviews: data.total_reviews,
            hostelPrice: data.price,
            hostelAmenities: data.covered_amenities.join("|"),
            hostelIsBookmarked: data.has_user_bookmarked,

            ownerName: data.owner.first_name + " " + data.owner.last_name,
            ownerDateJoined: data.owner.date_joined,
            ownerLocation: data.owner.city,
            ownerTelephone: data.owner.telephone,
            ownerVerified: data.owner.verified,
          },
        });
      }}
      className="my-4 w-full border border-gray-200 bg-white  rounded-2xl shadow-sm"
    >
      <View className="absolute rounded-xl z-10 right-0 m-3 bg-yellow-50 px-2 py-1 ring-1 ring-inset ring-yellow-600/20">
        <Text className="text-xs font-medium text-yellow-800 capitalize">
          {data.room_types[0].split("-").join(" ")}
        </Text>
      </View>

      <Image
        className={`w-full h-40 rounded-t-2xl ${booking && "h-80"}`}
        resizeMode="cover"
        source={{
          uri: images[Math.floor(Math.random() * images.length)],
        }}
      />
      <View className="p-3 pb-2">
        <Text className="text-lg font-semibold text-neutral-800">
          {data.name}
        </Text>
        {/* <View className="flex flex-row items-center">
          <Text className="text-sm text-gray-500">
            {data.occupants} Occupants
          </Text>
          <Entypo name="dot-single" size={18} color="gray" />
          <Text className="text-sm text-gray-500">
            {data.bathrooms! > 1
              ? `${data.bathrooms} Bedrooms`
              : `${data.bathrooms} Bedroom`}
          </Text>
          <Entypo name="dot-single" size={18} color="gray" />
          <Text className="text-sm text-gray-500">
            {data.beds && data.beds > 1
              ? `${data.beds} Beds`
              : `${data.beds} Bed`}
          </Text>
        </View> */}
        <View className="flex-row justify-between items-center">
          <Text className="font-semibold text-base text-gray-500">
            GHS {data.price}
          </Text>
          <View className="flex-row gap-x-1 items-center">
            <AntDesign name="star" size={18} color={Colors.light.primary} />
            <Text className="font-semibold text-base">
              {data.rating} ({data.total_reviews})
            </Text>
          </View>
        </View>
        {booking && (
          <View className="flex items-end">
            <Text className="text-gray-500 mt-3 text-base ">
              20 Jan - 5th April, 2023
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const ListingBk = ({
  data,
  booking,
}: {
  data: IListing;
  booking?: boolean;
}) => {
  const navigation = useRouter();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.push({
          pathname: "Listing",
          params: {
            booking: booking,
            hostelName: data.name,
            hostelId: data.id,
            hostelDescription: data.description,
            hostelRating: data.rating,
            hostelReviews: data.numberOfReviews,
            hostelPrice: data.price,
          },
        });
      }}
      className="my-4 w-full border border-gray-200 bg-white rounded-2xl shadow-sm"
    >
      <Image
        className={`w-full rounded-t-2xl ${booking && "h-50"}`}
        resizeMode="cover"
        source={require("../../assets/images/hostel.png")}
      />
      <View className="p-3">
        <Text className="text-lg font-semibold text-neutral-800">
          {data.name}
        </Text>
        <View className="flex flex-row items-center">
          <Text className="text-sm text-gray-500">
            {data.occupants} Occupants
          </Text>
          <Entypo name="dot-single" size={18} color="gray" />
          <Text className="text-sm text-gray-500">
            {data.bathrooms! > 1
              ? `${data.bathrooms} Bedrooms`
              : `${data.bathrooms} Bedroom`}
          </Text>
          <Entypo name="dot-single" size={18} color="gray" />
          <Text className="text-sm text-gray-500">
            {data.beds && data.beds > 1
              ? `${data.beds} Beds`
              : `${data.beds} Bed`}
          </Text>
        </View>
        <View className="mt-2 flex-row justify-between items-center">
          <Text className="font-bold text-xl text-gray-800">
            GHS {data.price}
          </Text>
          <View className="flex-row gap-1 items-center">
            <AntDesign name="star" size={18} color={Colors.light.primary} />
            <Text className="font-semibold text-lg">
              {data.rating} ({data.numberOfReviews})
            </Text>
          </View>
        </View>
        {booking && (
          <View className="flex items-end">
            <Text className="text-gray-500 mt-3 text-base ">
              20 Jan - 5th April, 2023
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Listing;
