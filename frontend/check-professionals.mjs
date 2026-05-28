import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve('.env.local');
let supabaseUrl = '';
let supabaseKey = '';

try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
  const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=(.+)/) || envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
  
  if (urlMatch) supabaseUrl = urlMatch[1].trim();
  if (keyMatch) supabaseKey = keyMatch[1].trim();
} catch (e) {
  console.error('Error reading .env.local:', e);
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key could not be loaded.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProfessionals() {
  const tables = ['User', 'Customer', 'Professional', 'Category', 'Review'];
  for (const table of tables) {
    console.log(`Querying table "${table}"...`);
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(1);

    if (error) {
      console.error(`Error querying "${table}":`, error.message);
    } else {
      console.log(`Table "${table}" exists! Found ${data.length} records.`);
    }
  }
}

checkProfessionals();
