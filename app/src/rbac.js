import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Get current session's user's role
export const getUserRole = async () => {
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession()

  if (sessionError || !session?.user) {
    return { role: null, error: 'No user session found.' }
  }

  const userId = session.user.id

  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single()

  if (error || !data) {
    return { role: null, error: 'Role not found in users table.' }
  }

  return { role: data.role, error: null }
}

// RBAC check helper
export const hasRole = async (allowedRoles = []) => {
  const { role, error } = await getUserRole()
  if (error) return false
  return allowedRoles.includes(role)
}
