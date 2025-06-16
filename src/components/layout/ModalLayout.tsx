import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModalLayoutProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
  titleClassName?: string;
}

export function ModalLayout({
  isOpen,
  onOpenChange,
  title,
  children,
  contentClassName = "sm:max-w-md",
  titleClassName = "text-custom",
}: ModalLayoutProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={contentClassName}>
        <DialogHeader>
          <DialogTitle className={titleClassName}>
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}