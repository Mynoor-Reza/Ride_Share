import { View, Text, SafeAreaView, TextInput, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { ArrowLeft, MapPin, X, Search as SearchIcon } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';

const mockDestinations = [
  { id: '1', name: 'San Francisco International Airport', address: 'San Francisco, CA', latitude: 37.6213, longitude: -122.3790, icon: '✈️' },
  { id: '2', name: 'Downtown San Francisco', address: 'Financial District, SF', latitude: 37.7946, longitude: -122.3999, icon: '🏙️' },
  { id: '3', name: 'Oakland International Airport', address: 'Oakland, CA', latitude: 37.7126, longitude: -122.2197, icon: '✈️' },
  { id: '4', name: 'Fisherman\'s Wharf', address: 'San Francisco, CA', latitude: 37.8080, longitude: -122.4177, icon: '🎣' },
  { id: '5', name: 'Golden Gate Park', address: 'San Francisco, CA', latitude: 37.7694, longitude: -122.4862, icon: '🌲' },
  { id: '6', name: 'Mission District', address: 'San Francisco, CA', latitude: 37.7599, longitude: -122.4148, icon: '🎨' },
  { id: '7', name: 'Union Square', address: 'San Francisco, CA', latitude: 37.7880, longitude: -122.4074, icon: '🛍️' },
  { id: '8', name: 'AT&T Park', address: 'San Francisco, CA', latitude: 37.7786, longitude: -122.3893, icon: '⚾' },
];

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [filteredDestinations, setFilteredDestinations] = useState<typeof mockDestinations>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (searchText.trim()) {
      const filtered = mockDestinations.filter(
        (dest) =>
          dest.name.toLowerCase().includes(searchText.toLowerCase()) ||
          dest.address.toLowerCase().includes(searchText.toLowerCase())
      );
      setFilteredDestinations(filtered);
      setShowResults(true);
    } else {
      setFilteredDestinations(mockDestinations);
      setShowResults(true);
    }
  }, [searchText]);

  const handleSelectDestination = (destination: typeof mockDestinations[0]) => {
    router.push({
      pathname: '/map',
      params: {
        destinationLat: destination.latitude.toString(),
        destinationLng: destination.longitude.toString(),
        destinationName: destination.name,
        destinationAddress: destination.address,
      },
    });
    Keyboard.dismiss();
  };

  const handleClearSearch = () => {
    setSearchText('');
    setFilteredDestinations(mockDestinations);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Plan your ride</Text>
      </View>

      {/* Input Area */}
      <View className="px-4 py-2 relative">
        {/* Connection Line */}
        <View className="absolute left-8 top-10 bottom-10 w-0.5 bg-gray-300" />

        {/* Current Location */}
        <View className="flex-row items-center mb-4 z-10">
          <View className="w-8 items-center justify-center">
            <View className="w-2 h-2 rounded-full bg-gray-400" />
          </View>
          <TextInput
            className="flex-1 bg-gray-100 p-3 rounded-lg ml-2 font-semibold text-gray-800"
            placeholder="Current Location"
            value="Current Location"
            editable={false}
          />
        </View>

        {/* Destination Search */}
        <View className="flex-row items-center z-10">
          <View className="w-8 items-center justify-center">
            <View className="w-2 h-2 bg-black" />
          </View>
          <View className="flex-1 relative ml-2">
            <View className="absolute left-3 top-1/2 -translate-y-1/2">
              <SearchIcon size={20} color="#888" />
            </View>
            <TextInput
              className="bg-gray-200 p-3 rounded-lg pl-10 font-semibold text-black"
              placeholder="Where to?"
              placeholderTextColor="#888"
              autoFocus
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText && (
              <TouchableOpacity
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onPress={handleClearSearch}
              >
                <X size={20} color="#888" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Search Results */}
      <View className="flex-1 mt-4 p-4 border-t border-gray-100">
        {showResults && (
          <FlatList
            data={filteredDestinations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="flex-row items-center py-3"
                onPress={() => handleSelectDestination(item)}
              >
                <View className="bg-gray-100 p-2 rounded-full mr-4">
                  <Text style={{ fontSize: 20 }}>{item.icon}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold">{item.name}</Text>
                  <Text className="text-gray-500 text-sm">{item.address}</Text>
                </View>
                <MapPin size={20} color="#888" />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <View className="py-12 items-center">
                <Text className="text-gray-500">No results found</Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}