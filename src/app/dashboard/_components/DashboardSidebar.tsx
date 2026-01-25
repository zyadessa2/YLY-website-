"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { authService } from "@/lib/api/auth.service";
import { Button } from "@/components/ui/button";
import {
  Home,
  Newspaper,
  Calendar,
  Plus,
  LogOut,
  Menu,
  X,
  MessageSquare,
  Users,
  MapPin,
  Settings,
  UserPlus,
  Eye,
  Map,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href?: string;
  icon: React.ElementType;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "News Management",
    icon: Newspaper,
    children: [
      {
        name: "All News",
        href: "/dashboard/news",
        icon: Newspaper,
      },
      {
        name: "Add News",
        href: "/dashboard/news/add",
        icon: Plus,
      },
      {
        name: "Comments",
        href: "/dashboard/comments",
        icon: MessageSquare,
      },
    ],
  },
  {
    name: "Events Management",
    icon: Calendar,
    children: [
      {
        name: "All Events",
        href: "/dashboard/events",
        icon: Calendar,
      },
      {
        name: "Add Event",
        href: "/dashboard/events/add",
        icon: Plus,
      },
    ],
  },
  {
    name: "Users Management",
    icon: Users,
    children: [
      {
        name: "All Users",
        href: "/dashboard/users",
        icon: Eye,
      },
      {
        name: "Add User",
        href: "/dashboard/users/add",
        icon: UserPlus,
      },
    ],
  },
  {
    name: "Governorates",
    icon: MapPin,
    children: [
      {
        name: "All Governorates",
        href: "/dashboard/governorates",
        icon: Map,
      },
      {
        name: "Add Governorate",
        href: "/dashboard/governorates/add",
        icon: Plus,
      },
    ],
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
] as const;

export default function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "News Management",
    "Events Management",
    "Users Management",
    "Governorates",
    "Database",
  ]);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
      router.push("/signin");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even on error
      router.push("/signin");
      router.refresh();
    }
  };

  const toggleExpanded = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((item) => item !== itemName)
        : [...prev, itemName]
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-900">YLY Dashboard</h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="lg:hidden"
          >
            {isCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isExpanded = expandedItems.includes(item.name);
            const hasChildren = item.children && item.children.length > 0;

            if (hasChildren) {
              return (
                <div key={item.name}>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-5 w-5" />
                      {!isCollapsed && <span>{item.name}</span>}
                    </div>
                    {!isCollapsed && (
                      <svg
                        className={cn(
                          "h-4 w-4 transition-transform",
                          isExpanded ? "rotate-90" : "rotate-0"
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </button>

                  {isExpanded && !isCollapsed && (
                    <div className="ml-8 mt-1 space-y-1">
                      {item.children?.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href || "#"}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-md transition-colors",
                            pathname === child.href
                              ? "bg-primary text-primary-foreground"
                              : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          )}
                        >
                          <child.icon className="mr-3 h-4 w-4" />
                          <span>{child.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <Link
                key={item.name}
                href={item.href || "#"}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="mr-3 h-5 w-5" />
            {!isCollapsed && <span>Logout</span>}
          </Button>
        </div>
      </div>
    </>
  );
}
