"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

export default function AdminGuard({ children }) {
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [role, setRole] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: auth } = await supabase.auth.getUser();
        if (!auth?.user) {
          setAllowed(false);
          setReady(true);
          return;
        }
        const { data: isExec, error } = await supabase.rpc("is_executive", {
          uid: auth.user.id,
        });
        if (error) console.error(error);
        setRole(isExec ? "executive" : "member");
        setAllowed(!!isExec);
      } catch (e) {
        console.error("AdminGuard", e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) {
    return <div className="text-gray-500">Loading…</div>;
  }

  if (!allowed) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200 max-w-md">
        <h2 className="text-2xl font-bold text-red-700 mb-4">
          Access Restricted
        </h2>
        <p className="text-red-600 mb-2">
          You need executive privileges to access the admin panel.
        </p>
        <p className="text-sm text-gray-600">
          Current role:{" "}
          <span className="font-semibold capitalize">{role || "Unknown"}</span>
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
