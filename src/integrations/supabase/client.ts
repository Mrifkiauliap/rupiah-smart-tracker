
// File ini dibuat secara otomatis. Jangan edit secara langsung.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://amojeqsppweifafcxjur.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtb2plcXNwcHdlaWZhZmN4anVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU4MjI3NzIsImV4cCI6MjA2MTM5ODc3Mn0.QoNTtrV3RslTyvVgCod71m3VM5Bbbvwac-A8o2zP8Fw";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
