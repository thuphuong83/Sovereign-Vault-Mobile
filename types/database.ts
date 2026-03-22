// Auto-generated types from Supabase schema
// Run: npx supabase gen types typescript --project-id <id> > types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          currency?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          currency?: string;
          updated_at?: string;
        };
      };
      assets: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: AssetCategory;
          value: number;
          currency: string;
          unit: string | null;
          quantity: number | null;
          location: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category: AssetCategory;
          value: number;
          currency?: string;
          unit?: string | null;
          quantity?: number | null;
          location?: string | null;
          notes?: string | null;
        };
        Update: {
          name?: string;
          category?: AssetCategory;
          value?: number;
          currency?: string;
          unit?: string | null;
          quantity?: number | null;
          location?: string | null;
          notes?: string | null;
          updated_at?: string;
        };
      };
      liabilities: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          category: LiabilityCategory;
          principal: number;
          balance: number;
          interest_rate: number;
          currency: string;
          lender: string | null;
          collateral: string | null;
          due_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          category: LiabilityCategory;
          principal: number;
          balance: number;
          interest_rate: number;
          currency?: string;
          lender?: string | null;
          collateral?: string | null;
          due_date?: string | null;
        };
        Update: {
          name?: string;
          category?: LiabilityCategory;
          balance?: number;
          interest_rate?: number;
          lender?: string | null;
          collateral?: string | null;
          due_date?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: {};
    Functions: {};
    Enums: {
      asset_category: AssetCategory;
      liability_category: LiabilityCategory;
    };
  };
}

export type AssetCategory =
  | 'real_estate'
  | 'metals'
  | 'cash'
  | 'equities'
  | 'crypto'
  | 'collectibles'
  | 'other';

export type LiabilityCategory =
  | 'mortgage'
  | 'vehicle'
  | 'personal'
  | 'business'
  | 'other';
