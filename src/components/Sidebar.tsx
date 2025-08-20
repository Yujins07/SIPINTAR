"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard,
  Users,
  User,
  Building2,
  BookOpen,
  CalendarCheck2,
  BadgeCheck,
  BarChart3,
} from "lucide-react";
import { usePathname } from "next/navigation";

type SidebarProps = {
  sidebarOpen?: boolean;
  onCloseMobile?: () => void;
  onToggle?: () => void;
};

type NavItem = {
  href: string;
  label: string;
  title: string;
  icon: ReactNode;
};

export default function Sidebar({
  sidebarOpen = false,
  onCloseMobile,
  onToggle,
}: SidebarProps) {
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();

  // desktop expanded when hovered OR when parent sets sidebarOpen
  const expanded = sidebarOpen || hovered;

  const navItems: NavItem[] = [
    {
      href: "/dashboard/admin",
      label: "Dashboard",
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      href: "/dashboard/students",
      label: "Siswa",
      title: "Siswa",
      icon: <Users className="h-5 w-5" />,
    },
    {
      href: "/dashboard/teachers",
      label: "Guru",
      title: "Guru",
      icon: <User className="h-5 w-5" />,
    },
    {
      href: "/dashboard/classes",
      label: "Kelas",
      title: "Kelas",
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      href: "/dashboard/subjects",
      label: "Mata Pelajaran",
      title: "Mata Pelajaran",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      href: "/dashboard/attendance",
      label: "Absensi",
      title: "Absensi",
      icon: <CalendarCheck2 className="h-5 w-5" />,
    },
    {
      href: "/dashboard/grades",
      label: "Nilai",
      title: "Nilai",
      icon: <BadgeCheck className="h-5 w-5" />,
    },
    {
      href: "/dashboard/reports",
      label: "Laporan",
      title: "Laporan",
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ];

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <>
      {/* Desktop sidebar expands in place */}
      <aside
        className="hidden lg:block fixed inset-y-0 left-0 z-40"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => {
          // when collapsed, clicking should request parent to toggle open
          if (!expanded && onToggle) onToggle();
        }}
        role="button"
        aria-label="Toggle sidebar"
      >
        <div
          className={`h-full flex flex-col shadow-lg transition-all duration-300 ${expanded ? "w-64" : "w-16"
            }`}
          style={{ backgroundColor: "#0D1320" }}
        >
          {/* Header */}
          <div className="flex items-center h-16 overflow-hidden">
            <Image
              src="/Logo Geometris dengan Topi Wisuda.png"
              alt="SIPINTAR Logo"
              width={32}
              height={32}
              className="ml-4 flex-shrink-0"
            />
            <h1
              className={`ml-3 text-xl font-bold text-white transition-all duration-300 whitespace-nowrap ${expanded ? "opacity-100" : "opacity-0"
                }`}
            >
              SIPINTAR
            </h1>
          </div>
          {/* Navigation */}
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                title={item.title}
                className={`group flex items-center h-10 text-sm font-medium rounded-md transition-colors relative overflow-hidden ${isActive(item.href)
                    ? "bg-blue-800 bg-opacity-50 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 hover:text-white"
                  }`}
              >
                <span className="inline-flex h-6 w-6 items-center justify-center ml-3 flex-shrink-0">
                  {item.icon}
                </span>
                <span
                  className={`ml-3 transition-all duration-300 whitespace-nowrap ${expanded ? "opacity-100" : "opacity-0"
                    }`}
                >
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div
        className={`lg:hidden fixed inset-0 flex z-40 ${sidebarOpen ? "block" : "hidden"
          }`}
      >
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75"
          onClick={onCloseMobile}
        ></div>
        <div
          className="relative flex-1 flex flex-col max-w-xs w-full"
          style={{ backgroundColor: "#0D1320" }}
        >
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              onClick={onCloseMobile}
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div
              className="flex items-center flex-shrink-0 px-4 py-4"
              style={{ backgroundColor: "#0D1320" }}
            >
              <Image
                src="/Logo Geometris dengan Topi Wisuda.png"
                alt="SIPINTAR Logo"
                width={32}
                height={32}
                className="mr-3"
              />
              <h1 className="text-xl font-bold text-white">SIPINTAR</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.title}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive(item.href)
                      ? "bg-blue-800 bg-opacity-50 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:bg-opacity-50 hover:text-white"
                    }`}
                  onClick={onCloseMobile}
                >
                  {item.icon}
                  <span className="ml-3">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
