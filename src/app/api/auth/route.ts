import { NextResponse } from 'next/server';
import { UserModel } from '@/lib/models';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const SALT_LENGTH = 32;
const HASH_LENGTH = 64;
const ITERATIONS = 100000;

function generateSalt(): string {
  return crypto.randomBytes(SALT_LENGTH).toString('hex');
}

function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const actualSalt = salt || generateSalt();
  const hash = crypto.pbkdf2Sync(password, actualSalt, ITERATIONS, HASH_LENGTH, 'sha512').toString('hex');
  return { hash, salt: actualSalt };
}

function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  const { hash } = hashPassword(password, salt);
  const a = Buffer.from(hash, 'hex');
  const b = Buffer.from(storedHash, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function setAuthCookies(cookieStore: any, userId: string, csrfToken: string) {
  cookieStore.set('user_id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  cookieStore.set('csrf_token', csrfToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
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
      const { hash: passwordHash, salt } = hashPassword(password);
      const user = UserModel.create(email, name, `${salt}:${passwordHash}`);

      // Set cookies
      const cookieStore = await cookies();
      const csrfToken = generateCsrfToken();
      setAuthCookies(cookieStore, (user as any).id, csrfToken);

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
      if (!user.password_hash || !user.password_hash.includes(':')) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
      
      const [salt, storedHash] = user.password_hash.split(':');
      if (!salt || !storedHash || !verifyPassword(password, storedHash, salt)) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }

      // Set cookies
      const cookieStore = await cookies();
      const csrfToken = generateCsrfToken();
      setAuthCookies(cookieStore, user.id, csrfToken);

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
    cookieStore.delete('csrf_token');

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
