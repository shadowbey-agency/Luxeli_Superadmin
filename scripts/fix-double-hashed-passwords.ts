/**
 * Script to fix double-hashed passwords for Partner Members and Staff
 * 
 * This script resets passwords for all partner members and staff created
 * with the old double-hashing bug. Run this to fix existing accounts.
 * 
 * Usage:
 * 1. Update the DEFAULT_PASSWORD below or provide individual passwords
 * 2. Run: npx ts-node scripts/fix-double-hashed-passwords.ts
 */

import connectDB from '@/lib/db';
import PartnerMember from '@/models/PartnerMember';
import Staff from '@/models/Staff';

// Default password for all accounts (change this if needed)
const DEFAULT_PASSWORD = 'password123';

async function fixDoubleHashedPasswords() {
  try {
    await connectDB();
    console.log('✅ Connected to database\n');

    // Get all partner members
    const members = await PartnerMember.find({});
    console.log(`📋 Found ${members.length} partner members`);

    // Reset each member's password
    for (const member of members) {
      try {
        // Directly set the plain password - the pre-save hook will hash it properly
        member.password = DEFAULT_PASSWORD;
        await member.save();
        console.log(`✅ Fixed password for partner member: ${member.email} (${member.username})`);
      } catch (error) {
        console.error(`❌ Failed to fix password for ${member.email}:`, error);
      }
    }

    console.log('');

    // Get all staff
    const staff = await Staff.find({});
    console.log(`📋 Found ${staff.length} staff members`);

    // Reset each staff's password
    for (const s of staff) {
      try {
        // Directly set the plain password - the pre-save hook will hash it properly
        s.password = DEFAULT_PASSWORD;
        await s.save();
        console.log(`✅ Fixed password for staff: ${s.email} (${s.username})`);
      } catch (error) {
        console.error(`❌ Failed to fix password for ${s.email}:`, error);
      }
    }

    console.log('\n🎉 Password reset complete!');
    console.log(`\n⚠️  All accounts now have password: "${DEFAULT_PASSWORD}"`);
    console.log('📢 Please tell users to change their passwords after logging in.\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
}

fixDoubleHashedPasswords();

