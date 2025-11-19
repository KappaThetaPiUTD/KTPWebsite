// For App Router (/app/api/contact/route.js)
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phoneNumber, message } = body;
    
    // Add logging to see what's happening
    console.log('Received form data:', body);
    
    // Your email sending logic here
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' }, 
      { status: 500 }
    );
  }
}