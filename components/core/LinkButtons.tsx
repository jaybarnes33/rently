import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const LinkButtons = ({ children }: { children: React.ReactNode }) => {
  return (
    <TouchableOpacity className="border border-gray-300 w-24 flex flex-row items-center justify-center py-3 rounded-md">
      {children}
    </TouchableOpacity>
  );
};

export default LinkButtons;
