import dotenv from 'dotenv';

dotenv.config();

console.log('\n🔍 Checking Environment Variables...\n');

const requiredVars = [
  'MONGODB_URI',
  'LINKEDIN_CLIENT_ID',
  'LINKEDIN_CLIENT_SECRET',
  'LINKEDIN_CALLBACK_URL',
  'FRONTEND_URL',
  'SESSION_SECRET',
  'JWT_SECRET'
];

let allPresent = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Mask sensitive values
    const displayValue = ['SECRET', 'URI', 'PASSWORD'].some(s => varName.includes(s))
      ? value.substring(0, 10) + '...'
      : value;
    console.log(`✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`❌ ${varName}: MISSING`);
    allPresent = false;
  }
});

console.log('\n');

if (allPresent) {
  console.log('✅ All required environment variables are set!\n');
} else {
  console.log('❌ Some environment variables are missing. Please check your .env file.\n');
  console.log('📝 Copy .env.example to .env and fill in the values.\n');
}
