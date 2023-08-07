import { Text } from "react-native";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export const ModalContentWrapper = ({
  children,
  setModalVisible,
}: {
  children: React.ReactElement;
  setModalVisible: (visible: boolean) => void;
}) => {
  return (
    <View className="p-3">
      <View className="flex flex-row items-center justify-end mb-3">
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
  );
};
