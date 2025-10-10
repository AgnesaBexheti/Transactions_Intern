export type Category = { id: number; name: string };

export type Expense = {
  id: number;
  title: string;
  value: number;
  category: Category;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type TransactionCardData = {
  title: string;
  category: string;
  amount: number;
  date: string;
};

export type AuthContextValue = {
  isAuthed: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
