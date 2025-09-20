import { NextRequest, NextResponse } from 'next/server';
import User from '@/app/(api)/model/User';
import { connectDB } from '@/utils/db_connection';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { udiseCode, password } = body;

    // Validate required fields
    if (!udiseCode || !password) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'UDISE Code and password are required' 
        },
        { status: 400 }
      );
    }

    // Validate UDISE code format
    if (!/^\d{6,}$/.test(udiseCode)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'UDISE Code must be at least 6 digits' 
        },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Password must be at least 6 characters' 
        },
        { status: 400 }
      );
    }

    await connectDB();
    // Check if user already exists
    const existingUser = await User.findOne({ udiseCode });
    if (existingUser) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'User with this UDISE Code already exists' 
        },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = new User({
      udiseCode,
      password
    });

    await newUser.save();

    // Return success response (excluding password)
    return NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: newUser._id,
            udiseCode: newUser.udiseCode,
            created_date: newUser.created_date,
            updated_date: newUser.updated_date
          }
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('User registration error:', error);
    
    // Handle specific MongoDB errors
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'User with this UDISE Code already exists' 
          },
          { status: 409 }
        );
      }
      
      if (error.message.includes('validation')) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Validation error: ' + error.message 
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}
