import { projectId, publicAnonKey } from './supabase/info';
import { createClient } from '@supabase/supabase-js';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-ee7657b6`;

// Initialize Supabase client for frontend auth
const supabaseClient = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

let currentUser: { id: string; email: string; username: string } | null = null;
let accessToken: string | null = null;

// Sign up new user
export async function signUp(email: string, password: string, username?: string): Promise<{
  success: boolean;
  error?: string;
  user?: { id: string; email: string; username: string };
}> {
  try {
    // Call backend to create user
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({ email, password, username })
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error };
    }

    // Sign in to get session
    const { data: authData, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (signInError || !authData.session) {
      return { success: false, error: signInError?.message || 'Failed to sign in after signup' };
    }

    currentUser = data.user;
    accessToken = authData.session.access_token;
    
    // Store in localStorage
    localStorage.setItem('soulbound_user', JSON.stringify(currentUser));
    localStorage.setItem('soulbound_access_token', accessToken);

    console.log('✅ User signed up successfully:', email);
    return { success: true, user: currentUser };
  } catch (error) {
    console.error('Signup error:', error);
    return { success: false, error: String(error) };
  }
}

// Sign in existing user
export async function signIn(email: string, password: string): Promise<{
  success: boolean;
  error?: string;
  user?: { id: string; email: string; username: string };
}> {
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.session) {
      return { success: false, error: error?.message || 'Failed to sign in' };
    }

    currentUser = {
      id: data.user.id,
      email: data.user.email!,
      username: data.user.user_metadata.username || data.user.email!.split('@')[0]
    };
    accessToken = data.session.access_token;
    
    // Store in localStorage
    localStorage.setItem('soulbound_user', JSON.stringify(currentUser));
    localStorage.setItem('soulbound_access_token', accessToken);

    console.log('✅ User signed in successfully:', email);
    return { success: true, user: currentUser };
  } catch (error) {
    console.error('Sign in error:', error);
    return { success: false, error: String(error) };
  }
}

// Sign out
export async function signOut(): Promise<void> {
  try {
    await supabaseClient.auth.signOut();
    currentUser = null;
    accessToken = null;
    
    // Clear localStorage
    localStorage.removeItem('soulbound_user');
    localStorage.removeItem('soulbound_access_token');
    
    console.log('✅ User signed out');
  } catch (error) {
    console.error('Sign out error:', error);
  }
}

// Check for existing session
export async function checkSession(): Promise<{
  isAuthenticated: boolean;
  user?: { id: string; email: string; username: string };
}> {
  try {
    // Try to get session from Supabase
    const { data: { session } } = await supabaseClient.auth.getSession();

    if (session && session.user) {
      currentUser = {
        id: session.user.id,
        email: session.user.email!,
        username: session.user.user_metadata.username || session.user.email!.split('@')[0]
      };
      accessToken = session.access_token;
      
      // Store in localStorage
      localStorage.setItem('soulbound_user', JSON.stringify(currentUser));
      localStorage.setItem('soulbound_access_token', accessToken);

      console.log('✅ Active session found:', currentUser.email);
      return { isAuthenticated: true, user: currentUser };
    }

    // Check localStorage as fallback
    const storedUser = localStorage.getItem('soulbound_user');
    const storedToken = localStorage.getItem('soulbound_access_token');

    if (storedUser && storedToken) {
      currentUser = JSON.parse(storedUser);
      accessToken = storedToken;
      console.log('✅ Session restored from localStorage');
      return { isAuthenticated: true, user: currentUser };
    }

    return { isAuthenticated: false };
  } catch (error) {
    console.error('Session check error:', error);
    return { isAuthenticated: false };
  }
}

// Get current user
export function getCurrentUser(): { id: string; email: string; username: string } | null {
  return currentUser;
}

// Get authorization header
function getAuthHeader(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`
  };
}

// Fetch all user data
export async function fetchUserData(): Promise<{
  quests: any[] | null;
  inventory: any[] | null;
  currencies: any | null;
  messages: any[] | null;
  flags: any | null;
}> {
  if (!currentUser) {
    throw new Error('No authenticated user');
  }

  try {
    const response = await fetch(`${API_BASE}/user/data?userId=${currentUser.id}`, {
      method: 'GET',
      headers: getAuthHeader()
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error fetching user data:', error);
      throw new Error('Failed to fetch user data');
    }

    const data = await response.json();
    console.log('📥 Loaded user data from cloud');
    return data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
}

// Save all user progress (comprehensive auto-save)
export async function saveUserProgress(data: {
  quests?: any[];
  inventory?: any[];
  currencies?: { mora: number; primogems: number; adventureExp: number };
  messages?: any[];
  flags?: { prologueWatched: boolean };
}): Promise<void> {
  if (!currentUser) {
    console.warn('Cannot save: No authenticated user');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/user/save`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        userId: currentUser.id,
        ...data
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error saving user progress:', error);
      return; // Don't throw - allow app to continue
    }

    console.log('💾 Auto-saved progress to cloud');
  } catch (error) {
    console.error('Failed to save user progress:', error);
    // Don't throw - allow app to continue working offline
  }
}

// Fetch global admin config (narratives, etc.)
export async function fetchGlobalConfig(): Promise<{
  narratives: { prologue: string; epilogue: string } | null;
  questTemplates: any[] | null;
  inventoryTemplates: any[] | null;
}> {
  try {
    const response = await fetch(`${API_BASE}/global/config`, {
      method: 'GET',
      headers: getAuthHeader()
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error fetching global config:', error);
      throw new Error('Failed to fetch global config');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch global config:', error);
    throw error;
  }
}

// Save narratives (admin only)
export async function saveNarratives(prologue: string, epilogue: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/global/narratives`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ prologue, epilogue })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error saving narratives:', error);
      throw new Error('Failed to save narratives');
    }
  } catch (error) {
    console.error('Failed to save narratives:', error);
    // Don't throw - allow app to continue working offline
  }
}

// Save global quest templates (admin only)
export async function saveGlobalQuests(quests: any[]): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/global/quests`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ quests })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error saving global quest templates:', error);
      throw new Error('Failed to save global quest templates');
    }
    console.log('✅ Global quest templates saved');
  } catch (error) {
    console.error('Failed to save global quest templates:', error);
  }
}

// Save global inventory templates (admin only)
export async function saveGlobalInventory(inventory: any[]): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/global/inventory`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ inventory })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error saving global inventory templates:', error);
      throw new Error('Failed to save global inventory templates');
    }
    console.log('✅ Global inventory templates saved');
  } catch (error) {
    console.error('Failed to save global inventory templates:', error);
  }
}

// Reset all user data
export async function resetUserData(): Promise<void> {
  if (!currentUser) {
    throw new Error('No authenticated user');
  }

  try {
    const response = await fetch(`${API_BASE}/user/reset`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ userId: currentUser.id })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Error resetting user data:', error);
      throw new Error('Failed to reset user data');
    }

    console.log('🔄 User data reset in cloud');
  } catch (error) {
    console.error('Failed to reset user data:', error);
    throw error;
  }
}