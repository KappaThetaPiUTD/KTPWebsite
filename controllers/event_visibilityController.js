export const canUserSeeEvent = (userRole, eventVisibility) => {
    // Executive members can see everything
    if (userRole?.toLowerCase() === 'executive') {
      return true;
    }
  
    // Check visibility rules for other roles
    switch (eventVisibility) {
      case 'brothers_only':
        return userRole?.toLowerCase() === 'brother';
      
      case 'pledges_only':
        return userRole?.toLowerCase() === 'pledge';
      
      case 'brothers_and_pledges':
        return ['brother', 'pledge'].includes(userRole?.toLowerCase());
      
      default:
        // Default to showing if visibility is not set (backward compatibility)
        return true;
    }
  };
  
  export const filterEventsForUser = (events, userRole) => {
    return events.filter(event => canUserSeeEvent(userRole, event.visibility));
  };
  
  // Helper to get user role from Supabase
  export const getCurrentUserRole = async (supabase) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        return null;
      }
  
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();
  
      if (error || !data) {
        console.error('Error fetching user role:', error);
        return null;
      }
  
      return data.role;
    } catch (error) {
      console.error('Error getting user role:', error);
      return null;
    }
  };