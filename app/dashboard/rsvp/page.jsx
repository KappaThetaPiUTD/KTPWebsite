"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import Sidebar from '../../components/Sidebar'; // adjust path if needed
import { useRouter } from 'next/navigation';

export default function RSVPPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        router.push('/login');
      } else {
        setUser(data.user);
        setLoading(false);
      }
    };
    getUser();
  }, [router]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.email}!</h1>

        <div className="bg-white rounded-xl p-4 shadow-md">
          <h2 className="text-xl font-semibold mb-2">RSVP Page</h2>
          <p>Select your events and let us know you're coming.</p>

          {/* Add your RSVP form or component here */}
        </div>
      </div>
    </div>
  );
}
