import { View, Text, Touchable, TouchableOpacity } from "react-native";
import React from "react";

const Button = ({ name, onPress }: { name: String; onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-primary min-w-[130px] py-3 justify-center items-center my-3 rounded-md"
    >
      <Text className="text-white font-extrabold">{name}</Text>
    </TouchableOpacity>
  );
};

export default Button;
