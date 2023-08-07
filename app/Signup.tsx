import { Checkbox } from "expo-checkbox";
import React, { useContext, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { AntDesign, Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import InputFields from "../components/AuthenticationLandingScreen/InputFields";
import Screen from "../components/Screen";
import Button from "../components/core/Button";
import { fetcher } from "../utils/fetch";
import { AuthContext } from "../context/AuthProvider";
import { Alert } from "react-native";

const validateEmail = (email: string) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const Signup = () => {
  const [auth, setAuth] = useState({
    email: "",
    firstName: "",
    lastName: "",
    initialPassword: "",
    passwordConfirmation: "",
  });
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isSelected, setSelection] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const authContext = useContext(AuthContext)!;
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useRouter();

  const handleUserSignup = async () => {
    console.log("Signup");
    setIsLoading(true);

    if (
      auth.email === "" ||
      auth.initialPassword === "" ||
      auth.passwordConfirmation === "" ||
      auth.firstName === "" ||
      auth.lastName === ""
    ) {
      return Alert.alert("Please fill in all the fields");
    }

    if (!validateEmail(auth.email)) {
      setIsInvalidEmail(true);
      return;
    } else {
      setIsInvalidEmail(false);
    }

    if (auth.initialPassword !== auth.passwordConfirmation) {
      setAuth({
        email: auth.email,
        firstName: "",
        lastName: "",
        initialPassword: "",
        passwordConfirmation: "",
      });
      return Alert.alert("Passwords do not match");
    }

    const newUser = await fetcher(
      "/auth/users/",
      null,
      {
        email: auth.email,
        password: auth.initialPassword,
        first_name: auth.firstName,
        last_name: auth.lastName,
        role: "client",
      },
      (error) => {
        Object.entries(error).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            value.forEach((v: string) => {
              Alert.alert(v, "", [
                {
                  onPress() {
                    setIsLoading(false);
                    setAuth({
                      email: auth.email,
                      firstName: "",
                      lastName: "",
                      initialPassword: "",
                      passwordConfirmation: "",
                    });
                  },
                },
              ]);
            });
          } else {
            Alert.alert(value as string, "", [
              {
                onPress() {
                  setIsLoading(false);
                  setAuth({
                    email: auth.email,
                    firstName: "",
                    lastName: "",
                    initialPassword: "",
                    passwordConfirmation: "",
                  });
                },
              },
            ]);
          }
        });

        setIsLoading(false);
        setAuth({
          email: auth.email,
          firstName: "",
          lastName: "",
          initialPassword: "",
          passwordConfirmation: "",
        });
      }
    );

    const signedInUser =
      newUser &&
      (await fetcher(
        "/auth/jwt/create/",
        null,
        {
          email: auth.email,
          password: auth.initialPassword,
        },
        (error) => {
          Object.entries(error).forEach(([key, value]) => {
            if (Array.isArray(value)) {
              value.forEach((v: string) => {
                Alert.alert(v, "", [
                  {
                    onPress() {
                      setIsLoading(false);
                      setAuth({
                        email: auth.email,
                        firstName: "",
                        lastName: "",
                        initialPassword: "",
                        passwordConfirmation: "",
                      });
                    },
                  },
                ]);
              });
            } else {
              Alert.alert(value as string, "", [
                {
                  onPress() {
                    setIsLoading(false);
                    setAuth({
                      email: auth.email,
                      firstName: "",
                      lastName: "",
                      initialPassword: "",
                      passwordConfirmation: "",
                    });
                  },
                },
              ]);
            }
          });

          setAuth({
            email: auth.email,
            firstName: "",
            lastName: "",
            initialPassword: "",
            passwordConfirmation: "",
          });

          setIsLoading(false);
        }
      ));

    const user = signedInUser.user;

    if (user) {
      await authContext.login(signedInUser.access, signedInUser.refresh, user);
    } else {
      console.error("No user data in response");
    }

    console.log("Sign Up and Login");

    setAuth({
      email: "",
      firstName: "",
      lastName: "",
      initialPassword: "",
      passwordConfirmation: "",
    });
    setModalOpen(false);
    navigation.push("/Home");
    setIsLoading(false);
  };

  const handleModalOpen = () => {
    if (auth.email === "") {
      Alert.alert("Please enter your email address");
      setIsLoading(false);
      return;
    }

    setModalOpen(true);
  };

  return (
    <Screen>
      <View className="flex flex-col h-full mx-1">
        <View className="mt-40 text-center mb-28">
          <Text className="mb-2 text-3xl font-bold text-center capitalize">
            Welcome to rently
          </Text>
          <Text className="text-base text-center text-gray-500">
            Enter your details to proceed further
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

        <View className="flex flex-row gap-2">
          <Checkbox
            className="mb-2"
            value={isSelected}
            onValueChange={setSelection}
            color="#eb5d55"
          />
          <Text className="text-gray-500">
            I agree to the terms and conditions
          </Text>
        </View>

        <View className="my-2">
          <Button name="Sign Up" onPress={handleModalOpen} />
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
            onPress={() => navigation.push("/Signin")}
            className="flex flex-row items-center justify-center w-full py-3 border border-gray-300 rounded-md"
          >
            <Ionicons name="arrow-back-sharp" size={20} color="gray" />
            <Text className="ml-2 font-semibold text-gray-700">
              Back to Sign In
            </Text>
          </TouchableOpacity>
        </View>

        {modalOpen && (
          <Modal
            animationType="slide"
            visible={modalOpen}
            presentationStyle="pageSheet"
            onRequestClose={() => {
              setModalOpen(!modalOpen);
            }}
          >
            <View>
              <View className="flex flex-col h-full px-3 pt-3 bg-white">
                <View className="flex flex-row justify-end">
                  <TouchableOpacity
                    onPress={() => {
                      setModalOpen(!modalOpen);
                    }}
                    className="p-2 px-3 bg-gray-200 rounded-lg"
                  >
                    <Text className="text-base font-semibold text-gray-500">
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
                {/* Tell us more section */}
                <View className="flex flex-col items-center mt-[69px]">
                  <Text className="mb-2 text-xl font-bold">
                    Tell us more about yourself
                  </Text>
                  <Text className="text-base text-gray-500">
                    Enter your details to proceed further
                  </Text>
                </View>

                {/* Input fields section */}
                <View className="flex flex-col mt-10">
                  <View className="flex flex-row items-center justify-between w-full p-3 mb-3 border border-gray-300 rounded-xl">
                    <TextInput
                      autoCapitalize="none"
                      className="w-[90%] font-bold"
                      placeholder="First Name"
                      keyboardType="email-address"
                      value={auth.firstName}
                      onChangeText={(text) => {
                        setAuth({ ...auth, firstName: text });
                      }}
                    />
                    <AntDesign name="user" size={20} color="black" />
                  </View>
                  <View className="flex flex-row items-center justify-between w-full p-3 mb-3 border border-gray-300 rounded-xl">
                    <TextInput
                      autoCapitalize="none"
                      className="w-[90%] font-bold"
                      placeholder="Last Name"
                      keyboardType="default"
                      value={auth.lastName}
                      onChangeText={(text) => {
                        setAuth({ ...auth, lastName: text });
                      }}
                    />
                    <AntDesign name="user" size={20} color="black" />
                  </View>
                  <InputFields
                    type="password"
                    value={auth.initialPassword}
                    onChangeText={(text) => {
                      setAuth({ ...auth, initialPassword: text });
                    }}
                  >
                    <MaterialIcons name="lock" size={20} color="gray" />
                  </InputFields>
                  <InputFields
                    type="password"
                    value={auth.passwordConfirmation}
                    placeholder="Confirm Password"
                    onChangeText={(text) => {
                      setAuth({ ...auth, passwordConfirmation: text });
                    }}
                  >
                    <MaterialIcons name="lock" size={20} color="gray" />
                  </InputFields>
                  <View className="px-2 mt-4 text-center">
                    <Text className="text-gray-500 ">
                      By clicking Sign Up, you agree to our{" "}
                      <Text className="text-blue-500">Terms of Use</Text> and{" "}
                      <Text className="text-blue-500">Privacy Policy</Text>
                    </Text>
                  </View>

                  <View className="my-4">
                    <TouchableOpacity
                      disabled={isLoading}
                      onPress={() => {
                        handleUserSignup();
                      }}
                      className="bg-primary min-w-[130px] py-3 justify-center items-center my-3 rounded-md"
                    >
                      {!isLoading ? (
                        <Text className="text-center text-lg font-semibold text-white">
                          Sign Up
                        </Text>
                      ) : (
                        <ActivityIndicator size="small" color="#fff" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    </Screen>
  );
};

export default Signup;
