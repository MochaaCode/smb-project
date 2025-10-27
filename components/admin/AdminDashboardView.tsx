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
  <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-indigo-100 dark:bg-indigo-500/20 p-3 rounded-full flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
        {title}
      </p>
      <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
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
    <div className="space-y-6 md:space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
        Dashboard Admin
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Pengguna"
          value={totalUsers}
          icon={<Users className="text-indigo-500 h-5 w-5 sm:h-6 sm:w-6" />}
        />
        <StatCard
          title="Total Produk"
          value={totalProducts}
          icon={<Package className="text-indigo-500 h-5 w-5 sm:h-6 sm:w-6" />}
        />
        <StatCard
          title="Pesanan Pending"
          value={pendingOrdersCount}
          icon={
            <ClipboardList className="text-indigo-500 h-5 w-5 sm:h-6 sm:w-6" />
          }
        />
        <StatCard
          title="Absensi Hari Ini"
          value={attendanceToday}
          icon={<UserCheck className="text-indigo-500 h-5 w-5 sm:h-6 sm:w-6" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Komposisi Pengguna
          </h2>
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
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-white">
            Aktivitas Pesanan (7 Hari Terakhir)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={weeklyActivity}
              margin={{ top: 5, right: 0, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />{" "}
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                dataKey="count"
                fill="#82ca9d"
                name="Jumlah Pesanan"
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
