import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "@expo/vector-icons/FontAwesome";
import { useRouter } from "expo-router";

const BackButton = ({ absolute }: { absolute?: boolean }) => {
  const navigation = useRouter();

  return (
    <TouchableOpacity
      onPress={() => navigation.back()}
      className={`my-3 ${absolute && "absolute -top-5  z-[999]"} `}
    >
      <Text>
        <Icon name="chevron-left" size={15} color="#1a1a1a" />
      </Text>
    </TouchableOpacity>
  );
};

export default BackButton;
