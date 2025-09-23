"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/Store/auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { AdminOnly } from "@/components/RoleProtection";
import { 
  Users, 
  GraduationCap, 
  Star, 
  TrendingUp, 
  UserPlus, 
  BarChart3,
  FileText,
  Settings
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalTeachers: number;
  totalStudents: number;
  totalAdmins: number;
  totalFeedbacks: number;
  totalTeachersInDirectory: number;
  recentUsers: number;
  recentFeedbacks: number;
  averageRating: number;
}

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/Login");
      return;
    }
    fetchDashboardStats();
  }, [user, router]);

  const fetchDashboardStats = async () => {
    try {
      console.log("Fetching admin dashboard stats...");
      console.log("Token:", token);
      const response = await axios.get("http://localhost:5001/api/admin-dashboard/dashboard/stats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Admin dashboard stats response:", response.data);
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      if (error.response) {
        console.error("Error response:", error.response.data);
        console.error("Error status:", error.response.status);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "bg-blue-500",
      change: `+${stats?.recentUsers || 0} this week`
    },
    {
      title: "Teachers",
      value: stats?.totalTeachers || 0,
      icon: GraduationCap,
      color: "bg-green-500",
      change: `${stats?.totalTeachersInDirectory || 0} in directory`
    },
    {
      title: "Students",
      value: stats?.totalStudents || 0,
      icon: Users,
      color: "bg-purple-500",
      change: "Active users"
    },
    {
      title: "Total Feedback",
      value: stats?.totalFeedbacks || 0,
      icon: Star,
      color: "bg-yellow-500",
      change: `+${stats?.recentFeedbacks || 0} this week`
    },
    {
      title: "Average Rating",
      value: stats?.averageRating ? stats.averageRating.toFixed(1) : "0.0",
      icon: TrendingUp,
      color: "bg-orange-500",
      change: "Across all teachers"
    }
  ];

  const quickActions = [
    {
      title: "Add Teacher",
      description: "Add new teacher to the system",
      icon: UserPlus,
      href: "/Admin/AddTeacher",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "View All Teachers",
      description: "Manage teacher directory",
      icon: GraduationCap,
      href: "/Admin/Teachers",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "View All Feedback",
      description: "Monitor all feedback and ratings",
      icon: FileText,
      href: "/Admin/Feedback",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      title: "Generate Reports",
      description: "Create detailed analytics reports",
      icon: BarChart3,
      href: "/Admin/Reports",
      color: "bg-orange-500 hover:bg-orange-600"
    },
    {
      title: "User Management",
      description: "Manage all system users",
      icon: Settings,
      href: "/Admin/Users",
      color: "bg-gray-500 hover:bg-gray-600"
    }
  ];

  return (
    <AdminOnly>
      <div className="min-h-screen bg-gradient-to-r from-blue-900 to-teal-600 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-lg md:text-xl text-gray-100">Welcome back, {user?.userName}! Manage your feedback system.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg p-6 hover:scale-105 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-200">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                  <p className="text-xs text-gray-300 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <stat.icon className="h-6 w-6 text-gray-100" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`${action.color} text-gray-100 p-6 rounded-3xl transition-all duration-200 hover:shadow-lg hover:scale-105 block`}
              >
                <div className="flex items-center mb-3">
                  <action.icon className="h-8 w-8 mr-3" />
                  <h3 className="text-lg font-semibold">{action.title}</h3>
                </div>
                <p className="text-sm opacity-90">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* System Overview */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">System Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/5 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-100 mb-4">Platform Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-200">Total System Users</span>
                  <span className="font-bold text-gray-100 text-lg">{stats?.totalUsers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-200">Active Teachers</span>
                  <span className="font-bold text-gray-100 text-lg">{stats?.totalTeachersInDirectory || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-200">Total Feedback Given</span>
                  <span className="font-bold text-gray-100 text-lg">{stats?.totalFeedbacks || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-200">Average Rating</span>
                  <span className="font-bold text-gray-100 text-lg">{stats?.averageRating ? stats.averageRating.toFixed(1) : "0.0"}/5.0</span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-100 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-200">New Users This Week</span>
                  <span className="font-bold text-green-400 text-lg">+{stats?.recentUsers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-200">New Feedback This Week</span>
                  <span className="font-bold text-blue-400 text-lg">+{stats?.recentFeedbacks || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-200">System Health</span>
                  <span className="font-bold text-green-400 text-lg">Excellent</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </AdminOnly>
  );
}
