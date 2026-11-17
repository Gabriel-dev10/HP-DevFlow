export type User = {
  id: number;
  name: string;
  email: string;
  address: {
    city: string;
  };
};

export type AuthUser = {
  name: string;
  email: string;
};

export type ThemeName = 'claro' | 'escuro';
