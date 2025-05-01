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
    error: "#DC2626",
    success: "#059669",
    warning: "#D97706",
    info: "#2563EB",
    // Accessibility-focused colors
    surfaceDisabled: "#E5E7EB",
    onSurfaceDisabled: "#6B7280",
    backdrop: "rgba(0, 0, 0, 0.5)",
    elevation: {
      level0: "transparent",
      level1: "#FFFFFF",
      level2: "#F9FAFB",
      level3: "#F3F4F6",
      level4: "#E5E7EB",
      level5: "#D1D5DB",
    },
  },
  // Add accessibility-focused typography
  fonts: {
    ...MD3LightTheme.fonts,
    labelLarge: {
      ...MD3LightTheme.fonts.labelLarge,
      letterSpacing: 0.1,
      lineHeight: 20,
    },
    labelMedium: {
      ...MD3LightTheme.fonts.labelMedium,
      letterSpacing: 0.5,
      lineHeight: 16,
    },
    labelSmall: {
      ...MD3LightTheme.fonts.labelSmall,
      letterSpacing: 0.5,
      lineHeight: 16,
    },
  },
  // Add accessibility-focused animation
  animation: {
    scale: 1.0,
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
                    letterSpacing: 0.5,
                  },
                  // Add accessibility labels
                  headerBackTitle: "Back",
                  headerBackTitleVisible: true,
                }}
              >
                <Stack.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{
                    title: "SwipeStay",
                    headerLargeTitle: true,
                  }}
                />
                <Stack.Screen
                  name="PropertyDetails"
                  component={PropertyDetailsScreen}
                  options={{
                    title: "Property Details",
                    headerBackTitle: "Back",
                  }}
                />
                <Stack.Screen
                  name="SavedProperties"
                  component={SavedPropertiesScreen}
                  options={{
                    title: "Saved Properties",
                    headerBackTitle: "Back",
                  }}
                />
                <Stack.Screen
                  name="Filter"
                  component={FilterScreen}
                  options={{
                    title: "Filter Properties",
                    headerBackTitle: "Back",
                  }}
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
