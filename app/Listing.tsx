import {
  AntDesign,
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext, useRef, useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Carousel from "react-native-swipeable-carousel";
import { ModalContentWrapper } from "../components/Modals/ModalContentWrapper";
import { ModalSheet } from "../components/Modals/ModalSheet";
import Screen from "../components/Screen";
import { AuthContext } from "../context/AuthProvider";
import { createURL } from "../utils/apiUtils";
import { Paystack, paystackProps } from "react-native-paystack-webview";
import { PayStackProps } from "react-native-paystack-webview/lib/types";
import { Alert } from "react-native";
import Amenities from "../components/Cards/Amenities";
import { makeSecuredRequest } from "../utils/makeSecuredRequest";
import { rentify } from "../utils/text";

// TODO: Loading state when fetching data

interface ReviewModalProps {
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  hostelName: string;
  reviews: ListingRatingProps[];
  hostelId: string;
  accessToken: string;
}

interface ListingRatingProps {
  rating: string;
  student: {
    first_name: "";
    last_name: "";
  };
  comment: string;
  hostel: number;
}

const ReviewModal = ({
  setModalVisible,
  hostelName,
  reviews,
  hostelId,
  accessToken,
}: ReviewModalProps) => {
  const [selectedStars, setSelectedStars] = useState(0);
  const [review, setReview] = useState("");
  const { user } = useContext(AuthContext)!;
  const queryClient = useQueryClient();

  const onStarClick = (i: React.SetStateAction<number>) => {
    setSelectedStars(i);
  };

  const postReview = async (
    hostelId: string,
    rating: number,
    comment: string
  ) => {
    await queryClient.invalidateQueries({ queryKey: ["listings"] });
    await queryClient.invalidateQueries({ queryKey: ["reviews"] });

    const response = await fetch(createURL(`/ratings/`), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        rating,
        comment,
        hostel: Number.parseInt(hostelId),
      }),
    });
    const data = await response.json();
    setModalVisible(false);
  };

  const userHasAReview = (first: string, last: string) =>
    reviews.some(
      (review) =>
        review.student.first_name === first && review.student.last_name === last
    );

  const reviewExists = userHasAReview(user?.first_name!, user?.last_name!);

  return (
    <ModalContentWrapper setModalVisible={setModalVisible}>
      <ScrollView showsVerticalScrollIndicator={false} className="mb-32">
        <Text className="text-lg font-bold text-center">
          {hostelName} Review
        </Text>

        {!reviewExists && (
          <View className="flex items-center justify-center mt-8">
            <Image
              className="w-24 h-24 rounded-full"
              source={{
                uri: "https://picsum.photos/200/300",
              }}
            />
            <Text className="mt-2 text-xl font-medium ">
              {user?.first_name} {user?.last_name}
            </Text>
            <Text className="text-gray-600">Rate the hostel</Text>

            <View className="flex flex-row mt-5 mb-2 bg-transparent gap-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity
                  key={i}
                  activeOpacity={1}
                  onPress={() => onStarClick(i)}
                >
                  <AntDesign
                    name="star"
                    size={24}
                    color={selectedStars >= i ? "#ffb224" : "#d4d4d8"}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <View className="flex flex-row items-center justify-between w-full p-2 pb-0 mt-5 border border-gray-300 rounded">
              <TextInput
                autoCapitalize="none"
                className="w-[90%] font-bold h-24"
                placeholder="Additional Comments..."
                multiline={true}
                numberOfLines={4}
                onChangeText={(text) => setReview(text)}
                value={review}
              />
            </View>

            <View className="flex flex-row justify-between w-full gap-x-4">
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="flex-1 px-4 py-2 mt-5 bg-white border rounded-md border-primary"
              >
                <Text className="text-base font-semibold text-center text-primary">
                  Not Now
                </Text>
              </TouchableOpacity>

              {/* TODO: Add a Loading indicator when the review is being submitted */}
              <TouchableOpacity
                onPress={() => postReview(hostelId, selectedStars, review)}
                className="flex-1 px-4 py-2 mt-5 rounded-md bg-primary"
              >
                <Text className="text-base font-semibold text-center text-white">
                  Submit Review
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {reviews && reviews.length > 0 && (
          <View className="mt-10">
            <Text className="mb-4 text-lg font-bold">Total Reviews</Text>

            {reviews.map((review, i) => (
              <View className="mb-2 border-t border-gray-300 py-2" key={i}>
                <View className="flex flex-row justify-between">
                  <Text className="text-lg font-bold">
                    {`${review.student.first_name} ${review.student.last_name}`}
                  </Text>
                  <View className="flex flex-row items-center gap-x-2">
                    <AntDesign name="star" size={16} color="#EB5E55" />
                    <Text className="font-semibold text-gray-500">
                      {review.rating}
                    </Text>
                  </View>
                </View>
                <Text className="text-gray-500">{review.comment}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </ModalContentWrapper>
  );
};

export const AmenityNameFunction = (amenity: string) => {
  switch (amenity) {
    case "tv":
      return "TV";
      break;

    case "wifi":
      return "Wi-Fi";
      break;

    default:
      return amenity.charAt(0).toUpperCase() + amenity.slice(1);
      break;
  }
};

interface TransactionReferenceType {
  message: string;
  redirecturl: string;
  reference: string;
  status: string;
  trans: string;
  transaction: string;
  trxref: string;
}

const Listing = () => {
  const router = useRouter();
  const data = useLocalSearchParams();

  const [saveActive, setSaveActive] = useState(
    data.hostelIsBookmarked === "true" ? true : false
  );
  const [buttonsState, setButtonSate] = useState(
    data.hostelIsBookmarked === "true" ? "gray-300" : "primary"
  );
  const { accessToken, user, hasBooking } = useContext(AuthContext)!;

  console.log("Current Open Listing", data);

  const {
    isLoading,
    error,
    data: reviews,
  } = useQuery(["reviews"], () => fetchReviews(data.hostelId as string));

  const bookmarkMutation = useMutation((listingId) =>
    fetch(createURL("/listing-bookmarks/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        listing: listingId,
      }),
    }).then((res) =>
      res.ok ? res.json() : Alert.alert("An error occured. Try again")
    )
  );

  const fetchReviews = async (hostelId: string) => {
    const response = await fetch(createURL(`/ratings/${hostelId}`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    console.log(data);
    return data;
  };

  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const SaveHostel = (listingId: any) => {
    bookmarkMutation.mutate(listingId, {
      onSuccess: (data) => {
        // React Query will automatically refetch queries which
        // are marked as dependent on this mutation.
        Alert.alert("Hostel saved successfully");
        console.log("Data was posted successfully:", data);
      },
      onError: (error) => {
        Alert.alert("An error occured while saving hostel. Try again");
        console.error("Error posting data:", error);
      },
    });

    setSaveActive(true);
    setButtonSate("gray-300");
  };

  const paystackWebViewRef = useRef<paystackProps.PayStackRef>(null);

  const images = [
    "https://pictures-ghana.jijistatic.com/33606657_MTI4NC0xNjk1LTA5NzFjOGVmNzI.webp",
    "https://pictures-ghana.jijistatic.com/33380328_MTI4MC05NjAtYzQ5OWQ0Y2Q1ZA.webp",
    "https://pictures-ghana.jijistatic.com/33645870_MTYwMC0xMjAwLTNlNjY0YmJjNDQ.webp",
  ];
  const bookNowButtonColor = hasBooking ? "gray-300" : "primary";

  return (
    <View>
      <ScrollView>
        <Screen showSafeArea={false}>
          <View>
            <Carousel images={images} height={250} enableGestureSwipe={true} />
          </View>
          <SafeAreaView className="absolute top-0">
            <TouchableOpacity
              onPress={() => router.back()}
              className="p-2 mx-2 bg-white rounded-lg"
            >
              <Ionicons name="chevron-back" size={20} color="#908E8E" />
            </TouchableOpacity>
          </SafeAreaView>
          <View className="p-3 space-y-3">
            <View className="pb-4 mt-3 border-b border-gray-300 border-solid">
              <View className="flex flex-row items-center gap-2 mb-1">
                <AntDesign name="star" size={16} color="#EB5E55" />
                <Text className="font-semibold">{data.hostelRating}</Text>
                <Text className="text-gray-500">({data.hostelReviews})</Text>

                <Octicons name="dot-fill" size={10} color="#EB5E55" />
                <Text className="text-gray-500">Rental in Tarkwa</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-2xl font-bold capitalize">
                  {rentify(data.hostelName as string)}
                </Text>

                <TouchableOpacity
                  onPress={() => SaveHostel(data.hostelId)}
                  disabled={saveActive}
                >
                  <View className={`p-1 rounded-lg bg-${buttonsState}`}>
                    <Text className="text-base font-medium text-white">
                      <Feather name="bookmark" size={20} color="white" />
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View className="pt-2 pb-4 border-b border-gray-200 border-solid">
              <Text className="text-gray-500">{data.hostelDescription}</Text>
            </View>

            <View className="pb-4 border-b border-gray-200 border-solid">
              <Text className="text-lg font-bold">Amenities</Text>

              {(data.hostelAmenities as string)
                .split("|")
                .map((amenity: string, key: number) => (
                  <View
                    className="flex flex-row items-center gap-3 my-1"
                    key={key}
                  >
                    <View className="flex flex-row items-center justify-center w-10 h-10 rounded-md bg-neutral-200">
                      <Amenities amenity={amenity} />
                    </View>
                    <Text className="text-lg">
                      {AmenityNameFunction(amenity)}
                    </Text>
                  </View>
                ))}
            </View>

            {/* Reviews */}
            <View className="pb-4 border-b border-gray-200 border-solid">
              <Text className="mb-4 text-lg font-bold">Reviews</Text>

              <View className="flex items-center w-full py-6 border border-gray-300 border-solid rounded-xl">
                <View className="flex flex-row items-center gap-2 mb-2">
                  <AntDesign name="star" size={22} color="#EB5E55" />
                  <Text className="text-2xl font-bold ">
                    {data.hostelRating}
                  </Text>
                </View>

                <Text className="mb-5 text-gray-500">
                  Based on {data.hostelReviews} reviews
                </Text>

                <ModalSheet
                  modalButton={
                    <TouchableOpacity
                      onPress={() => {
                        toggleModal();
                      }}
                      className="flex flex-row items-center gap-1 px-3 py-2 bg-neutral-200 rounded-xl"
                    >
                      <MaterialCommunityIcons
                        name="message-reply-text"
                        size={20}
                        color="black"
                      />
                      <Text className="font-bold opacity-80">All reviews</Text>
                    </TouchableOpacity>
                  }
                  isVisible={modalVisible}
                  toggleModal={toggleModal}
                >
                  <ReviewModal
                    hostelName={data.hostelName as string}
                    setModalVisible={toggleModal}
                    reviews={reviews}
                    hostelId={data.hostelId as string}
                    accessToken={accessToken!}
                  />
                </ModalSheet>
              </View>
            </View>

            {/* Hosted by */}
            <View className="pb-4 mb-24">
              <Text className="mb-4 text-lg font-bold">Hosted by</Text>

              <View>
                <View className="flex flex-row items-center gap-3 mb-2">
                  <Image
                    className="w-14 h-14 rounded-2xl"
                    source={{
                      uri: "https://picsum.photos/200/300",
                    }}
                  />

                  <View>
                    <Text className="text-lg font-bold">{data.ownerName}</Text>
                    <Text className="text-gray-500">
                      Joined in{" "}
                      {new Date(data.ownerDateJoined as string).getFullYear()}{" "}
                    </Text>
                  </View>
                </View>

                {/* <Text className="mb-5 text-base text-gray-500">
                  The sunrise and sunset gorges. Horses and local natural
                  products. We are hsppy family. We look forward to host you.
                </Text> */}

                {data &&
                  Number(data.hostelReviews) > 0 &&
                  Number(data.hostelRating) > 0 && (
                    <View className="flex flex-row items-center gap-3 my-1">
                      <View className="flex flex-row items-center justify-center rounded-md bg-neutral-200 w-14 h-14">
                        <FontAwesome
                          name="building-o"
                          size={24}
                          color="#908E8E"
                        />
                      </View>
                      <View>
                        <Text className="text-base font-bold">
                          {data.hostelReviews} Reviews
                        </Text>
                        <Text className="text-gray-500">
                          {data.hostelRating} Overall Score
                        </Text>
                      </View>
                    </View>
                  )}

                {data.ownerVerified && (
                  <View className="flex flex-row items-center gap-3 my-1">
                    <View className="flex flex-row items-center justify-center rounded-md bg-neutral-200 w-14 h-14">
                      <MaterialCommunityIcons
                        name="shield-check"
                        size={24}
                        color="#908E8E"
                      />
                    </View>
                    <View>
                      <Text className="text-base font-bold">
                        Identity Verified
                      </Text>
                      <Text className="text-gray-500">
                        All documents verified
                      </Text>
                    </View>
                  </View>
                )}
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
          <Paystack
            paystackKey="pk_test_66644aa736f43f5c07b3b156d6d65bd20f124186"
            billingEmail={user?.email!}
            amount={data.hostelPrice as string}
            channels={["mobile_money", "bank", "card"]}
            currency="GHS"
            onCancel={(e) => {
              console.log(e);

              Alert.alert("Payment Cancelled");
            }}
            onSuccess={async (res) => {
              await makeSecuredRequest("/bookings/", {
                body: JSON.stringify({
                  listing: Number.parseInt(data.hostelId as string),
                  transaction_id: (
                    res.transactionRef as unknown as TransactionReferenceType
                  ).reference,
                }),
                method: "POST",
              });
              router.push("/PaymentSuccessPage");
            }}
            ref={paystackWebViewRef as any}
          />

          <TouchableOpacity
            disabled={hasBooking}
            onPress={() => {
              if (paystackWebViewRef.current) {
                paystackWebViewRef.current.startTransaction();
              }
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
