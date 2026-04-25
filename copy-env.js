const fs = require('fs');
const path = require('path');

const rootEnv = path.join(__dirname, '.env');
const webEnv = path.join(__dirname, 'apps', 'web', '.env');

try {
  const envContent = fs.readFileSync(rootEnv, 'utf-8');
  fs.writeFileSync(webEnv, envContent, 'utf-8');
  console.log("Successfully copied .env to apps/web/.env");
} catch(e) {
  console.error("Failed to copy:", e.message);
}
