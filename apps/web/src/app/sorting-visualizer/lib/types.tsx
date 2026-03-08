export type SortingAlgorithmType =  
  | "bubble" 
  | "insertion"
  | "selection" 
  | "merge" 
  | "quick";  

// Defines the speed levels for sorting animations  
export type AnimateSpeedType = "slow" | "medium" | "fast" | "lightning";  
 
export type SelectOptionsType = {  
  label: string;
  value: string;
};  

export type AnimationArrayType = [number[], boolean][];  
