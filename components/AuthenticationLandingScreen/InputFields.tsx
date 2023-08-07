import React from "react";
import { TextInput, View } from "react-native";

type InputFieldProps = {
  children: React.ReactElement;
  type: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

const InputFields = ({
  children,
  type,
  value,
  onChangeText,
  placeholder,
}: InputFieldProps) => {
  return (
    <View className="mb-4">
      {type === "email" ? (
        <View className="flex flex-row items-center justify-between w-full p-3 border border-gray-300 rounded-xl">
          <TextInput
            autoCapitalize="none"
            className="w-[90%] font-bold"
            placeholder={placeholder ? placeholder : "Email"}
            keyboardType="email-address"
            value={value}
            onChangeText={onChangeText}
          />
          {children}
        </View>
      ) : (
        <View className="flex flex-row items-center justify-between w-full p-3 border border-gray-300 rounded-xl">
          <TextInput
            className="w-[90%] font-bold"
            placeholder={placeholder ? placeholder : "Password"}
            secureTextEntry={type === "password" ? true : false}
            value={value}
            onChangeText={onChangeText}
          />
          {children}
        </View>
      )}
    </View>
  );
};

export default InputFields;
