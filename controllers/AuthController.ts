import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SuperAdmin from '@/models/SuperAdmin';
import Member from '@/models/Member';
import Partner from '@/models/Partner';
import PartnerMember from '@/models/PartnerMember';
import Staff from '@/models/Staff';
import { comparePassword, generateToken } from '@/lib/auth';
import { handleApiError } from '@/lib/middleware';

export class AuthController {

  /**
   * Login superadmin, member, partner, partner member, or partner staff
   * Partner members and staff are automatically scoped to their partnerId
   */
  static async login(data: { email?: string; username?: string; password: string }) {
    try {
      await connectDB();
      
      console.log('🔐 Login attempt:', { 
        hasEmail: !!data.email, 
        hasUsername: !!data.username,
        email: data.email,
        username: data.username
      });

      // First, try to find as superadmin (by email)
      if (data.email) {
        const superAdmin = await SuperAdmin.findOne({ email: data.email });
        if (superAdmin) {
          // Verify password for superadmin
          const isPasswordValid = await comparePassword(data.password, superAdmin.password);
          if (isPasswordValid) {
            // Generate token for superadmin
            const token = generateToken({
              userId: superAdmin._id.toString(),
              email: superAdmin.email,
              role: superAdmin.role,
              userType: 'superadmin'
            });

            const res = NextResponse.json({
              message: 'Login successful',
              token,
              user: superAdmin.toJSON(),
              userType: 'superadmin'
            });
            res.cookies.set('auth_token', token, {
              httpOnly: true,
              secure: true,
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 60 * 24 * 7,
            });
            return res;
          }
        }

        // If not found as superadmin or password doesn't match, try as member (by email)
        const member = await Member.findOne({ email: data.email });
        if (member) {
          // Verify password for member using the member's comparePassword method
          const isPasswordValid = await member.comparePassword(data.password);
          if (isPasswordValid) {
            // Generate token for member (include permissions)
            const token = generateToken({
              userId: member._id.toString(),
              email: member.email,
              role: 'member',
              userType: 'member',
              permissions: Array.isArray(member.permissions) ? member.permissions : [],
            });

            const res = NextResponse.json({
              message: 'Login successful',
              token,
              user: member.toJSON(),
              userType: 'member'
            });
            res.cookies.set('auth_token', token, {
              httpOnly: true,
              secure: true,
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 60 * 24 * 7,
            });
            return res;
          }
        }

        // If not found as member, try as partner by hotel email using the same email field
        const partnerByEmail = await Partner.findOne({ hotelAddressEmail: data.email.toLowerCase() });
        if (partnerByEmail) {
          // Check if partner is active
          if (partnerByEmail.status !== 'active') {
            return NextResponse.json(
              { error: 'Account is disabled. Please contact your administrator.' },
              { status: 403 }
            );
          }

          const isPasswordValid = await comparePassword(data.password, partnerByEmail.password);
          if (isPasswordValid) {
            const token = generateToken({
              userId: partnerByEmail._id.toString(),
              email: partnerByEmail.hotelAddressEmail,
              role: 'partner',
              userType: 'partner',
              hotelName: partnerByEmail.hotelName
            });

            const res = NextResponse.json({
              message: 'Login successful',
              token,
              user: partnerByEmail.toJSON(),
              userType: 'partner'
            });
            res.cookies.set('auth_token', token, {
              httpOnly: true,
              secure: true,
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 60 * 24 * 7,
            });
            return res;
          }
        }
      }

      // If username provided, try to find as partner, partner member, or partner staff
      if (data.username) {
        // First try partner
        const partner = await Partner.findOne({ username: data.username });
        if (partner) {
          // Check if partner is active
          if (partner.status !== 'active') {
            return NextResponse.json(
              { error: 'Account is disabled. Please contact your administrator.' },
              { status: 403 }
            );
          }

          // Verify password for partner
          const isPasswordValid = await comparePassword(data.password, partner.password);
          if (isPasswordValid) {
            // Generate token for partner
            const token = generateToken({
              userId: partner._id.toString(),
              email: partner.hotelAddressEmail,
              role: 'partner',
              userType: 'partner',
              hotelName: partner.hotelName
            });

            const res = NextResponse.json({
              message: 'Login successful',
              token,
              user: partner.toJSON(),
              userType: 'partner'
            });
            res.cookies.set('auth_token', token, {
              httpOnly: true,
              secure: true,
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 60 * 24 * 7,
            });
            return res;
          }
        }

        // Try partner member by username
        const partnerMember = await PartnerMember.findOne({ username: data.username });
        if (partnerMember) {
          // Check if member is active
          if (partnerMember.status !== 'active') {
            return NextResponse.json(
              { error: 'Account is disabled. Please contact your administrator.' },
              { status: 403 }
            );
          }

          // Verify password for partner member
          const isPasswordValid = await partnerMember.comparePassword(data.password);
          if (isPasswordValid) {
            // Generate token for partner member (include partnerId and permissions)
            const token = generateToken({
              userId: String(partnerMember._id),
              email: partnerMember.email,
              role: partnerMember.role || 'partnermember',
              userType: 'partnermember',
              partnerId: partnerMember.partnerId,
              permissions: partnerMember.permissions,
            });

            const res = NextResponse.json({
              message: 'Login successful',
              token,
              user: partnerMember.toJSON(),
              userType: 'partnermember'
            });
            res.cookies.set('auth_token', token, {
              httpOnly: true,
              secure: true,
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 60 * 24 * 7,
            });
            return res;
          }
        }

        // Try partner staff by username
        const partnerStaff = await Staff.findOne({ username: data.username });
        if (partnerStaff) {
          // Check if staff is active
          if (partnerStaff.status !== 'active') {
            return NextResponse.json(
              { error: 'Account is disabled. Please contact your administrator.' },
              { status: 403 }
            );
          }

          // Verify password for partner staff
          const isPasswordValid = await partnerStaff.comparePassword(data.password);
          if (isPasswordValid) {
            // Generate token for partner staff (include partnerId)
            const token = generateToken({
              userId: String(partnerStaff._id),
              email: partnerStaff.email,
              role: partnerStaff.role, // Use actual role from database
              userType: 'partnerstaff',
              partnerId: partnerStaff.partnerId,
            });

            const res = NextResponse.json({
              message: 'Login successful',
              token,
              user: partnerStaff.toJSON(),
              userType: 'partnerstaff'
            });
            res.cookies.set('auth_token', token, {
              httpOnly: true,
              secure: true,
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 60 * 24 * 7,
            });
            return res;
          }
        }
      }

      // Also check email for partner members and staff
      if (data.email) {
        // Try partner member by email
        const partnerMemberByEmail = await PartnerMember.findOne({ email: data.email.toLowerCase() });
        console.log('🔍 Partner member by email search:', { 
          email: data.email.toLowerCase(), 
          found: !!partnerMemberByEmail,
          status: partnerMemberByEmail?.status 
        });
        if (partnerMemberByEmail) {
          // Check if member is active
          if (partnerMemberByEmail.status !== 'active') {
            return NextResponse.json(
              { error: 'Account is disabled. Please contact your administrator.' },
              { status: 403 }
            );
          }

          // Verify password for partner member
          const isPasswordValid = await partnerMemberByEmail.comparePassword(data.password);
          console.log('🔐 Partner member password check:', { isPasswordValid });
          if (isPasswordValid) {
            // Generate token for partner member (include partnerId and permissions)
            const token = generateToken({
              userId: String(partnerMemberByEmail._id),
              email: partnerMemberByEmail.email,
              role: partnerMemberByEmail.role || 'partnermember',
              userType: 'partnermember',
              partnerId: partnerMemberByEmail.partnerId,
              permissions: partnerMemberByEmail.permissions,
            });

            const res = NextResponse.json({
              message: 'Login successful',
              token,
              user: partnerMemberByEmail.toJSON(),
              userType: 'partnermember'
            });
            res.cookies.set('auth_token', token, {
              httpOnly: true,
              secure: true,
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 60 * 24 * 7,
            });
            return res;
          }
        }

        // Try partner staff by email
        const partnerStaffByEmail = await Staff.findOne({ email: data.email.toLowerCase() });
        console.log('🔍 Partner staff by email search:', { 
          email: data.email.toLowerCase(), 
          found: !!partnerStaffByEmail,
          status: partnerStaffByEmail?.status 
        });
        if (partnerStaffByEmail) {
          // Check if staff is active
          if (partnerStaffByEmail.status !== 'active') {
            return NextResponse.json(
              { error: 'Account is disabled. Please contact your administrator.' },
              { status: 403 }
            );
          }

          // Verify password for partner staff
          const isPasswordValid = await partnerStaffByEmail.comparePassword(data.password);
          console.log('🔐 Partner staff password check:', { isPasswordValid });
          if (isPasswordValid) {
            // Generate token for partner staff (include partnerId)
            const token = generateToken({
              userId: String(partnerStaffByEmail._id),
              email: partnerStaffByEmail.email,
              role: partnerStaffByEmail.role, // Use actual role from database
              userType: 'partnerstaff',
              partnerId: partnerStaffByEmail.partnerId,
            });

            const res = NextResponse.json({
              message: 'Login successful',
              token,
              user: partnerStaffByEmail.toJSON(),
              userType: 'partnerstaff'
            });
            res.cookies.set('auth_token', token, {
              httpOnly: true,
              secure: true,
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 60 * 24 * 7,
            });
            return res;
          }
        }
      }

      // If no user found or password doesn't match
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    } catch (error) {
      return handleApiError(error, 'Failed to login');
    }
  }

}
