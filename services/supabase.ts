import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Supabase client configuration for Vocalis
 * Handles authentication, database operations, and storage
 */

// Get Supabase configuration from app.config.js
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase configuration. Please check your app.config.js and environment variables.'
  );
}

// Create Supabase client with AsyncStorage for session persistence
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Database type definitions
 * These should match your Supabase database schema
 */
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          interests: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email?: string | null;
          interests?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          interests?: string[] | null;
          updated_at?: string;
        };
      };
      tours: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          location: string;
          duration_minutes: number;
          interests: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          location: string;
          duration_minutes: number;
          interests: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          location?: string;
          duration_minutes?: number;
          interests?: string[];
        };
      };
    };
  };
}

// Type the Supabase client
export type SupabaseClient = typeof supabase; 