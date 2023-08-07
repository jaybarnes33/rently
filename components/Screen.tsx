import { View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BackButton from "./core/BackButton";

export const ScreenWithoutSafeArea = ({
  canGoback,
  children,
}: {
  children: React.ReactNode;
  canGoback?: boolean;
}) => {
  return (
    <View className="relative">
      {canGoback && (
        <View className="flex flex-row justify-between mt-2">
          <BackButton />
          <Image
            source={require("../assets/images/logo-icon.png")}
            fadeDuration={500}
            className="h-9 w-9"
          />
        </View>
      )}

      {children}
    </View>
  );
};

export default function Screen({
  children,
  canGoback,
  showSafeArea = true,
}: {
  children: React.ReactNode;
  canGoback?: boolean;
  showSafeArea?: boolean;
}) {
  return showSafeArea ? (
    <SafeAreaView className="flex-1 px-3 bg-white">
      <ScreenWithoutSafeArea canGoback={canGoback}>
        {children}
      </ScreenWithoutSafeArea>
    </SafeAreaView>
  ) : (
    <ScreenWithoutSafeArea canGoback={canGoback}>
      {children}
    </ScreenWithoutSafeArea>
  );
}
