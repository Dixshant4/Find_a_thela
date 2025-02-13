export interface Thela {
    id?: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    type: "food" | "drink" | "tailor" | "flowers" | "mochi";
    mainFoodItem?: string;
  }
  
  export type ThelaType = "all" | "food" | "drink" | "tailor" | "flowers" | "mochi";