
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cyndpgknwrgzchrkslpc.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bmRwZ2tud3JnemNocmtzbHBjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzNDU5MDMsImV4cCI6MjA2MDkyMTkwM30.UoOEy7xvXsX4FqO5ibtilBj_Vem2cF64TDDFoWwSI34';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
