"use client";

import { usePathname } from "next/navigation";

const PageTransition = ({ children }) => {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-fade">
      {children}
    </div>
  );
};

export default PageTransition;
