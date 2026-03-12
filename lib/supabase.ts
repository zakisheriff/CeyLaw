import { createClient } from "@supabase/supabase-js";

// MVP setup: Replace these placeholders with actual keys in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Initialize Supabase Client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Define strongly-typed database interfaces if needed
export type Database = {
  public: {
    Tables: {
      laws: {
        Row: {
          id: string;
          slug: string;
          title: string;
          short_title: string | null;
          year: number;
          act_number: string;
          category_id: string;
          description: string | null;
          full_text: string | null;
          source_url: string | null;
          source_name: string | null;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      law_sections: {
        Row: {
          id: string;
          law_id: string;
          section_number: string;
          heading: string;
          content: string;
          order_index: number;
          anchor_slug: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
        };
      }
    };
  };
};
