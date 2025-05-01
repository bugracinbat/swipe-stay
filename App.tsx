import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider as PaperProvider, MD3LightTheme } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StyleSheet } from "react-native";
import { PropertyProvider } from "./src/context/PropertyContext";
import { FilterProvider } from "./src/context/FilterContext";

// Import screens (we'll create these next)
import HomeScreen from "./src/screens/HomeScreen";
import PropertyDetailsScreen from "./src/screens/PropertyDetailsScreen";
import SavedPropertiesScreen from "./src/screens/SavedPropertiesScreen";
import FilterScreen from "./src/screens/FilterScreen";

export type RootStackParamList = {
  Home: undefined;
  PropertyDetails: { propertyId: string };
  SavedProperties: undefined;
  Filter: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#FF3366",
    secondary: "#00D4FF",
    background: "#FFFFFF",
    surface: "#F8F9FA",
    text: "#1A1A1A",
    accent: "#FFD700",
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <PropertyProvider>
        <FilterProvider>
          <PaperProvider theme={theme}>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                  headerStyle: {
                    backgroundColor: theme.colors.primary,
                  },
                  headerTintColor: "#fff",
                  headerTitleStyle: {
                    fontWeight: "600",
                    fontSize: 18,
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
                <Stack.Screen
                  name="Filter"
                  component={FilterScreen}
                  options={{ title: "Filter Properties" }}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </PaperProvider>
        </FilterProvider>
      </PropertyProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
