import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useContext, useState } from "react";
import {
  Alert,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import InputFields from "../components/AuthenticationLandingScreen/InputFields";
import Screen from "../components/Screen";
import Button from "../components/core/Button";
import { createURL } from "../utils/apiUtils";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../context/AuthProvider";

const validateEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const Login = () => {
  const [auth, setAuth] = useState({
    email: "",
    password: "",
  });
  const [isInvalidEmail, setIsInvalidEmail] = useState(false); // State to track email validity
  const [isLoading, setIsLoading] = useState(false);
  const authContext = useContext(AuthContext)!;

  const navigation = useRouter();

  const handleLogin = async () => {
    if (auth.email === "" || auth.password === "") {
      return;
    }

    if (!validateEmail(auth.email)) {
      setIsInvalidEmail(true);
      return;
    } else {
      setIsInvalidEmail(false);
    }

    setIsLoading(true);

    const response = await fetch(createURL("/auth/jwt/create/"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(auth),
    });

    const data = await response.json();

    console.log("User Booking", data.booking);

    if (response.status !== 200) {
      setIsLoading(false);
      Alert.alert("Error", "Your email or password is incorrect.");
      return;
    }

    const user = data.user;

    if (data.booking) {
      authContext.setHasBooking(true);
      await SecureStore.setItemAsync("hasBooking", "true");
    } else {
      authContext.setHasBooking(false);
      await SecureStore.setItemAsync("hasBooking", "false");
    }
    // Use the login method from context

    if (user) {
      await authContext.login(data.access, data.refresh, data.user);
    } else {
      console.error("No user data in response");
    }

    // console.log("Login");
    navigation.push("Home");

    // console.log(auth);

    setIsLoading(false);
  };

  return (
    <Screen>
      {isLoading ? (
        <SafeAreaView className="h-full flex text-center flex-col justify-center items-center">
          <ActivityIndicator size="large" />
        </SafeAreaView>
      ) : (
        <View className="flex flex-col h-full">
          <View className="mt-40 mb-16 text-center">
            <Text className="mb-2 text-3xl font-bold text-center">
              Welcome to rently
            </Text>
            <Text className="text-base text-center text-gray-500">
              Enter your details to login
            </Text>
          </View>

          <InputFields
            type="email"
            value={auth.email}
            onChangeText={(text) => {
              setIsInvalidEmail(false);
              setAuth({ ...auth, email: text });
            }}
          >
            <Entypo name="mail" size={20} color="gray" />
          </InputFields>
          {isInvalidEmail && (
            <Text className="mb-4 -mt-3 text-xs font-medium text-red-600">
              Please enter a valid email address.
            </Text>
          )}

          <InputFields
            type="password"
            value={auth.password}
            onChangeText={(text) => {
              setAuth({ ...auth, password: text });
            }}
          >
            <MaterialIcons name="lock" size={20} color="gray" />
          </InputFields>

          <View className="flex flex-row items-center justify-end mb-6">
            <View>
              <TouchableOpacity
                onPress={() => {
                  navigation.push("Recovery");
                }}
              >
                <Text className="font-bold text-red-500">Forgot Password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="my-2">
            <Button name="Sign In" onPress={handleLogin} />
          </View>

          <View className="flex flex-row items-center justify-between mb-5">
            <View className="border-b border-gray-300 -h-1 w-[40%]" />
            <Text className="mx-5 text-gray-500">OR</Text>
            <View className="border-b border-gray-300 -h-1 w-[40%]" />
          </View>

          <View className="flex flex-col gap-y-2">
            <TouchableOpacity className="flex flex-row items-center justify-center w-full py-3 border border-gray-300 rounded-md">
              <AntDesign name="google" size={20} color="gray" />
              <Text className="ml-2 font-semibold text-gray-700">
                Sign in with Student Email
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.push("Signup")}
              className="flex flex-row items-center justify-center w-full py-3 border border-gray-300 rounded-md"
            >
              <Ionicons name="person" size={20} color="gray" />
              <Text className="ml-2 font-semibold text-gray-700">
                Create a new account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </Screen>
  );
};

export default Login;
