/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

/**
 * ARCHITECT DIAGNOSIS:
 * In Vite projects, client-side environment variables MUST be prefixed with VITE_.
 * Since this is a Vite project (not Next.js), variables like NEXT_PUBLIC_SUPABASE_URL
 * are not automatically exposed to the browser.
 */

const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || // Compatibility fallback
  '';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  '';

// Early Validation & Error Reporting
// if (!supabaseUrl || !supabaseAnonKey) {
//   const missing = [];
//   if (!supabaseUrl) missing.push("VITE_SUPABASE_URL");
//   if (!supabaseAnonKey) missing.push("VITE_SUPABASE_ANON_KEY");
  
//   const errorMessage = `
//     [Supabase Initialization Error]: Missing required environment variables: ${missing.join(', ')}.
//     In Vercel, ensuring you are using the VITE_ prefix for this Vite project.
//     Current Environment: ${import.meta.env.MODE}
//   `.trim();

//   console.error(errorMessage);
  
//   // In production, we don't want to crash silently, but supabase-js will throw if these are empty.
// }

// Enable session persistence for the browser environment
// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     persistSession: true,
//     autoRefreshToken: true,
//     detectSessionInUrl: true
//   }
// });
export const supabase = {} as any;

// Helper to check and set session from external token (e.g. from our custom API login)
export const syncSupabaseSession = async () => {
  const token = localStorage.getItem('token');
  if (token) {
    // const { data: { session } } = await supabase.auth.getSession();
    // if (!session || session.access_token !== token) {
    //   await supabase.auth.setSession({
    //     access_token: token,
    //     refresh_token: '', // Custom API doesn't provide refresh tokens usually
    //   });
    // }
    console.log("Mocked syncSupabaseSession called");
  }
};
