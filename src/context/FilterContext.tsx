import React, { createContext, useContext, useState, ReactNode } from "react";

type PriceRange = {
  min: number;
  max: number;
};

type PropertyType = "apartment" | "house" | "studio" | "all";

type Amenities = {
  parking: boolean;
  pool: boolean;
  gym: boolean;
  pets: boolean;
  furnished: boolean;
};

type FilterContextType = {
  priceRange: PriceRange;
  setPriceRange: (range: PriceRange) => void;
  propertyType: PropertyType;
  setPropertyType: (type: PropertyType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  location: string;
  setLocation: (location: string) => void;
  bedrooms: number;
  setBedrooms: (count: number) => void;
  bathrooms: number;
  setBathrooms: (count: number) => void;
  amenities: Amenities;
  setAmenities: (amenities: Amenities) => void;
  resetFilters: () => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const DEFAULT_PRICE_RANGE = {
  min: 0,
  max: 5000,
};

const DEFAULT_AMENITIES = {
  parking: false,
  pool: false,
  gym: false,
  pets: false,
  furnished: false,
};

export function FilterProvider({ children }: { children: ReactNode }) {
  const [priceRange, setPriceRange] = useState<PriceRange>(DEFAULT_PRICE_RANGE);
  const [propertyType, setPropertyType] = useState<PropertyType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [amenities, setAmenities] = useState<Amenities>(DEFAULT_AMENITIES);

  const resetFilters = () => {
    setPriceRange(DEFAULT_PRICE_RANGE);
    setPropertyType("all");
    setSearchQuery("");
    setLocation("");
    setBedrooms(0);
    setBathrooms(0);
    setAmenities(DEFAULT_AMENITIES);
  };

  return (
    <FilterContext.Provider
      value={{
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
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}
