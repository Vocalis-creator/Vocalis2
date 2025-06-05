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
          interests: string[]; // Array field, not text
          segments: TourSegmentData[] | null; // JSONB array
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          location: string;
          duration_minutes: number;
          interests: string[];
          segments?: TourSegmentData[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          location?: string;
          duration_minutes?: number;
          interests?: string[];
          segments?: TourSegmentData[] | null;
        };
      };
      tour_segments: {
        Row: {
          id: string;
          tour_id: string;
          title: string;
          content: string;
          audio_url: string;
          duration_seconds: number;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          tour_id: string;
          title: string;
          content: string;
          audio_url: string;
          duration_seconds: number;
          order_index: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          tour_id?: string;
          title?: string;
          content?: string;
          audio_url?: string;
          duration_seconds?: number;
          order_index?: number;
        };
      };
    };
  };
}

/**
 * Type for tour segment data stored in JSONB
 */
export interface TourSegmentData {
  title: string;
  content: string;
  audio_url: string;
  duration_seconds: number;
  order_index: number;
}

// Type the Supabase client
export type SupabaseClient = typeof supabase; 