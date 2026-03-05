import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/config/env";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Health check function to verify connection
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("COUNT(*)", { count: "exact", head: true });
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Supabase connection failed:", error);
    return false;
  }
};
