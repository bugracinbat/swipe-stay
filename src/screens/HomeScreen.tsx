import React, { useState } from "react";
import { StyleSheet, View, Dimensions, Text, Image } from "react-native";
import { FAB, IconButton } from "react-native-paper";
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

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

// Mock data for properties
const mockProperties = [
  {
    id: "1",
    title: "Modern Apartment",
    price: "$1,500/month",
    location: "Downtown",
    image: "https://picsum.photos/400/600",
  },
  {
    id: "2",
    title: "Cozy Studio",
    price: "$1,200/month",
    location: "Westside",
    image: "https://picsum.photos/400/601",
  },
  // Add more mock properties as needed
];

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const { addLikedProperty, likedProperties } = useProperty();

  const currentProperty = mockProperties[currentIndex];

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
          setCurrentIndex((prev) => (prev + 1) % mockProperties.length);
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
        <Animated.View style={[styles.card, animatedStyle]}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: currentProperty.image }}
              style={styles.propertyImage}
              resizeMode="cover"
            />
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{currentProperty.title}</Text>
              <Text style={styles.price}>{currentProperty.price}</Text>
            </View>
            <Text style={styles.location}>{currentProperty.location}</Text>
          </View>
        </Animated.View>
      </GestureDetector>

      <Animated.View style={[styles.likeContainer, likeStyle]}>
        <Text style={styles.likeText}>LIKE</Text>
      </Animated.View>

      <Animated.View style={[styles.dislikeContainer, dislikeStyle]}>
        <Text style={styles.dislikeText}>NOPE</Text>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <IconButton
          icon="close"
          size={30}
          mode="contained"
          containerColor="#ff4444"
          iconColor="white"
          onPress={() => {
            translateX.value = withSpring(-SCREEN_WIDTH);
            setTimeout(() => {
              setCurrentIndex((prev) => (prev + 1) % mockProperties.length);
              translateX.value = withSpring(0);
            }, 300);
          }}
        />
        <IconButton
          icon="heart"
          size={30}
          mode="contained"
          containerColor="#4CAF50"
          iconColor="white"
          onPress={() => {
            translateX.value = withSpring(SCREEN_WIDTH);
            addLikedProperty(currentProperty);
            setTimeout(() => {
              setCurrentIndex((prev) => (prev + 1) % mockProperties.length);
              translateX.value = withSpring(0);
            }, 300);
          }}
        />
      </View>

      <FAB
        icon="heart"
        style={styles.fab}
        onPress={() => navigation.navigate("SavedProperties")}
        label={`${likedProperties.length}`}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    position: "absolute",
    width: SCREEN_WIDTH * 0.9,
    height: "80%",
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    flex: 3,
    backgroundColor: "#e0e0e0",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoContainer: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  price: {
    fontSize: 20,
    color: "#f4511e",
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#f4511e",
  },
  propertyImage: {
    width: "100%",
    height: "100%",
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
    borderColor: "#4CAF50",
    color: "#4CAF50",
    fontSize: 32,
    fontWeight: "bold",
    padding: 10,
  },
  dislikeText: {
    borderWidth: 4,
    borderColor: "#ff4444",
    color: "#ff4444",
    fontSize: 32,
    fontWeight: "bold",
    padding: 10,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: 20,
  },
});
