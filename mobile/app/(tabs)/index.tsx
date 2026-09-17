import { View, Text, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Search, Clock, MapPin, Home as HomeIcon, Briefcase } from 'lucide-react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        {/* Header Tabs (Rides / Delivery) */}
        <View className="flex-row mt-4 mb-6 border-b border-gray-100">
          <View className="pb-2 border-b-2 border-black mr-6">
            <Text className="text-xl font-bold">🚗 Rides</Text>
          </View>
          <View className="pb-2 mr-6">
            <Text className="text-xl font-bold text-gray-400">🥗 Delivery</Text>
          </View>
        </View>

        {/* Search Bar */}
        <Link href="/search" asChild>
          <TouchableOpacity className="flex-row items-center bg-gray-100 rounded-full p-4 mb-6">
            <Search size={20} color="#000" className="mr-3" />
            <Text className="flex-1 text-lg font-semibold text-gray-800">Where to?</Text>
            <View className="flex-row items-center bg-white px-3 py-1.5 rounded-full shadow-sm">
              <Clock size={16} color="#000" className="mr-1" />
              <Text className="font-semibold text-sm">Now</Text>
            </View>
          </TouchableOpacity>
        </Link>

        {/* Recent Locations */}
        <View className="mb-6">
          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
            <View className="bg-gray-200 p-2 rounded-full mr-4">
              <Briefcase size={20} color="#000" />
            </View>
            <View>
              <Text className="text-lg font-bold">Work</Text>
              <Text className="text-gray-500">1455 Market St</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row items-center py-3">
            <View className="bg-gray-200 p-2 rounded-full mr-4">
              <HomeIcon size={20} color="#000" />
            </View>
            <View>
              <Text className="text-lg font-bold">Home</Text>
              <Text className="text-gray-500">903 Sunrose Terr</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Suggestions */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Suggestions</Text>
            <Text className="text-gray-500 font-semibold">See all</Text>
          </View>
          
          <View className="flex-row justify-between">
            {/* Suggestion Card */}
            <View className="items-center bg-gray-100 p-4 rounded-xl flex-1 mr-2">
              <Text className="text-3xl mb-2">🚗</Text>
              <Text className="font-semibold text-sm">Ride</Text>
            </View>
            <View className="items-center bg-gray-100 p-4 rounded-xl flex-1 mx-1">
              <Text className="text-3xl mb-2">📦</Text>
              <Text className="font-semibold text-sm">Package</Text>
            </View>
            <View className="items-center bg-gray-100 p-4 rounded-xl flex-1 mx-1">
              <Text className="text-3xl mb-2">📅</Text>
              <Text className="font-semibold text-sm">Reserve</Text>
            </View>
            <View className="items-center bg-gray-100 p-4 rounded-xl flex-1 ml-2">
              <Text className="text-3xl mb-2">🔑</Text>
              <Text className="font-semibold text-sm">Rent</Text>
            </View>
          </View>
        </View>

        {/* Ways to plan */}
        <View className="mb-4">
          <Text className="text-xl font-bold mb-4">Ways to plan with Uber</Text>
          <View className="flex-row justify-between">
            <View className="bg-green-100 rounded-xl p-4 flex-1 mr-2 h-40">
              <Text className="font-bold mt-auto">Reserve a ride →</Text>
            </View>
            <View className="bg-orange-100 rounded-xl p-4 flex-1 ml-2 h-40">
              <Text className="font-bold mt-auto">Explore locally →</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
