import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import Screen from "../../components/Screen";
import { useRouter } from "expo-router";

const Chat = () => {
  const [hasMessages, setHasMessages] = useState(false);
  const router = useRouter();

  return (
    <Screen>
      <Text className="text-xl text-center font-semibold my-2">Messages</Text>

      {!hasMessages && (
        <View className="flex h-full items-center justify-center -mb-20">
          <Image
            source={require("../../assets/images/booking.png")}
            fadeDuration={500}
            className="my-4"
          />

          <Text className="font-bold text-2xl text-center mt-4">
            No messages found?
          </Text>
          <Text className="text-gray-500 text-center my-3 text-base">
            Explore more than 100+ rentalsand available apartments and book
            stays
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
      )}
    </Screen>
  );
};

export default Chat;
