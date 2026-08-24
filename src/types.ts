export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  date: string;
  name: string;
  category: string;
  type: 'income' | 'expense';
  source: 'manual' | 'plaid';
  plaidTransactionId?: string;
}

export type Theme = 'dark' | 'light' | 'system';
