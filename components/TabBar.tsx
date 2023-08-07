import { View, TouchableOpacity } from "react-native";
import React from "react";

import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import Icon from "@expo/vector-icons/Ionicons";
import Colors from "../constants/Colors";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const icons: Record<string, any> = {
    home: "home",
    settings: "person",
    explore: "compass",
    chat: "chatbubble",
    booking: "calendar",
  };

  return (
    <View className="flex flex-row bg-white rounded-full mx-4 bottom-7 h-16 items-center shadow-md">
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          navigation.navigate(route.name);
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.name}
            accessibilityRole="button"
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={{ flex: 1, alignItems: "center" }}
          >
            <Icon
              name={
                isFocused
                  ? icons[route.name.toLowerCase()]
                  : icons[route.name.toLowerCase()] + "-outline"
              }
              size={24}
              color={isFocused ? Colors.light.primary : Colors.light.secondary}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;
