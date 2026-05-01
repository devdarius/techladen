const fs = require('fs');
const { execSync } = require('child_process');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const lines = envContent.split('\n');

for (const line of lines) {
  if (!line || line.trim().startsWith('#') || !line.includes('=')) continue;
  
  const firstEqIdx = line.indexOf('=');
  const key = line.substring(0, firstEqIdx).trim();
  let value = line.substring(firstEqIdx + 1).trim();

  // If value has quotes, we should be careful, but echo/stdin handles it ok if we just pass the raw value
  // Actually, Vercel CLI allows `echo <value> | vercel env add <key> production`
  // But Windows Command Prompt handles echo differently, so we'll use `vercel env rm` first, then `vercel env add`
  
  console.log(`Updating ${key}...`);
  try {
    // Remove if exists
    execSync(`npx vercel env rm ${key} production --yes`, { stdio: 'ignore' });
  } catch(e) {}
  
  try {
    // Add the new value
    // On Windows, child_process.execSync runs in cmd.exe. 
    // To safely pass multi-line or quote strings (like FIREBASE_SERVICE_ACCOUNT_JSON),
    // it's safest to write the value to a temporary file, then do `type temp.txt | npx vercel env add KEY production`
    fs.writeFileSync('temp.txt', value);
    execSync(`type temp.txt | npx vercel env add ${key} production`, { stdio: 'pipe' });
    console.log(`✓ Set ${key}`);
  } catch(e) {
    console.error(`✗ Failed to set ${key}: ` + e.message);
  }
}

if (fs.existsSync('temp.txt')) {
  fs.unlinkSync('temp.txt');
}
console.log('Done uploading envs. Triggering redeploy...');
execSync('npx vercel --prod', { stdio: 'inherit' });
