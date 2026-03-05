import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
const supabaseUrl = "https://cjssonslxveyotrsdeln.supabase.co";

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqc3NvbnNseHZleW90cnNkZWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyNjU5ODksImV4cCI6MjA4Nzg0MTk4OX0.vJDSWe0PmpQIb2kpMA8ojXpCq1FJt-cILZNQQmkM2ds";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
