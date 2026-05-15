"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface LogoutButtonProps {
  variant?: "default" | "outline" | "ghost";
  className?: string;
  showIcon?: boolean;
}

export function LogoutButton({ 
  variant = "outline", 
  className,
  showIcon = true 
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        // Limpiar estados locales
        if (typeof window !== "undefined") {
          localStorage.removeItem("cart");
          sessionStorage.clear();
        }
        window.location.href = "/login?loggedOut=true";
      } else {
        throw new Error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
      // Fallback: redirect anyway
      window.location.href = "/login";
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleLogout}
      disabled={isLoading}
      className={cn(
        "transition-all duration-200",
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : showIcon ? (
        <LogOut className="w-4 h-4 mr-2" />
      ) : null}
      {isLoading ? "Saliendo..." : "Cerrar sesión"}
    </Button>
  );
}
