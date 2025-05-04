import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sxceisgukgpngvojidlg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2Vpc2d1a2dwbmd2b2ppZGxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxNDMwMjcsImV4cCI6MjA2MTcxOTAyN30.PkJV18Bj2MovRZnhVhXVuvx_e1YnD3FSxGYSRk9Fr4o';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Ideal seria user .env numa aplicação real