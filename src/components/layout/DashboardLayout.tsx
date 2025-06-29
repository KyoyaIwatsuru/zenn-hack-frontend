import React from "react";

interface DashboardLayoutProps {
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({
  header,
  children,
  className = "",
}: DashboardLayoutProps) {
  return (
    <div className={`bg-whole min-h-screen min-w-[1024px] ${className}`}>
      {header}
      <div className="container mx-auto min-w-[1024px] p-4">{children}</div>
    </div>
  );
}
