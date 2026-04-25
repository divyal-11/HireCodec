const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log("Generating SQL from Prisma Schema...");
  const sql = execSync('npx prisma@5.22.0 migrate diff --from-empty --to-schema-datamodel packages/db/prisma/schema.prisma --script', { encoding: 'utf-8' });
  fs.writeFileSync('database_setup.sql', sql, 'utf-8');
  console.log("✅ Success! SQL saved to database_setup.sql");
} catch (error) {
  console.error("❌ Failed to generate SQL:", error.message);
  if (error.stdout) console.error(error.stdout);
  if (error.stderr) console.error(error.stderr);
}
