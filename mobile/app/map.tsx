import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Platform, ScrollView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { ArrowLeft, Car, Bike, Truck, MapPin, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';

const { width, height } = Dimensions.get('window');

// Mock data for nearby cars/riders
const mockCars = [
  { id: '1', latitude: 37.785834, longitude: -122.406417 },
  { id: '2', latitude: 37.787834, longitude: -122.409417 },
  { id: '3', latitude: 37.782834, longitude: -122.401417 },
  { id: '4', latitude: 37.789834, longitude: -122.403417 },
];

// Mock pickup location (current user location)
const MOCK_PICKUP = {
  latitude: 37.78825,
  longitude: -122.4074,
  name: 'Current Location',
  address: 'Market St, San Francisco, CA',
};

// Ride options
const rideOptions = [
  {
    id: 'uberx',
    name: 'UberX',
    icon: '🚗',
    eta: '~4 min',
    price: '$12',
    color: '#000000',
    description: 'Affordable everyday rides',
    seats: '4 seats',
  },
  {
    id: 'moto',
    name: 'Moto',
    icon: '🏍️',
    eta: '~2 min',
    price: '$5',
    color: '#00C853',
    description: 'Quick solo rides on motorcycle',
    seats: '1 seat',
  },
  {
    id: 'uberxl',
    name: 'UberXL',
    icon: '🚐',
    eta: '~7 min',
    price: '$18',
    color: '#6B46C1',
    description: 'Affordable rides for groups up to 6',
    seats: '6 seats',
  },
];

// Simulated route polyline (simplified - in real app this would come from Directions API)
const generateRoutePolyline = (origin: { latitude: number; longitude: number }, destination: { latitude: number; longitude: number }) => {
  // Create a simple curved path between origin and destination
  const points = [];
  const steps = 20;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Add some curve to make it look more like a real route
    const lat = origin.latitude + (destination.latitude - origin.latitude) * t + Math.sin(t * Math.PI) * 0.002;
    const lng = origin.longitude + (destination.longitude - origin.longitude) * t + Math.cos(t * Math.PI) * 0.001;
    points.push({ latitude: lat, longitude: lng });
  }
  return points;
};

export default function MapScreen() {
  const params = useLocalSearchParams();
  const [region, setRegion] = useState({
    latitude: MOCK_PICKUP.latitude,
    longitude: MOCK_PICKUP.longitude,
    latitudeDelta: 0.04,
    longitudeDelta: 0.04,
  });
  const [selectedRide, setSelectedRide] = useState<string | null>('uberx');
  const [showRideOptions, setShowRideOptions] = useState(true);

  // Destination from search screen params
  const destination = {
    latitude: parseFloat(params.destinationLat as string) || MOCK_PICKUP.latitude + 0.02,
    longitude: parseFloat(params.destinationLng as string) || MOCK_PICKUP.longitude + 0.02,
    name: (params.destinationName as string) || 'Destination',
    address: (params.destinationAddress as string) || 'San Francisco, CA',
  };

  // Calculate region to fit both pickup and dropoff
  useEffect(() => {
    const minLat = Math.min(MOCK_PICKUP.latitude, destination.latitude);
    const maxLat = Math.max(MOCK_PICKUP.latitude, destination.latitude);
    const minLng = Math.min(MOCK_PICKUP.longitude, destination.longitude);
    const maxLng = Math.max(MOCK_PICKUP.longitude, destination.longitude);

    const latDelta = (maxLat - minLat) * 2.5 || 0.04;
    const lngDelta = (maxLng - minLng) * 2.5 || 0.04;

    setRegion({
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.02),
      longitudeDelta: Math.max(lngDelta, 0.02),
    });
  }, [destination]);

  const routeCoordinates = generateRoutePolyline(MOCK_PICKUP, destination);

  const handleConfirmRide = () => {
    const ride = rideOptions.find(r => r.id === selectedRide);
    alert(`Ride confirmed!\n${ride?.name} - ${ride?.price}\nPickup: ${MOCK_PICKUP.name}\nDropoff: ${destination.name}`);
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container} className="justify-center items-center p-4">
        <MapPin size={64} color="#ccc" className="mb-4" />
        <Text className="text-2xl font-bold mb-2">Map View</Text>
        <Text className="text-gray-500 text-center mb-6">
          Interactive maps are only available on the iOS and Android mobile apps. Please use the Expo Go app on your phone to view the map.
        </Text>
        <TouchableOpacity
          className="bg-black py-4 px-8 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-white font-bold">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* Route Polyline */}
        <Polyline
          coordinates={routeCoordinates}
          strokeColor="#000000"
          strokeWidth={4}
          geodesic={true}
        />

        {/* Pickup Marker */}
        <Marker
          coordinate={MOCK_PICKUP}
          anchor={{ x: 0.5, y: 1 }}
        >
          <View className="flex-row items-center">
            <View className="bg-green-500 p-2 rounded-full shadow-lg">
              <MapPin size={18} color="#fff" />
            </View>
            <View className="bg-white px-3 py-1.5 rounded-full shadow-lg ml-2 flex-row items-center">
              <View className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
              <Text className="text-sm font-semibold text-gray-800">Pickup</Text>
            </View>
          </View>
        </Marker>

        {/* Dropoff Marker */}
        <Marker
          coordinate={destination}
          anchor={{ x: 0.5, y: 1 }}
        >
          <View className="flex-row items-center">
            <View className="bg-red-500 p-2 rounded-full shadow-lg">
              <MapPin size={18} color="#fff" />
            </View>
            <View className="bg-white px-3 py-1.5 rounded-full shadow-lg ml-2 flex-row items-center">
              <View className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2" />
              <Text className="text-sm font-semibold text-gray-800">Dropoff</Text>
            </View>
          </View>
        </Marker>

        {/* Nearby Cars */}
        {mockCars.map((car) => (
          <Marker
            key={car.id}
            coordinate={{ latitude: car.latitude, longitude: car.longitude }}
          >
            <View className="bg-white p-2 rounded-full shadow-lg border border-gray-200">
              <Car size={20} color="#000" />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Back Button */}
      <TouchableOpacity
        className="absolute top-12 left-4 bg-white p-3 rounded-full shadow-md"
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color="#000" />
      </TouchableOpacity>

      {/* Center Pin Indicator (Fixed relative to screen) */}
      <View style={styles.centerPin} pointerEvents="none">
        <View className="w-1 h-8 bg-black self-center shadow-lg" />
        <View className="w-3 h-3 bg-black rounded-full shadow-lg" />
      </View>

      {/* Ride Selection Bottom Sheet */}
      <View className="absolute bottom-0 left-0 right-0">
        <View className="bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
          {/* Drag Handle */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                <View className="w-2 h-2 rounded-full bg-gray-400" />
              </View>
              <View>
                <Text className="text-gray-500 font-semibold text-sm">PICKUP</Text>
                <Text className="text-base font-bold text-gray-900">{MOCK_PICKUP.name}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setShowRideOptions(false)}>
              <X size={24} color="#888" />
            </TouchableOpacity>
          </View>

          {/* Dropoff Info */}
          <View className="flex-row items-center p-4 border-b border-gray-100">
            <View className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mr-3">
              <View className="w-2 h-2 rounded-full bg-red-500" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-500 font-semibold text-sm">DROPOFF</Text>
              <Text className="text-base font-bold text-gray-900">{destination.name}</Text>
              <Text className="text-sm text-gray-500">{destination.address}</Text>
            </View>
          </View>

          {/* Ride Options */}
          <ScrollView className="px-4 py-3" showsVerticalScrollIndicator={false}>
            <Text className="text-lg font-bold mb-3">Choose your ride</Text>
            {rideOptions.map((ride) => (
              <TouchableOpacity
                key={ride.id}
                className={`flex-row items-center p-4 rounded-2xl mb-3 border-2 ${
                  selectedRide === ride.id
                    ? 'border-black bg-gray-50'
                    : 'border-gray-100'
                }`}
                onPress={() => setSelectedRide(ride.id)}
                activeOpacity={0.8}
              >
                {/* Ride Icon */}
                <View
                  className="w-14 h-14 rounded-xl flex items-center justify-center mr-4"
                  style={{ backgroundColor: `${ride.color}20` }}
                >
                  <Text style={{ fontSize: 24 }}>{ride.icon}</Text>
                </View>

                {/* Ride Info */}
                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-lg font-bold text-gray-900">{ride.name}</Text>
                    <Text className="text-lg font-bold text-gray-900">{ride.price}</Text>
                  </View>
                  <View className="flex-row items-center justify-between mt-1">
                    <Text className="text-sm text-gray-500">{ride.description}</Text>
                    <Text className="text-sm text-gray-500">{ride.eta}</Text>
                  </View>
                  <Text className="text-xs text-gray-400 mt-1">{ride.seats}</Text>
                </View>

                {/* Selection Indicator */}
                <View
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedRide === ride.id
                      ? 'border-black bg-black'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedRide === ride.id && (
                    <View className="w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {/* Confirm Ride Button */}
            <TouchableOpacity
              className="bg-black py-4 rounded-xl items-center mt-4"
              onPress={handleConfirmRide}
              disabled={!selectedRide}
            >
              <Text className="text-white font-bold text-lg">Confirm Ride</Text>
            </TouchableOpacity>

            <View className="h-8" /> {/* Safe area padding */}
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -6,
    marginTop: -40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
});