import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useState, useContext } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import Screen from "../components/Screen";
import { ModalSheet } from "../components/Modals/ModalSheet";
import { ModalContentWrapper } from "../components/Modals/ModalContentWrapper";
import Amenities from "../components/Cards/Amenities";
import Carousel from "react-native-swipeable-carousel";
import { AuthContext } from "../context/AuthProvider";
import { AmenityNameFunction } from "./Listing";

interface TransactionsDetailsProps {
  [key: string]: string | number;
  amountPaid: number | string;
  modeOfPayment: string;
  transactionTime: string;
  transactionDate: string;
}

interface HostelProps {
  hostelName: string;
  hostelReviews: number;
  hostelRating: number;
  hostelPrice: number;
  hostelModel: string;
  hostelRoomType: string;
  hostelAmenities: string[];
  hostelImages: string[];
  OwnerImage: string;
  OwnerName: string;
  DateJoined: string;
  TransactionDetails: TransactionsDetailsProps;
}

interface ReceiptsInfoType extends TransactionsDetailsProps {
  Hostel: string;
  "Room Type": string;
  Pricing: string;
}

const Listing = ({
  hostelName,
  hostelReviews,
  hostelRating,
  hostelPrice,
  hostelModel,
  hostelRoomType,
  hostelAmenities,
  hostelImages,
  OwnerImage,
  OwnerName,
  DateJoined,
  TransactionDetails,
}: HostelProps) => {
  const router = useRouter();
  const data = useLocalSearchParams();
  const [modalVisible, setModalVisible] = useState(false);
  const { user, hasBooking } = useContext(AuthContext)!;

  const ReceiptsInfo: ReceiptsInfoType = {
    Hostel: hostelName,
    "Room Type":
      hostelRoomType === "two in a room" ? "2 in a room" : hostelRoomType,
    Pricing: `Per ${hostelModel === "semester" ? "Semester" : "Year"}`,
    ...TransactionDetails,
  };

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const bookNowButtonColor = hasBooking ? "gray-300" : "primary";

  return (
    <View>
      <ScrollView showsVerticalScrollIndicator={false} className="pb-10">
        <Screen showSafeArea={false}>
          <View className="rounded-md border-2 border-gray-400">
            <Carousel
              images={hostelImages}
              height={250}
              enableGestureSwipe={true}
            />
          </View>

          <View className="p-3 space-y-3">
            <View className="pb-4 mt-3 border-b border-gray-300 border-solid">
              <View className="flex flex-row justify-between items-center mb-1 -mt-2">
                <View className="flex-row gap-2 items-center">
                  <FontAwesome name="star" size={16} color="#EB5E55" />
                  <Text className="font-semibold">{hostelRating}</Text>
                  <Text className="text-gray-500">{hostelReviews}</Text>

                  <Octicons name="dot-fill" size={10} color="#EB5E55" />
                  <Text className="text-gray-500">Hostel in Tarkwa</Text>
                </View>

                <View>
                  <Text className="font-semibold text">GHS {hostelPrice}</Text>
                </View>
              </View>

              <View className="flex-row justify-betwee my-1">
                <Text className="text-gray-500">
                  {hostelRoomType.replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                  )}
                </Text>
                {/* <Text className="text-gray-500">Paid Per-{hostelModel}</Text> */}
              </View>

              <View className="flex-row justify-between mt-3">
                <Text className="text-2xl font-bold">{hostelName}</Text>

                <ModalSheet
                  modalButton={
                    <TouchableOpacity onPress={toggleModal}>
                      <View className={`py-0.5 p-2 ml-2 rounded-lg bg-primary`}>
                        <Text className="text-sm font-medium text-white">
                          View Receipt
                        </Text>
                      </View>
                    </TouchableOpacity>
                  }
                  isVisible={modalVisible}
                  toggleModal={toggleModal}
                >
                  <ModalContentWrapper setModalVisible={setModalVisible}>
                    <View className="w-full h-full ">
                      <View className="mb-5">
                        <Text className="text-2xl font-bold">
                          Customer Receipt
                        </Text>
                        <Text className="text-gray-500 text-base">
                          {`${user?.first_name} ${user?.last_name}`}
                        </Text>
                        {/* <Text className="text-gray-400 text-md">
                          Phone Number : 0234593867
                        </Text> */}
                      </View>
                      <View className="w-full px-0 py-0 rounded-md o">
                        {Object.keys(ReceiptsInfo).map((key, index: number) => (
                          <View className="">
                            {key !== "Name" && key !== "PhoneNumber" && (
                              <View
                                className={`mb-0 py-4 px-2 ${
                                  index % 2 == 0 ? "bg-white" : "bg-[#dbdbdb9c]"
                                } `}
                              >
                                <View
                                  key={index}
                                  className="flex-row justify-between"
                                >
                                  <Text className="text-lg font-semibold text-gray-400 capitalize">
                                    {key.toString().replace(/([A-Z])/g, " $1")}
                                  </Text>

                                  <Text className="text-lg font-semibold">
                                    {ReceiptsInfo[key]}
                                  </Text>
                                </View>
                              </View>
                            )}
                          </View>
                        ))}
                      </View>
                    </View>
                  </ModalContentWrapper>
                </ModalSheet>
              </View>
            </View>

            {hostelAmenities.map((amenity: string, key: number) => {
              const amenitiesFunctionReturn = AmenityNameFunction(amenity);

              console.log(amenitiesFunctionReturn);

              return (
                <View
                  className="flex flex-row items-center gap-3 my-1"
                  key={key}
                >
                  <View className="flex flex-row items-center justify-center w-10 h-10 rounded-md bg-neutral-200">
                    <Amenities amenity={amenity} />
                  </View>
                  <Text className="text-lg capitalize">
                    {amenitiesFunctionReturn}
                  </Text>
                </View>
              );
            })}

            {/* Hosted by */}
            <View className="pb-4 mb-60">
              <Text className="mb-4 text-lg font-bold">Hosted by</Text>

              <View>
                <View className="flex flex-row items-center gap-3 mb-2">
                  <Image
                    className="w-14 h-14 rounded-2xl"
                    source={{
                      uri: OwnerImage,
                    }}
                  />

                  <View>
                    <Text className="text-lg font-bold">{OwnerName}</Text>
                    <Text className="text-gray-500">
                      Joined in {new Date(DateJoined as string).getFullYear()}{" "}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Screen>
      </ScrollView>

      {!data.booking && (
        <View className="absolute bottom-0 flex flex-row items-center justify-between w-full h-24 px-5 pb-2 bg-white">
          <View className="flex flex-row items-center justify-center gap-1">
            <Text className="text-lg font-bold">GHS {data.hostelPrice}</Text>
            <Text className="text-">/ year</Text>
          </View>

          <TouchableOpacity
            disabled={hasBooking}
            onPress={() => {
              router.push({
                pathname: "PaymentScreen",
                params: {
                  hostelPrice: data.hostelPrice,
                },
              });
            }}
          >
            <View className={`px-5 py-2 rounded-lg bg-${bookNowButtonColor}`}>
              <Text className="text-base font-medium text-white">Book Now</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Listing;
