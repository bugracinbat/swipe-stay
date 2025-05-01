import React, { createContext, useContext, useState, ReactNode } from "react";

type Property = {
  id: string;
  title: string;
  price: string;
  location: string;
  image: string;
  description?: string;
  amenities?: string[];
  images?: string[];
};

type PropertyContextType = {
  likedProperties: Property[];
  addLikedProperty: (property: Property) => void;
  removeLikedProperty: (propertyId: string) => void;
  isPropertyLiked: (propertyId: string) => boolean;
};

const PropertyContext = createContext<PropertyContextType | undefined>(
  undefined
);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const [likedProperties, setLikedProperties] = useState<Property[]>([]);

  const addLikedProperty = (property: Property) => {
    setLikedProperties((prev) => {
      if (!prev.find((p) => p.id === property.id)) {
        return [...prev, property];
      }
      return prev;
    });
  };

  const removeLikedProperty = (propertyId: string) => {
    setLikedProperties((prev) => prev.filter((p) => p.id !== propertyId));
  };

  const isPropertyLiked = (propertyId: string) => {
    return likedProperties.some((p) => p.id === propertyId);
  };

  return (
    <PropertyContext.Provider
      value={{
        likedProperties,
        addLikedProperty,
        removeLikedProperty,
        isPropertyLiked,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error("useProperty must be used within a PropertyProvider");
  }
  return context;
}
