import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import Button from "../components/core/Button";

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "position"}
        className="relative flex flex-col h-full px-4 mt-3 "
      >
        <View className="fixed flex flex-row justify-start">
          <TouchableOpacity
            onPress={() => router.back()}
            className={`p-2 mx-2 bg-white rounded-lg ${
              Platform.OS === "ios" ? "mt-10" : "mt-10"
            }`}
          >
            <Ionicons name="chevron-back" size={20} color="#908E8E" />
          </TouchableOpacity>
        </View>

        <View className="relative flex flex-row items-center justify-center mt-16 ">
          <Image source={require("../assets/images/success.png")} />
        </View>

        <View className="mt-20 mb-4 text-center">
          <Text className="mb-2 text-2xl font-bold text-center">
            Thank You!
          </Text>
          <Text className="text-sm text-center text-gray-500">
            We have sent an email to kelvinamoaba@gmail.com Check confirmation
            email for payment receipt
          </Text>
        </View>

        <Button
          name="See your Booking"
          onPress={() => {
            router.push({
              pathname: "Booking",
              params: {
                paid: true,
              },
            });
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
