import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ success: true });
  // Clear the auth cookie
  res.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
  return res;
}


