import { View, Text } from "react-native";
import React from "react";
import { AntDesign, Feather, FontAwesome } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const avaliableAmenities = (amenity: string) => {
  switch (amenity) {
    case "wifi":
      return <AntDesign name="wifi" size={20} color="#908E8E" />;
    case "gas":
      return (
        <MaterialCommunityIcons name="gas-cylinder" size={20} color="#908E8E" />
      );
    case "study":
      return <Entypo name="book" size={20} color="#908E8E" />;
    case "water":
      return (
        <MaterialCommunityIcons name="pipe-valve" size={20} color="#908E8E" />
      );
    case "tv":
      return <FontAwesome name="tv" size={20} color="#908E8E" />;
    case "kitchen":
      return <FontAwesome name="spoon" size={20} color="#908E8E" />;
    case "electricity":
      return <Feather name="cloud-lightning" size={24} color="#908E8E" />;
    default:
      return <View></View>;
  }
};

const Amenities = ({ amenity }: { amenity: string }) => {
  return <View>{avaliableAmenities(amenity)}</View>;
};

export default Amenities;
