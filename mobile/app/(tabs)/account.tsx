import { View, Text, SafeAreaView } from 'react-native';

export default function AccountScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center">
      <Text className="text-xl font-bold">Account Settings</Text>
      <Text className="text-gray-500 mt-2">Manage your profile and payment methods</Text>
    </SafeAreaView>
  );
}
