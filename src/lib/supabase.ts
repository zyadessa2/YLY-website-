import { createClient } from "@supabase/supabase-js";

// Validate environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
}

// Server-side only validation
if (typeof window === "undefined" && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable");
}

// Supabase URL and Keys
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Server-side only

// Client-side Supabase client (with RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  db: {
    schema: "public",
  },
  global: {
    headers: {
      "x-application-name": "yly-website",
    },
  },
});

// Server-side Supabase client (bypasses RLS for admin operations)
export const supabaseAdmin =
  typeof window === "undefined" && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        db: {
          schema: "public",
        },
        global: {
          headers: {
            "x-application-name": "yly-website-admin",
          },
        },
      })
    : null;

// Registration type for TypeScript
export interface Registration {
  id?: string;
  name: string;
  age: number;
  college: string;
  phone_number: string;
  another_phone_number?: string;
  national_id: string;
  email: string;
  committee: string;
  why_choose_committee?: string;
  where_know_about_us?: string;
  governorate: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  processed_at?: string;
}

export default supabase;
