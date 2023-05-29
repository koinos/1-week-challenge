import { createClient } from '@supabase/supabase-js';
import { type Database } from 'schema';

/**
 * Create a Supabase client with the Auth context of the logged-in user.
 */
export function createSupabaseClient(req: Request): any {
  // Create a Supabase client with the Auth context of the logged-in user.
  return createClient<Database>(
    // Supabase API URL - env var exported by default.
    Deno.env.get('SUPABASE_URL') ?? '',
    // Supabase API ANON KEY - env var exported by default.
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    // Create client with Auth context of the user that called the function.
    // This way your row-level-security (RLS) policies are applied.
    {
      global: {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  );
}
