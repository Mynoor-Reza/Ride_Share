import { View, Text, SafeAreaView } from 'react-native';

export default function ActivityScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white justify-center items-center">
      <Text className="text-xl font-bold">Activity Log</Text>
      <Text className="text-gray-500 mt-2">Past rides and deliveries will appear here</Text>
    </SafeAreaView>
  );
}
