export * from './database';

export interface Asset {
  id: string;
  userId: string;
  name: string;
  category: import('./database').AssetCategory;
  value: number;
  currency: string;
  unit?: string;
  quantity?: number;
  location?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Liability {
  id: string;
  userId: string;
  name: string;
  category: import('./database').LiabilityCategory;
  principal: number;
  balance: number;
  interestRate: number;
  currency: string;
  lender?: string;
  collateral?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NetWorthSnapshot {
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

export interface UserProfile {
  id: string;
  fullName: string | null;
  avatarUrl: string | null;
  currency: string;
}
