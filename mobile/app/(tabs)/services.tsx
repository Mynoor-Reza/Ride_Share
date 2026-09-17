import { View, Text, SafeAreaView, ScrollView } from 'react-native';

const ServiceItem = ({ title, icon, isLarge = false }: { title: string, icon: string, isLarge?: boolean }) => (
  <View className={`items-center bg-gray-100 rounded-xl p-3 mb-4 ${isLarge ? 'w-[48%]' : 'w-[23%]'}`}>
    <Text className={`${isLarge ? 'text-4xl' : 'text-3xl'} mb-2`}>{icon}</Text>
    <Text className="font-semibold text-xs text-center">{title}</Text>
  </View>
);

export default function ServicesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-3xl font-bold mb-6">Services</Text>

        <Text className="text-xl font-bold mb-4">Go anywhere</Text>
        <View className="flex-row flex-wrap justify-between">
          <ServiceItem title="Ride" icon="🚗" isLarge={true} />
          <ServiceItem title="Package" icon="📦" isLarge={true} />
          
          <ServiceItem title="Reserve" icon="📅" />
          <ServiceItem title="Hourly" icon="⏱️" />
          <ServiceItem title="Rent" icon="🔑" />
          <ServiceItem title="2-Wheels" icon="🛵" />
          
          <ServiceItem title="Transit" icon="🚌" />
          <ServiceItem title="Charter" icon="🚐" />
          <ServiceItem title="Explore" icon="🚀" />
          <ServiceItem title="Travel" icon="✈️" />
        </View>

        <View className="border-b border-gray-200 my-4" />

        <Text className="text-xl font-bold mb-4">Get anything delivered</Text>
        <View className="flex-row flex-wrap justify-between">
          <ServiceItem title="Restaurants" icon="🍔" isLarge={true} />
          <ServiceItem title="Grocery" icon="🛒" isLarge={true} />
          
          <ServiceItem title="Flowers" icon="💐" />
          <ServiceItem title="Convenience" icon="🏪" />
          <ServiceItem title="Pharmacy" icon="💊" />
          <ServiceItem title="Alcohol" icon="🍷" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
