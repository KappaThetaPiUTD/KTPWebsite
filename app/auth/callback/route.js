import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request) {
  console.log('🔍 OAuth callback hit!', request.url)
  
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('📝 Code received:', code)

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    try {
      // Exchange the code for a session
      console.log('🔄 Exchanging code for session...')
      await supabase.auth.exchangeCodeForSession(code)
      
      // Check if user exists in your users table
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      console.log('👤 Auth user:', user?.email, user?.id)
      
      if (userError) {
        console.error('❌ Error getting user:', userError)
        return NextResponse.redirect(new URL('/login?error=auth_error', requestUrl.origin))
      }
      
      if (user) {
        const { data: userRecord, error: dbError } = await supabase
          .from('users')
          .select('id, role')
          .eq('id', user.id)
          .single()
        
        console.log('🗄️ Database user record:', userRecord)
        console.log('🗄️ Database error:', dbError)
        
        if (dbError || !userRecord) {
          // User doesn't exist in users table - sign them out and redirect to sign-up
          console.log('🚫 User not found in users table, signing out...')
          await supabase.auth.signOut()
          return NextResponse.redirect(new URL('/sign-in?error=account_not_found', requestUrl.origin))
        }
        
        // User exists - redirect to dashboard
        console.log('✅ User exists, redirecting to dashboard')
        return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
      }
    } catch (error) {
      console.error('💥 Callback error:', error)
      return NextResponse.redirect(new URL('/login?error=callback_error', requestUrl.origin))
    }
  }

  // If no code or other error, redirect to login
  console.log('🔄 No code, redirecting to login')
  return NextResponse.redirect(new URL('/login', requestUrl.origin))
}