import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase'; // Fixed: should match your other files

const useUserRole = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRole = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('users') // This is correct based on your table structure
        .select('role')
        .eq('id', user.id)
        .single();

      if (!error && data) {
        setRole(data.role);
      }

      setLoading(false);
    };

    fetchRole();
  }, []);

  return { role, loading };
};

export default useUserRole;