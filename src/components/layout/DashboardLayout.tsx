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
    <div className={`bg-primary min-h-screen ${className}`}>
      {header}
      <div className="container mx-auto p-4">{children}</div>
    </div>
  );
}
