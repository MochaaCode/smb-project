"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCog,
  Package,
  School,
  FileText,
  ClipboardList,
  LogOut,
  School2,
} from "lucide-react";
import { signOut } from "@/actions/authActions";

type SidebarProps = {
  role: "admin" | "guru" | "siswa" | null;
};

const allMenuItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "guru"],
  },
  {
    name: "Konten Acara",
    href: "/admin/content",
    icon: FileText,
    roles: ["admin", "guru"],
  },
  {
    name: "Manajemen Kelas",
    href: "/admin/classes",
    icon: School2,
    roles: ["admin"],
  },
  {
    name: "Manajemen Pengguna",
    href: "/admin/profiles",
    icon: UserCog,
    roles: ["admin"],
  },
  {
    name: "Manajemen Produk",
    href: "/admin/products",
    icon: Package,
    roles: ["admin"],
  },
  {
    name: "Manajemen Pesanan",
    href: "/admin/orders",
    icon: ClipboardList,
    roles: ["admin"],
  },
  {
    name: "Kelas Saya",
    href: "/admin/kelas-saya",
    icon: School2,
    roles: ["guru"],
  },
];

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = allMenuItems.filter((item) =>
    item.roles.includes(role || "")
  );

  return (
    <aside className="w-72 flex-shrink-0 bg-gray-800 text-white flex flex-col">
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-700">
        <School className="h-8 w-8 mr-2 text-indigo-400" />
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 py-4">
          <ul>
            {menuItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-3 my-1 rounded-lg transition-colors ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      <div className="p-4 border-t border-gray-700">
        <form action={signOut}>
          <button className="w-full flex items-center px-3 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
