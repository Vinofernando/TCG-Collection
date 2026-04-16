export type Cards = {
  id: number;
  pack_id: string;
  name: string;
  rarity: string;
  category: string;
  img_full_url: string;
  colors: string[];
  cost: number;
  attributes: string[];
  power: number;
  counter: number;
  types: string[];
  effect: string;
  trigger?: string;
};

export type SingleCard = {
  id: number;
  name: string;
  rarity: string;
  category: string;
  img_full_url: string;
  cost: number;
  attributes: string[];
  power: number;
  counter: number;
  types: string[];
  effect?: string;
  trigger?: string;
};

export type CardFilterType = {
  filter: string;
  packFilter: string;
  categoryFilter: string[]; // Ubah ke array agar bisa menampung banyak pilihan
  colorFilter: string[]; // Ubah ke array
  setFilter: (value: string) => void;
  setStFilter: (value: string) => void;
  setBoosterFilter: (value: string) => void;
  setCategoryFilter: (value: string[]) => void; // Konsisten menerima array
  setColorFilter: (value: string[]) => void; // Konsisten menerima array
};

export type PaginationType = {
  page: number;
  active: number;
  setActive: (value: number) => void;
};

export type SearchType = {
  searchByName: string;
  setSearchByName: (value: string) => void;
};

export type Mailtype = {
  toEmail: string;
  token: string;
};

export type UserType = {
  username: string;
  email: string;
  password: string;
};

export type LoginType = {
  success: boolean;
  message: string;
  user?: {
    // Opsional, hanya ada jika success: true
    id: string;
    email: string;
    username: string;
  };
};
