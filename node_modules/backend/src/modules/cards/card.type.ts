export type Cards = {
  id: number;
  pack_id: string;
  name: string;
  rarity: string;
  category: string;
  image_full_art: string;
  colors: string[];
  cost: number;
  attributes: string[];
  power: number;
  counter: number;
  types: string[];
  effect: string;
  trigger?: string;
};
