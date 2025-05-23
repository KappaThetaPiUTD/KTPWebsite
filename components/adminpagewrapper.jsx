"use client";

import React, { useEffect, useState } from 'react';
import { getUserRole } from '../../lib/rbac';

export default function AdminPageWrapper({ children }) {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      try {
        const { role, error } = await getUserRole();
        if (!error) {
          setUserRole(role);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error checking user role:', error);
        setLoading(false);
      }
    };

    checkRole();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // If user is not an executive, show access restricted message
  if (userRole !== 'executive') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200 max-w-md">
          <h2 className="text-2xl font-bold text-red-700 mb-4">Access Restricted</h2>
          <p className="text-red-600 mb-4">
            You need executive privileges to access the admin panel.
          </p>
          <p className="text-sm text-gray-600">
            Current role: <span className="font-semibold capitalize">{userRole || 'Unknown'}</span>
          </p>
        </div>
      </div>
    );
  }

  // If user is an executive, render the actual admin page content
  return <>{children}</>;
}