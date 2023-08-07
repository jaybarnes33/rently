import React, { useContext, useState } from "react";
import {
  Modal,
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthProvider";
import { useRouter } from "expo-router";
import { createURL } from "../../utils/apiUtils";

const Settings = () => {
  const { logout, user } = useContext(AuthContext)!;
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const [modalType, setModalType] = useState<
    "account" | "billing" | "global" | "login"
  >("account");

  return (
    <SafeAreaView className="bg-white">
      <View className="h-full">
        <Modal
          animationType="slide"
          visible={modalVisible}
          presentationStyle="pageSheet"
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <ModalContent
            setModalVisible={setModalVisible}
            modalType={modalType}
          />
        </Modal>

        <View>
          <View className="mt-10 flex flex-col items-center space-y-4">
            {/* <Image
              className="w-28 h-28 rounded-2xl"
              source={{
                uri: "https://picsum.photos/200/300",
              }}
            /> */}
            <Text className="text-2xl font-semibold">
              {user
                ? `${user.first_name} ${user.last_name}`
                : "Profile Settings"}
            </Text>
          </View>

          <View className="mt-5">
            <Text className="text-gray-500 text-base my-4 px-8">Settings</Text>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
                setModalType("account");
              }}
              className="flex flex-row items-center space-x-10 px-8 py-5 border-y border-gray-300 "
            >
              <FontAwesome5 name="user" size={24} color="black" />
              <Text className="text-base font-medium">Account Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
                setModalType("login");
              }}
              className="flex flex-row items-center space-x-10 px-8 py-5 border-b border-gray-300 "
            >
              <Feather name="shield" size={24} color="black" />
              <Text className="text-base font-medium">Login details</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
                setModalType("billing");
              }}
              className="flex flex-row items-center space-x-10 px-8 py-5 border-b border-gray-300 "
            >
              <MaterialIcons name="payment" size={24} color="black" />
              <Text className="text-base font-medium">Billings</Text>
            </TouchableOpacity> */}
            {/* <TouchableOpacity
              onPress={() => {
                setModalVisible(true);
                setModalType("global");
              }}
              className="flex flex-row items-center space-x-10 px-8 py-5 border-b border-gray-300 "
            >
              <AntDesign name="setting" size={24} color="black" />
              <Text className="text-base font-medium">Global Preferences</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => {
                logout();
                router.push("Signin");
              }}
              className="flex flex-row items-center space-x-10 px-8 py-5 border-b border-gray-300 "
            >
              <Feather name="log-out" size={24} color="black" />
              <Text className="text-base font-medium">Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const ModalContentWrapper = ({
  children,
  setModalVisible,
}: {
  children: React.ReactElement;
  setModalVisible: (visible: boolean) => void;
}) => {
  const { user } = useContext(AuthContext)!;

  return (
    <View className="p-3 flex flex-col h-full justify-between">
      <View>
        <View className="flex flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}
            className="p-2 bg-gray-200 rounded-lg"
          >
            <Ionicons name="chevron-back" size={20} color="#908E8E" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
            }}
            className="p-2 px-3 bg-gray-200 rounded-lg"
          >
            <Text className="text-base font-semibold">Cancel</Text>
          </TouchableOpacity>
        </View>

        {children}
      </View>

      {/* <TouchableOpacity className="px-5 py-2 mb-5 rounded-lg bg-primary">
        <Text className="text-center text-lg font-semibold text-white">
          Update Settings
        </Text>
      </TouchableOpacity> */}
    </View>
  );
};

const ModalContent = ({
  setModalVisible,
  modalType,
}: {
  setModalVisible: (visible: boolean) => void;
  modalType: "account" | "billing" | "global" | "login";
}) => {
  const { user, accessToken, logout } = useContext(AuthContext)!;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);

    if (newPassword !== confirmPassword) {
      Alert.alert("New passwords do not match!");
      return;
    }

    const url = createURL("/auth/users/set_password/");
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", `Bearer ${accessToken}`);

    let data = {
      current_password: currentPassword,
      new_password: newPassword,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorData = await response.json();

        if (errorData["current_password"]) {
          Alert.alert(errorData["current_password"][0]);
        }

        if (errorData["new_password"]) {
          Alert.alert(errorData["new_password"][0]);
        }

        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      setIsLoading(false);

      if (response.ok) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        Alert.alert("Password Changed Successfully", "", [
          {
            onPress: () => {
              router.push("Signin");
              logout();
              setModalVisible(false);
              console.log("OK Pressed");
            },
          },
        ]);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error:", error);
    }
  };

  if (modalType === "account") {
    return (
      <ModalContentWrapper setModalVisible={setModalVisible}>
        <>
          <Text className="font-bold text-2xl mt-6">Account Information</Text>
          <Text className="text-gray-500">Name and Details</Text>

          <View className="mt-5">
            <View className="flex flex-col justify-between py-3 px-2 border-b border-gray-300 gap-y-1">
              <Text className="text-base font-medium">Name</Text>
              <View className="flex flex-row items-center justify-between gap-2">
                <Text className="text-gray-500 text-lg">
                  {user ? `${user.first_name} ${user.last_name}` : "Full name"}
                </Text>
                {/* <TouchableOpacity
                  onPress={() => {
                    console.log("Edit Name");
                  }}
                >
                  <Feather name="edit-3" size={16} color="gray" />
                </TouchableOpacity> */}
              </View>
            </View>

            {/* <View className="flex flex-col justify-between py-3 px-2 border-b border-gray-300 gap-y-1">
              <Text className="text-base font-medium">Gender</Text>
              <View className="flex flex-row items-center justify-between gap-2">
                <Text className="text-gray-500 text-lg">Male</Text>
                <TouchableOpacity
                  onPress={() => {
                    console.log("Edit Gender");
                  }}
                >
                  <Feather name="edit-3" size={16} color="gray" />
                </TouchableOpacity>
              </View>
            </View> */}

            <View className="flex flex-col justify-between py-3 px-2 border-b border-gray-300 gap-y-1">
              <Text className="text-base font-medium">Email</Text>
              <View className="flex flex-row items-center justify-between gap-2">
                <Text className="text-gray-500 text-base">{user?.email}</Text>
              </View>
            </View>
            {/* 
            <View className="flex flex-col justify-between py-3 px-2 border-b border-gray-300 gap-y-1">
              <Text className="text-base font-medium">Phone Number</Text>
              <View className="flex flex-row items-center justify-between">
                <Text className="text-gray-500 text-lg">0548132971</Text>
                <TouchableOpacity
                  onPress={() => {
                    console.log("Edit Phone Number");
                  }}
                >
                  <Feather name="edit-3" size={16} color="gray" />
                </TouchableOpacity>
              </View>
            </View> */}
          </View>
        </>
      </ModalContentWrapper>
    );
  }

  if (modalType === "login") {
    return (
      <ModalContentWrapper setModalVisible={setModalVisible}>
        <View className="flex flex-col justify-between h-[95%]">
          <View>
            <Text className="font-bold text-2xl mt-6">Login Details</Text>
            <Text className="text-gray-500">Change Password</Text>

            <View className="mt-5 border border-gray-300 rounded-xl w-full flex flex-row justify-between items-center p-3">
              <TextInput
                secureTextEntry={true}
                autoCapitalize="none"
                className="w-[90%]"
                placeholder="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
            </View>
            <View className="mt-5 border border-gray-300 rounded-xl w-full flex flex-row justify-between items-center p-3">
              <TextInput
                secureTextEntry={true}
                autoCapitalize="none"
                className="w-[90%]"
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>
            <View className="mt-5 border border-gray-300 rounded-xl w-full flex flex-row justify-between items-center p-3">
              <TextInput
                secureTextEntry={true}
                autoCapitalize="none"
                className="w-[90%]"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            className="px-5 py-3 rounded-lg bg-primary mb-10"
          >
            {!isLoading ? (
              <Text className="text-center text-lg font-semibold text-white">
                Update Password
              </Text>
            ) : (
              <ActivityIndicator size="small" color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </ModalContentWrapper>
    );
  }

  // if (modalType === "billing") {
  //   return (
  //     <View>
  //       <Text>Billing</Text>
  //     </View>
  //   );
  // }

  // if (modalType === "global") {
  //   return (
  //     <View>
  //       <Text>Global</Text>
  //     </View>
  //   );
  // }

  return (
    // <View className="bg-white h-full flex items-center justify-center">
    //   <Text className="text-2xl my-4">Hello World!</Text>
    //   <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
    //     <Text className="font-bold">Hide Modal</Text>
    //   </TouchableOpacity>
    // </View>
    <></>
  );
};

export default Settings;
