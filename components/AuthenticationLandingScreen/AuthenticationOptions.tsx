import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { capitalise } from "../../utils/text";

interface LoginOptionProps {
  text: string;
  action: string; // TODO: change to function
}

const OptionSection = ({ text, action }: LoginOptionProps) => {
  const navigation = useRouter();
  return (
    <TouchableOpacity
      className="flex flex-row justify-between w-full border-b py-4 border-outlinePrimary px-[17px]"
      onPress={() => navigation.push(capitalise(action.replace(" ", "")))}
    >
      <Text className="text-sm font-bold text-gray-500">{text}</Text>
      <TouchableOpacity
        onPress={() => navigation.push(capitalise(action.replace(" ", "")))}
      >
        <Text
          className={`font-bold text-sm ${
            action === "Sign Up" ? "text-primary" : "text-secondary"
          }`}
        >
          {action}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const AuthenticationOptions = () => {
  return (
    <View className="flex items-center justify-between w-full mb-4 border-t border-outlinePrimary">
      <OptionSection text="Don't have an account" action="Sign Up" />
      <OptionSection text="Already have an account" action="Sign In" />
    </View>
  );
};

export default AuthenticationOptions;
