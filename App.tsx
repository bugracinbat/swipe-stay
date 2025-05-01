import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { PropertyProvider } from "./src/context/PropertyContext";

// Import screens (we'll create these next)
import HomeScreen from "./src/screens/HomeScreen";
import PropertyDetailsScreen from "./src/screens/PropertyDetailsScreen";
import SavedPropertiesScreen from "./src/screens/SavedPropertiesScreen";

export type RootStackParamList = {
  Home: undefined;
  PropertyDetails: { propertyId: string };
  SavedProperties: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <PropertyProvider>
        <PaperProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName="Home"
              screenOptions={{
                headerStyle: {
                  backgroundColor: "#f4511e",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                  fontWeight: "bold",
                },
              }}
            >
              <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{ title: "SwipeStay" }}
              />
              <Stack.Screen
                name="PropertyDetails"
                component={PropertyDetailsScreen}
                options={{ title: "Property Details" }}
              />
              <Stack.Screen
                name="SavedProperties"
                component={SavedPropertiesScreen}
                options={{ title: "Saved Properties" }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </PropertyProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
