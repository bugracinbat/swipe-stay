import React from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import {
  Text,
  Button,
  TextInput,
  Chip,
  Surface,
  Switch,
} from "react-native-paper";
import { useFilter } from "../context/FilterContext";
import Slider from "@react-native-community/slider";

type FilterScreenProps = {
  navigation: any;
};

export default function FilterScreen({ navigation }: FilterScreenProps) {
  const {
    priceRange,
    setPriceRange,
    propertyType,
    setPropertyType,
    searchQuery,
    setSearchQuery,
    location,
    setLocation,
    bedrooms,
    setBedrooms,
    bathrooms,
    setBathrooms,
    amenities,
    setAmenities,
    resetFilters,
  } = useFilter();

  // Add header styling
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
    });
  }, [navigation]);

  const propertyTypes: Array<{
    label: string;
    value: "apartment" | "house" | "studio" | "all";
  }> = [
    { label: "All", value: "all" },
    { label: "Apartment", value: "apartment" },
    { label: "House", value: "house" },
    { label: "Studio", value: "studio" },
  ];

  const bedroomOptions = [0, 1, 2, 3, 4, 5];
  const bathroomOptions = [0, 1, 2, 3, 4];

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.section}>
        <Text style={styles.sectionTitle}>Search</Text>
        <TextInput
          label="Search properties"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: "#FF3366" } }}
        />
        <TextInput
          label="Location"
          value={location}
          onChangeText={setLocation}
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: "#FF3366" } }}
        />
      </Surface>

      <Surface style={styles.section}>
        <Text style={styles.sectionTitle}>Property Type</Text>
        <View style={styles.chipContainer}>
          {propertyTypes.map((type) => (
            <Chip
              key={type.value}
              selected={propertyType === type.value}
              onPress={() => setPropertyType(type.value)}
              style={[
                styles.chip,
                propertyType === type.value && styles.selectedChip,
              ]}
              textStyle={[
                styles.chipText,
                propertyType === type.value && styles.selectedChipText,
              ]}
            >
              {type.label}
            </Chip>
          ))}
        </View>
      </Surface>

      <Surface style={styles.section}>
        <Text style={styles.sectionTitle}>Bedrooms</Text>
        <View style={styles.chipContainer}>
          {bedroomOptions.map((count) => (
            <Chip
              key={count}
              selected={bedrooms === count}
              onPress={() => setBedrooms(count)}
              style={[styles.chip, bedrooms === count && styles.selectedChip]}
              textStyle={[
                styles.chipText,
                bedrooms === count && styles.selectedChipText,
              ]}
            >
              {count === 0 ? "Any" : `${count}+`}
            </Chip>
          ))}
        </View>
      </Surface>

      <Surface style={styles.section}>
        <Text style={styles.sectionTitle}>Bathrooms</Text>
        <View style={styles.chipContainer}>
          {bathroomOptions.map((count) => (
            <Chip
              key={count}
              selected={bathrooms === count}
              onPress={() => setBathrooms(count)}
              style={[styles.chip, bathrooms === count && styles.selectedChip]}
              textStyle={[
                styles.chipText,
                bathrooms === count && styles.selectedChipText,
              ]}
            >
              {count === 0 ? "Any" : `${count}+`}
            </Chip>
          ))}
        </View>
      </Surface>

      <Surface style={styles.section}>
        <Text style={styles.sectionTitle}>Price Range</Text>
        <Text style={styles.priceText}>
          ${priceRange.min} - ${priceRange.max}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={5000}
          step={100}
          value={priceRange.max}
          onValueChange={(value) =>
            setPriceRange({ ...priceRange, max: value })
          }
          minimumTrackTintColor="#FF3366"
          maximumTrackTintColor="#E0E0E0"
          thumbTintColor="#FF3366"
        />
      </Surface>

      <Surface style={styles.section}>
        <Text style={styles.sectionTitle}>Amenities</Text>
        <View style={styles.amenityContainer}>
          <View style={styles.amenityRow}>
            <Text style={styles.amenityText}>Parking</Text>
            <Switch
              value={amenities.parking}
              onValueChange={(value) =>
                setAmenities({ ...amenities, parking: value })
              }
              color="#FF3366"
            />
          </View>
          <View style={styles.amenityRow}>
            <Text style={styles.amenityText}>Pool</Text>
            <Switch
              value={amenities.pool}
              onValueChange={(value) =>
                setAmenities({ ...amenities, pool: value })
              }
              color="#FF3366"
            />
          </View>
          <View style={styles.amenityRow}>
            <Text style={styles.amenityText}>Gym</Text>
            <Switch
              value={amenities.gym}
              onValueChange={(value) =>
                setAmenities({ ...amenities, gym: value })
              }
              color="#FF3366"
            />
          </View>
          <View style={styles.amenityRow}>
            <Text style={styles.amenityText}>Pets Allowed</Text>
            <Switch
              value={amenities.pets}
              onValueChange={(value) =>
                setAmenities({ ...amenities, pets: value })
              }
              color="#FF3366"
            />
          </View>
          <View style={styles.amenityRow}>
            <Text style={styles.amenityText}>Furnished</Text>
            <Switch
              value={amenities.furnished}
              onValueChange={(value) =>
                setAmenities({ ...amenities, furnished: value })
              }
              color="#FF3366"
            />
          </View>
        </View>
      </Surface>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={resetFilters}
          style={styles.button}
          textColor="#FF3366"
          buttonColor="transparent"
        >
          Reset Filters
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          style={styles.button}
          buttonColor="#FF3366"
          textColor="#fff"
        >
          Apply Filters
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1A1A1A",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#F8F9FA",
  },
  selectedChip: {
    backgroundColor: "#FF3366",
  },
  chipText: {
    color: "#666666",
  },
  selectedChipText: {
    color: "#FFFFFF",
  },
  slider: {
    width: "100%",
    height: 40,
  },
  priceText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
    color: "#1A1A1A",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    borderColor: "#FF3366",
  },
  amenityContainer: {
    gap: 16,
  },
  amenityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amenityText: {
    color: "#1A1A1A",
    fontSize: 16,
  },
});
