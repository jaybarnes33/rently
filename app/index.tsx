import React, { useContext } from "react";
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import AuthenticationOptions from "../components/AuthenticationLandingScreen/AuthenticationOptions";
import Screen from "../components/Screen";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthProvider";

export default function AuthenticationPage() {
  const authContext = useContext(AuthContext)!;
  const router = useRouter();

  if (authContext && authContext.hasToken && authContext.hasRefreshToken) {
    router.push("Home");

    return (
      <SafeAreaView className="h-full flex text-center flex-col justify-center items-center">
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (authContext && !authContext.hasToken && !authContext.hasRefreshToken) {
    return (
      <Screen>
        <View className="flex flex-col justify-between h-full">
          <View className="flex flex-col items-center justify-center flex-grow">
            <Image
              source={require("../assets/images/logo-icon.png")}
              fadeDuration={500}
            />
            <View className="text-center mt-5">
              <Text className="text-3xl font-bold text-center capitalize">
                Welcome to rently
              </Text>
            </View>
          </View>
          <View>
            <AuthenticationOptions />
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <SafeAreaView className="h-full flex text-center flex-col justify-center items-center">
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
}
