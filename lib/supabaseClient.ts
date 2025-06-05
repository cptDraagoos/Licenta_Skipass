// app/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://grnzkikoatcwcjimumne.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdybnpraWtvYXRjd2NqaW11bW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2OTM0MjcsImV4cCI6MjA2MjI2OTQyN30._WcyOCb8BeG-mjXsexDnAb0hS7Xm77ZWd2IyaZcAefM';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
