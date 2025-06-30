import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-whole flex min-h-screen min-w-[1024px] items-center justify-center p-4">
      <Card className="bg-primary w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Image
              src="/title.svg"
              alt="Ai単 ~eitan~"
              width={250}
              height={12}
              className="animate-wiggle mb-1 ml-2"
            />
          </div>
        </CardHeader>

        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
