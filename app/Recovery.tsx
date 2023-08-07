import { Entypo, Fontisto, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import InputFields from "../components/AuthenticationLandingScreen/InputFields";
import Button from "../components/core/Button";
import { useRouter } from "expo-router";

export default function Recovery() {
  const router = useRouter();

  const [recovery, setRecovery] = useState({
    email: "",
  });

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "position"}
        className=" relative flex flex-col h-full mt-3 px-4"
      >
        <View className="fixed flex flex-row justify-start">
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-2 bg-white mx-2 rounded-lg"
          >
            <Ionicons name="chevron-back" size={20} color="#908E8E" />
          </TouchableOpacity>
        </View>

        <View className=" relative flex flex-row justify-center items-center mt-16">
          <Image
            source={require("../assets/images/Path.png")}
            fadeDuration={500}
          />
          <View className="absolute bottom-0 flex justify-center items-center h-24 w-24 bg-[#acd2c7] rounded-full">
            <Fontisto name="locked" size={44} color="white" />
          </View>
        </View>

        <View className="text-center mt-20 mb-4">
          <Text className="text-2xl font-bold text-center mb-2">
            Lost your password?
          </Text>
          <Text className="text-sm text-gray-500 text-center">
            Enter your email to recover your password
          </Text>
        </View>

        <View className="mt-4">
          <InputFields
            type="email"
            value={recovery.email}
            onChangeText={(text) => {
              setRecovery({ ...recovery, email: text });
            }}
          >
            <Entypo name="mail" size={20} color="black" />
          </InputFields>
        </View>
        <Button
          name="Recover"
          onPress={() => {
            console.log("Recover");
            console.log(recovery);
          }}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
