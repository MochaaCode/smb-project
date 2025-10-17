"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { Users, Package, ClipboardList, UserCheck } from "lucide-react";
import type {
  UserRoleData,
  WeeklyActivityData,
} from "@/app/(admin)/admin/dashboard/page";

type AdminDashboardData = {
  totalUsers: number;
  totalProducts: number;
  pendingOrdersCount: number;
  userRoleDistribution: UserRoleData[];
  weeklyActivity: WeeklyActivityData[];
};

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </p>
    </div>
  </div>
);

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

export default function AdminDashboardView({
  data,
}: {
  data: AdminDashboardData;
}) {
  const {
    totalUsers,
    totalProducts,
    pendingOrdersCount,
    userRoleDistribution,
    weeklyActivity,
  } = data;
  const attendanceToday = 0;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Dashboard Admin
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Pengguna"
          value={totalUsers}
          icon={<Users className="text-indigo-500" />}
        />
        <StatCard
          title="Total Produk"
          value={totalProducts}
          icon={<Package className="text-indigo-500" />}
        />
        <StatCard
          title="Pesanan Pending"
          value={pendingOrdersCount}
          icon={<ClipboardList className="text-indigo-500" />}
        />
        <StatCard
          title="Absensi Hari Ini"
          value={attendanceToday}
          icon={<UserCheck className="text-indigo-500" />}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Komposisi Pengguna</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userRoleDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name} ${((percent as number) * 100).toFixed(0)}%`
                }
              >
                {userRoleDistribution.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Aktivitas Pesanan (7 Hari Terakhir)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" name="Jumlah Pesanan" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
