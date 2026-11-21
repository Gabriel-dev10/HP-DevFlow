export type User = {
  id: number;
  name: string;
  email: string;
  address: {
    city: string;
  };
};

export type DummyJsonUser = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  address: {
    city: string;
  };
};

export type DummyJsonUsersResponse = {
  users: DummyJsonUser[];
};

export type AuthUser = {
  name: string;
  email: string;
};

export type ThemeName = 'claro' | 'escuro';
