import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SuperAdmin from '@/models/SuperAdmin';
import Member from '@/models/Member';
import Partner from '@/models/Partner';
import { comparePassword, generateToken } from '@/lib/auth';
import { handleApiError } from '@/lib/middleware';

export class AuthController {

  /**
   * Login superadmin, member, or partner
   */
  static async login(data: { email?: string; username?: string; password: string }) {
    try {
      await connectDB();

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
          const isPasswordValid = await comparePassword(data.password, partnerByEmail.password);
          if (isPasswordValid) {
            const token = generateToken({
              userId: partnerByEmail._id.toString(),
              email: partnerByEmail.hotelAddressEmail,
              role: 'partner',
              userType: 'partner'
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

      // If username provided, try to find as partner
      if (data.username) {
        const partner = await Partner.findOne({ username: data.username });
        if (partner) {
          // Verify password for partner
          const isPasswordValid = await comparePassword(data.password, partner.password);
          if (isPasswordValid) {
            // Generate token for partner
            const token = generateToken({
              userId: partner._id.toString(),
              email: partner.hotelAddressEmail,
              role: 'partner',
              userType: 'partner'
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
