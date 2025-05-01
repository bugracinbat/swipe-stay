import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { Text, IconButton } from "react-native-paper";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useProperty } from "../context/PropertyContext";

type Property = {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
};

type SavedPropertiesScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "SavedProperties">;
};

export default function SavedPropertiesScreen({
  navigation,
}: SavedPropertiesScreenProps) {
  const { likedProperties, removeLikedProperty } = useProperty();

  const renderPropertyItem = ({ item }: { item: Property }) => (
    <TouchableOpacity
      style={styles.propertyCard}
      onPress={() =>
        navigation.navigate("PropertyDetails", { propertyId: item.id })
      }
    >
      <Image source={{ uri: item.image }} style={styles.propertyImage} />
      <View style={styles.propertyInfo}>
        <View style={styles.propertyHeader}>
          <View>
            <Text style={styles.propertyTitle}>{item.title}</Text>
            <Text style={styles.propertyPrice}>{item.price}</Text>
            <Text style={styles.propertyLocation}>{item.location}</Text>
          </View>
          <IconButton
            icon="heart"
            size={24}
            mode="contained"
            containerColor="#f4511e"
            iconColor="white"
            onPress={() => removeLikedProperty(item.id)}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {likedProperties.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved properties yet</Text>
          <Text style={styles.emptySubText}>
            Swipe right on properties you like to save them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={likedProperties}
          renderItem={renderPropertyItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 16,
  },
  propertyCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  propertyImage: {
    width: "100%",
    height: 200,
  },
  propertyInfo: {
    padding: 16,
  },
  propertyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  propertyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  propertyPrice: {
    fontSize: 16,
    color: "#f4511e",
    fontWeight: "bold",
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 14,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});
