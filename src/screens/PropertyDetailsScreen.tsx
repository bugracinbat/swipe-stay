import React from "react";
import { StyleSheet, View, ScrollView, Image } from "react-native";
import { Text, Button } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../../App";

type PropertyDetailsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "PropertyDetails">;
  route: RouteProp<RootStackParamList, "PropertyDetails">;
};

// Mock data - in a real app, this would come from an API
const mockPropertyDetails = {
  id: "1",
  title: "Modern Apartment",
  price: "$1,500/month",
  location: "Downtown",
  description:
    "Beautiful modern apartment with stunning views of the city. Features include hardwood floors, stainless steel appliances, and a private balcony.",
  amenities: [
    "2 Bedrooms",
    "2 Bathrooms",
    "Parking",
    "Gym Access",
    "Pool",
    "Washer/Dryer",
  ],
  images: [
    "https://picsum.photos/400/600",
    "https://picsum.photos/400/601",
    "https://picsum.photos/400/602",
  ],
};

export default function PropertyDetailsScreen({
  navigation,
  route,
}: PropertyDetailsScreenProps) {
  const { propertyId } = route.params;
  // In a real app, you would fetch the property details using the propertyId

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: mockPropertyDetails.images[0] }}
        style={styles.mainImage}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{mockPropertyDetails.title}</Text>
          <Text style={styles.price}>{mockPropertyDetails.price}</Text>
        </View>

        <Text style={styles.location}>{mockPropertyDetails.location}</Text>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {mockPropertyDetails.description}
        </Text>

        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenitiesContainer}>
          {mockPropertyDetails.amenities.map((amenity, index) => (
            <View key={index} style={styles.amenityItem}>
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
        </View>

        <Button
          mode="contained"
          style={styles.contactButton}
          onPress={() => {
            // Handle contact action
          }}
        >
          Contact Landlord
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainImage: {
    width: "100%",
    height: 300,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    flex: 1,
  },
  price: {
    fontSize: 20,
    color: "#f4511e",
    fontWeight: "bold",
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
  },
  amenityItem: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },
  amenityText: {
    fontSize: 14,
    color: "#333",
  },
  contactButton: {
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: "#f4511e",
  },
});
