export interface Thela {
    id?: string;
    name: string;
    description?: string;  // Made optional
    latitude: number;
    longitude: number;
    type: "food" | "drink" | "tailor" | "flowers" | "mochi";
    mainFoodItem?: string;  // Changed from mainFoodItem to be more generic
    userId: string;
  }
  
  export type ThelaType = "all" | "food" | "drink" | "tailor" | "flowers" | "mochi";