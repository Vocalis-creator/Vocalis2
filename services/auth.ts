import { supabase } from './supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Session, User, AuthError } from '@supabase/supabase-js';

/**
 * Authentication service for Vocalis
 * Handles email/password auth and guest mode
 */

export interface AuthUser {
  id: string;
  email?: string;
  isGuest: boolean;
  session?: Session;
}

export interface AuthResult {
  user: AuthUser | null;
  error: string | null;
}

/**
 * Keys for storing auth data locally
 */
const STORAGE_KEYS = {
  GUEST_USER_ID: 'vocalis_guest_user_id',
  AUTH_STATE: 'vocalis_auth_state',
} as const;

/**
 * Generate a random guest user ID
 */
function generateGuestId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sign up a new user with email and password
 */
export async function signUp(email: string, password: string): Promise<AuthResult> {
  try {
    console.log('🔐 AuthService: Signing up user with email:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('❌ AuthService: Sign up error:', error.message);
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Failed to create user account' };
    }

    // User profile will be automatically created by database trigger
    // No need to call createUserProfile manually

    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email || email,
      isGuest: false,
      session: data.session || undefined,
    };

    await saveAuthState(authUser);
    console.log('✅ AuthService: User signed up successfully');
    
    return { user: authUser, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('❌ AuthService: Sign up exception:', errorMessage);
    return { user: null, error: errorMessage };
  }
}

/**
 * Sign in an existing user with email and password
 */
export async function signIn(email: string, password: string): Promise<AuthResult> {
  try {
    console.log('🔐 AuthService: Signing in user with email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ AuthService: Sign in error:', error.message);
      return { user: null, error: error.message };
    }

    if (!data.user) {
      return { user: null, error: 'Failed to sign in' };
    }

    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email || email,
      isGuest: false,
      session: data.session || undefined,
    };

    await saveAuthState(authUser);
    console.log('✅ AuthService: User signed in successfully');
    
    return { user: authUser, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    console.error('❌ AuthService: Sign in exception:', errorMessage);
    return { user: null, error: errorMessage };
  }
}

/**
 * Continue as guest - generate local ID without server authentication
 */
export async function continueAsGuest(): Promise<AuthResult> {
  try {
    console.log('👤 AuthService: Creating guest user');
    
    // Check if we already have a guest ID stored
    let guestId = await AsyncStorage.getItem(STORAGE_KEYS.GUEST_USER_ID);
    
    if (!guestId) {
      guestId = generateGuestId();
      await AsyncStorage.setItem(STORAGE_KEYS.GUEST_USER_ID, guestId);
      console.log('👤 AuthService: Generated new guest ID:', guestId);
    } else {
      console.log('👤 AuthService: Using existing guest ID:', guestId);
    }

    const authUser: AuthUser = {
      id: guestId,
      isGuest: true,
    };

    await saveAuthState(authUser);
    console.log('✅ AuthService: Guest session created');
    
    return { user: authUser, error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to create guest session';
    console.error('❌ AuthService: Guest mode exception:', errorMessage);
    return { user: null, error: errorMessage };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ error: string | null }> {
  try {
    console.log('🔐 AuthService: Signing out user');
    
    // Get current auth state to check if user is guest
    const currentAuth = await getStoredAuthState();
    
    if (currentAuth?.isGuest) {
      // For guest users, just clear local storage
      await AsyncStorage.removeItem(STORAGE_KEYS.GUEST_USER_ID);
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
      console.log('✅ AuthService: Guest user signed out');
    } else {
      // For authenticated users, sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ AuthService: Sign out error:', error.message);
        return { error: error.message };
      }
      await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_STATE);
      console.log('✅ AuthService: Authenticated user signed out');
    }
    
    return { error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to sign out';
    console.error('❌ AuthService: Sign out exception:', errorMessage);
    return { error: errorMessage };
  }
}

/**
 * Get the current authenticated user
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    // First check if we have a stored auth state
    const storedAuth = await getStoredAuthState();
    if (storedAuth) {
      console.log('👤 AuthService: Found stored auth state:', { 
        id: storedAuth.id, 
        isGuest: storedAuth.isGuest 
      });
      return storedAuth;
    }

    // If no stored state, check Supabase session for authenticated users
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user) {
      const authUser: AuthUser = {
        id: session.user.id,
        email: session.user.email || undefined,
        isGuest: false,
        session,
      };
      
      await saveAuthState(authUser);
      console.log('👤 AuthService: Restored Supabase session');
      return authUser;
    }

    console.log('👤 AuthService: No current user found');
    return null;
  } catch (err) {
    console.error('❌ AuthService: Get current user error:', err);
    return null;
  }
}

/**
 * Save auth state to local storage
 */
async function saveAuthState(authUser: AuthUser): Promise<void> {
  try {
    const authState = {
      id: authUser.id,
      email: authUser.email,
      isGuest: authUser.isGuest,
      timestamp: Date.now(),
    };
    
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_STATE, JSON.stringify(authState));
  } catch (err) {
    console.error('❌ AuthService: Failed to save auth state:', err);
  }
}

/**
 * Get stored auth state from local storage
 */
async function getStoredAuthState(): Promise<AuthUser | null> {
  try {
    const authStateStr = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_STATE);
    if (!authStateStr) return null;
    
    const authState = JSON.parse(authStateStr);
    return {
      id: authState.id,
      email: authState.email,
      isGuest: authState.isGuest,
    };
  } catch (err) {
    console.error('❌ AuthService: Failed to get stored auth state:', err);
    return null;
  }
}

/**
 * Create user profile in database after successful signup
 */
async function createUserProfile(userId: string, email: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('❌ AuthService: Failed to create user profile:', error.message);
      // Don't throw error here as sign up was successful
    } else {
      console.log('✅ AuthService: User profile created in database');
    }
  } catch (err) {
    console.error('❌ AuthService: Exception creating user profile:', err);
  }
}

/**
 * Update user interests in database
 */
export async function updateUserInterests(userId: string, interests: string[]): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ 
        interests,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('❌ AuthService: Failed to update user interests:', error.message);
      return { error: error.message };
    }

    console.log('✅ AuthService: User interests updated');
    return { error: null };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to update interests';
    console.error('❌ AuthService: Exception updating interests:', errorMessage);
    return { error: errorMessage };
  }
} 