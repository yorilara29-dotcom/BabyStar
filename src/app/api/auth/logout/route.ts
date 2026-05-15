import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (session) {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('authjs.session-token');
    response.cookies.delete('__Secure-authjs.session-token');
    
    return response;
  }
  
  return NextResponse.json({ error: 'No session' }, { status: 401 });
}
