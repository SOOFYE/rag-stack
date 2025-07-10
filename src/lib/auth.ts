'use client';

import { supabaseClient } from './supabaseClient';

export async function signUpWithEmail(email: string, password: string) {
  return await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: undefined, 
    },
  });
}

export async function signInWithGitHub() {
  return await supabaseClient.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo: `http://127.0.0.1:54321/auth/v1/callback`,
    },
  });
}

export async function signInWithEmail(email: string, password: string) {
  return await supabaseClient.auth.signInWithPassword({ email, password });
}

