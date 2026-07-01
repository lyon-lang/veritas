import { NextResponse } from 'next/server';
import { UserModel } from '@/lib/models';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// Simple password hashing (for demo - use bcrypt in production)
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

// POST - Sign up
export async function POST(request: Request) {
  try {
    const { email, password, name, action } = await request.json();

    if (action === 'signup') {
      if (!email || !password || !name) {
        return NextResponse.json(
          { error: 'Email, password, and name are required' },
          { status: 400 }
        );
      }

      // Check if user exists
      const existingUser = UserModel.findByEmail(email) as any;
      if (existingUser) {
        return NextResponse.json(
          { error: 'Email already registered' },
          { status: 400 }
        );
      }

      // Create user
      const passwordHash = hashPassword(password);
      const user = UserModel.create(email, name, passwordHash);

      // Set cookie
      const cookieStore = await cookies();
      cookieStore.set('user_id', (user as any).id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({
        user: { id: (user as any).id, email, name },
        message: 'Account created successfully',
      });
    }

    if (action === 'login') {
      if (!email || !password) {
        return NextResponse.json(
          { error: 'Email and password are required' },
          { status: 400 }
        );
      }

      // Find user
      const user = UserModel.findByEmail(email) as any;
      if (!user) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Verify password
      if (!verifyPassword(password, user.password_hash)) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Set cookie
      const cookieStore = await cookies();
      cookieStore.set('user_id', user.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({
        user: { id: user.id, email: user.email, name: user.name },
        message: 'Logged in successfully',
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

// GET - Get current user
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('user_id')?.value;

    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const user = UserModel.findById(userId) as any;
    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
      },
    });
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ user: null });
  }
}

// DELETE - Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('user_id');

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
