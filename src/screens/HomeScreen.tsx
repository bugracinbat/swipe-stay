import React, { useState, useMemo, useEffect } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  AccessibilityInfo,
} from "react-native";
import { FAB, IconButton, Surface } from "react-native-paper";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useProperty } from "../context/PropertyContext";
import { useFilter } from "../context/FilterContext";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

// Mock data for properties
const mockProperties = [
  {
    id: "1",
    title: "Modern Apartment",
    price: "$1,500",
    location: "Downtown",
    image: "https://picsum.photos/400/600",
    type: "apartment",
    bedrooms: 2,
    bathrooms: 2,
  },
  {
    id: "2",
    title: "Cozy Studio",
    price: "$1,200",
    location: "Westside",
    image: "https://picsum.photos/400/601",
    type: "studio",
    bedrooms: 1,
    bathrooms: 1,
  },
  {
    id: "3",
    title: "Luxury House",
    price: "$3,500",
    location: "Uptown",
    image: "https://picsum.photos/400/602",
    type: "house",
    bedrooms: 4,
    bathrooms: 3,
  },
  {
    id: "4",
    title: "Downtown Apartment",
    price: "$2,000",
    location: "Downtown",
    image: "https://picsum.photos/400/603",
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
  },
  {
    id: "5",
    title: "Modern Studio",
    price: "$1,800",
    location: "Midtown",
    image: "https://picsum.photos/400/604",
    type: "studio",
    bedrooms: 1,
    bathrooms: 1,
  },
];

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const { addLikedProperty, likedProperties } = useProperty();
  const {
    priceRange,
    propertyType,
    searchQuery,
    location,
    bedrooms,
    bathrooms,
    amenities,
  } = useFilter();

  // Add accessibility features
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  useEffect(() => {
    const checkScreenReader = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      setIsScreenReaderEnabled(isEnabled);
    };

    checkScreenReader();
    const subscription = AccessibilityInfo.addEventListener(
      "screenReaderChanged",
      setIsScreenReaderEnabled
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // Add header configuration with accessibility
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: "#FF3366",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "600",
        fontSize: 18,
      },
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <IconButton
            icon="heart"
            iconColor="#fff"
            size={24}
            onPress={() => navigation.navigate("SavedProperties")}
            accessibilityLabel="View saved properties"
            accessibilityHint="Opens your list of saved properties"
            accessibilityRole="button"
          />
          <IconButton
            icon="filter-variant"
            iconColor="#fff"
            size={24}
            onPress={() => navigation.navigate("Filter")}
            accessibilityLabel="Filter properties"
            accessibilityHint="Opens property filter options"
            accessibilityRole="button"
          />
        </View>
      ),
    });
  }, [navigation]);

  // Filter properties based on current filters
  const filteredProperties = useMemo(() => {
    return mockProperties.filter((property) => {
      const propertyPrice = parseInt(property.price.replace(/[^0-9]/g, ""));
      const matchesPrice =
        propertyPrice >= priceRange.min && propertyPrice <= priceRange.max;
      const matchesType =
        propertyType === "all" || property.type === propertyType;
      const matchesSearch =
        searchQuery === "" ||
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation =
        location === "" ||
        property.location.toLowerCase().includes(location.toLowerCase());
      const matchesBedrooms = bedrooms === 0 || property.bedrooms >= bedrooms;
      const matchesBathrooms =
        bathrooms === 0 || property.bathrooms >= bathrooms;

      return (
        matchesPrice &&
        matchesType &&
        matchesSearch &&
        matchesLocation &&
        matchesBedrooms &&
        matchesBathrooms
      );
    });
  }, [
    priceRange,
    propertyType,
    searchQuery,
    location,
    bedrooms,
    bathrooms,
    amenities,
  ]);

  // Reset current index when filters change
  React.useEffect(() => {
    setCurrentIndex(0);
  }, [filteredProperties]);

  const currentProperty = filteredProperties[currentIndex];

  // If no properties match the filters, show a message
  if (filteredProperties.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No properties match your filters</Text>
        <Text style={styles.emptySubText}>
          Try adjusting your filters or search criteria
        </Text>
        <IconButton
          icon="filter"
          size={24}
          mode="contained"
          containerColor="#FF3366"
          iconColor="white"
          onPress={() => navigation.navigate("Filter")}
          accessibilityLabel="Open filters"
          accessibilityHint="Opens property filter options"
          accessibilityRole="button"
        />
      </View>
    );
  }

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        // Swipe right or left
        translateX.value = withSpring(
          event.translationX > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH
        );

        // Handle like/dislike
        if (event.translationX > 0) {
          addLikedProperty(currentProperty);
        }

        setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % filteredProperties.length);
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
        }, 300);
      } else {
        // Return to center
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      {
        rotate: `${(translateX.value / SCREEN_WIDTH) * 30}deg`,
      },
    ],
  }));

  const likeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [0, SCREEN_WIDTH / 4],
      [0, 1],
      Extrapolate.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [0, SCREEN_WIDTH / 4],
          [0.5, 1],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  const dislikeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateX.value,
      [-SCREEN_WIDTH / 4, 0],
      [1, 0],
      Extrapolate.CLAMP
    ),
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [-SCREEN_WIDTH / 4, 0],
          [1, 0.5],
          Extrapolate.CLAMP
        ),
      },
    ],
  }));

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[styles.card, animatedStyle]}
          accessible={true}
          accessibilityLabel={`${currentProperty.title}, ${currentProperty.price} per month, ${currentProperty.bedrooms} bedrooms, ${currentProperty.bathrooms} bathrooms, located in ${currentProperty.location}`}
          accessibilityRole="button"
          accessibilityHint="Swipe right to like, left to dislike"
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: currentProperty.image }}
              style={styles.propertyImage}
              resizeMode="cover"
              accessibilityLabel={`Image of ${currentProperty.title}`}
            />
            <View style={styles.imageOverlay} />
          </View>
          <Surface style={styles.infoContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{currentProperty.title}</Text>
              <Text style={styles.price}>{currentProperty.price}/month</Text>
            </View>
            <Text style={styles.location}>{currentProperty.location}</Text>
            <View style={styles.detailsContainer}>
              <Text style={styles.details}>
                {currentProperty.bedrooms} beds • {currentProperty.bathrooms}{" "}
                baths
              </Text>
              <Text style={styles.type}>{currentProperty.type}</Text>
            </View>
          </Surface>
        </Animated.View>
      </GestureDetector>

      <Animated.View
        style={[styles.likeContainer, likeStyle]}
        accessible={true}
        accessibilityLabel="Like indicator"
      >
        <Text style={styles.likeText}>LIKE</Text>
      </Animated.View>

      <Animated.View
        style={[styles.dislikeContainer, dislikeStyle]}
        accessible={true}
        accessibilityLabel="Dislike indicator"
      >
        <Text style={styles.dislikeText}>NOPE</Text>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <IconButton
          icon="close"
          size={30}
          mode="contained"
          containerColor="#FF3366"
          iconColor="white"
          onPress={() => {
            translateX.value = withSpring(-SCREEN_WIDTH);
            setTimeout(() => {
              setCurrentIndex((prev) => (prev + 1) % filteredProperties.length);
              translateX.value = withSpring(0);
            }, 300);
          }}
          accessibilityLabel="Dislike property"
          accessibilityHint="Swipe left to dislike this property"
          accessibilityRole="button"
        />
        <IconButton
          icon="heart"
          size={30}
          mode="contained"
          containerColor="#00D4FF"
          iconColor="white"
          onPress={() => {
            translateX.value = withSpring(SCREEN_WIDTH);
            addLikedProperty(currentProperty);
            setTimeout(() => {
              setCurrentIndex((prev) => (prev + 1) % filteredProperties.length);
              translateX.value = withSpring(0);
            }, 300);
          }}
          accessibilityLabel="Like property"
          accessibilityHint="Swipe right to like this property"
          accessibilityRole="button"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  card: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.9,
    height: "80%",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  imageContainer: {
    flex: 3,
    backgroundColor: "#F8F9FA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  propertyImage: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1A1A1A",
    letterSpacing: 0.5,
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FF3366",
    letterSpacing: 0.5,
  },
  location: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  details: {
    fontSize: 14,
    color: "#666666",
    letterSpacing: 0.5,
  },
  type: {
    fontSize: 14,
    color: "#00D4FF",
    textTransform: "capitalize",
    letterSpacing: 0.5,
  },
  likeContainer: {
    position: "absolute",
    top: 50,
    right: 40,
    zIndex: 1000,
    transform: [{ rotate: "30deg" }],
  },
  dislikeContainer: {
    position: "absolute",
    top: 50,
    left: 40,
    zIndex: 1000,
    transform: [{ rotate: "-30deg" }],
  },
  likeText: {
    borderWidth: 4,
    borderColor: "#00D4FF",
    color: "#00D4FF",
    fontSize: 32,
    fontWeight: "bold",
    padding: 10,
    letterSpacing: 1,
  },
  dislikeText: {
    borderWidth: 4,
    borderColor: "#FF3366",
    color: "#FF3366",
    fontSize: 32,
    fontWeight: "bold",
    padding: 10,
    letterSpacing: 1,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
  },
  filterFab: {
    position: "absolute",
    margin: 16,
    right: 80,
    bottom: 0,
    backgroundColor: "#666",
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
    marginBottom: 20,
  },
});
