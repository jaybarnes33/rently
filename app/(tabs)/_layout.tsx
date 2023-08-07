import { Tabs } from "expo-router";

import Icon from "@expo/vector-icons/Feather";
import TabBar from "../../components/TabBar";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof Icon>["name"];
  color: string;
  size?: number;
}) {
  return <Icon size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="Home" />
      <Tabs.Screen name="Explore" />
      <Tabs.Screen name="Chat" />
      <Tabs.Screen name="Booking" />
      <Tabs.Screen name="Settings" />
    </Tabs>
  );
}
