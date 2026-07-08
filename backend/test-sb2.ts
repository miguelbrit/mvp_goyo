import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config({ path: '../.env' }); // Adjusted path to root .env

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('Pharmacy')
    .select(`
      id,
      business_name,
      address,
      city,
      openingHours,
      closingHours,
      description,
      Profile (
        name,
        image_url,
        Patient (phone)
      )
    `)
    .limit(1);

  fs.writeFileSync('out.json', JSON.stringify({ data, error }, null, 2), 'utf8');
}
run();
