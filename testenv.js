import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '.env');

console.log('ENV File Path:', envPath);
console.log('ENV File Exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  const envContents = fs.readFileSync(envPath, 'utf8');
  console.log('ENV File Contents (BEGIN)');
  console.log(envContents);
  console.log('ENV File Contents (END)');
}

dotenv.config({ 
  path: envPath,
  debug: true  // Add debug mode
});

console.log('Loaded MONGO_URI:', process.env.MONGO_URI);
console.log('Loaded NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);