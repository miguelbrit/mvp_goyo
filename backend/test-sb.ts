import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!);

async function test() {
  const { data, error } = await supabase.from('Pharmacy').select('*').limit(1);
  console.log("Pharmacy query:", {data, error});

  const { data: pData, error: pError } = await supabase.from('Patient').select('*').limit(1);
  console.log("Patient query:", {data: pData, error: pError});
}

test();
