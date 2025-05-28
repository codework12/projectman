"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { Bell, Link, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { Notification, NotificationItem } from "./notification";
import { ThemeToggle } from "./ThemeToggle";
import CartDropdown from "./elab/CartDropdown";

export const Navbar = () => {
  const user = useAuth();

  // Example notification state (replace with real data/fetch in production)
  const [notifications, setNotifications] = React.useState<NotificationItem[]>([
    {
      id: 1,
      message: "Your appointment status changed to SCHEDULED.",
      type: "info",
      createdAt: new Date(),
    },
    {
      id: 2,
      message: "Appointment completed successfully!",
      type: "success",
      createdAt: new Date(),
    },
  ]);

  const handleClearNotifications = () => setNotifications([]);

  function formatPathName(): string {
    const pathname = usePathname();

    if (!pathname) return "Overview";

    const splitRoute = pathname.split("/");
    const lastIndex = splitRoute.length - 1 > 2 ? 2 : splitRoute.length - 1;

    const pathName = splitRoute[lastIndex];

    const formattedPath = pathName.replace(/-/g, " ");

    return formattedPath;
  }

  const path = formatPathName();

  return (
    <nav className="h-16 px-6 flex items-center justify-between bg-background/80 text-foreground backdrop-blur-md border-b border-border/50 relative group animate-fade-in">
      {/* Animated border bottom */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight font-sans bg-gradient-to-r from-emerald-600 via-teal-600 to-teal-700 bg-clip-text text-transparent capitalize animate-slide-in">
            {path || "Overview"}
          </span>
        </div>
      </div>
  
      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <div className="flex items-center animate-scale-in">
          <div className="w-10 h-10 flex items-center justify-center rounded-full border border-border/50 bg-card/50 shadow-sm hover:border-primary/40 hover:bg-card/80 transition-all duration-200">
            <ThemeToggle />
          </div>
        </div>

        {/* User Button */}
        {user?.userId && (
          <div className="flex items-center animate-scale-in [animation-delay:200ms]">
            <div className="w-10 h-10 rounded-full border border-border/50 bg-card/50 shadow-sm hover:border-primary/40 hover:bg-card/80 transition-all duration-200 flex items-center justify-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};