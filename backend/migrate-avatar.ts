import db from './src/config/database.ts';

// Add avatar_url column to existing users table
try {
  db.exec(`ALTER TABLE users ADD COLUMN avatar_url TEXT`);
  console.log('✅ Successfully added avatar_url column to users table');
} catch (error: any) {
  if (error.message.includes('duplicate column name')) {
    console.log('ℹ️  avatar_url column already exists');
  } else {
    console.error('❌ Error:', error.message);
  }
}

db.close();
