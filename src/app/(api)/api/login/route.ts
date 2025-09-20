import { NextRequest, NextResponse } from 'next/server';
import User from '@/app/(api)/model/User';
import { connectDB } from '@/utils/db_connection';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { udise_code, password } = body;

    if (!udise_code || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'UDISE Code and password are required' 
        },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ udiseCode: udise_code });

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid UDISE Code or Password' 
        },
        { status: 401 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid UDISE Code or Password' 
        },
        { status: 401 }
      );
    }

    // Update last login
    user.updated_date = new Date();
    await user.save();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            udiseCode: user.udiseCode,
            created_date: user.created_date,
            updated_date: user.updated_date
          }
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  const users = await User.find();
  return NextResponse.json(users);
}
