"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, List, Settings } from "lucide-react";

const Navigation = () => {
  const pathname = usePathname();

  const navItems = [
    { name: "Tasks", href: "/", icon: <CheckSquare size={20} /> },
    { name: "Categories", href: "/categories", icon: <List size={20} /> },
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Settings", href: "/settings", icon: <Settings size={20} /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200 flex justify-around p-2 md:relative md:border-t-0 md:border-r md:w-64 md:flex-col md:justify-start md:gap-2 md:p-4 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="hidden md:block mb-8 px-2">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Pro Todo
        </h1>
      </div>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors md:flex-row md:justify-start md:gap-3 md:px-4 md:py-3 ${
              isActive
                ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400"
                : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
            }`}
          >
            {item.icon}
            <span className="text-xs md:text-base font-medium">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
