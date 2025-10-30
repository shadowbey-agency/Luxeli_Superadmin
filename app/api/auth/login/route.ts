import { NextRequest } from 'next/server';
import { AuthController } from '@/controllers/AuthController';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password } = body;

    // Validate required fields
    if (!password || (!email && !username)) {
      return Response.json(
        { error: 'Email/username and password are required' },
        { status: 400 }
      );
    }

    // Validate email format if email is provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return Response.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
    }

    return await AuthController.login({ email, username, password });
  } catch (error) {
    console.error('Login API Error:', error);
    return Response.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
