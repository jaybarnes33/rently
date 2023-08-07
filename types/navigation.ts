import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { StackScreenProps } from "@react-navigation/stack";

export type StackParamList = {
  Home: undefined;
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
};

export type TabParamList = {
  Home: undefined;
  Profile: undefined;
  Settings: undefined;
  Bookings: undefined;
};

export type ScreenNavProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "Profile">,
  StackScreenProps<StackParamList>
>;
