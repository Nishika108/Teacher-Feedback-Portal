"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/Store/auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import { TeacherOnly } from "@/components/RoleProtection";
import { 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  BarChart3,
  Calendar,
  Award,
  Eye,
  BookOpen,
  Building2,
  MapPin
} from "lucide-react";

interface TeacherStats {
  totalFeedbacks: number;
  averageRating: number;
  ratingDistribution: Array<{ _id: number; count: number }>;
  recentFeedbacks: number;
  monthlyTrend: Array<{
    _id: { year: number; month: number };
    count: number;
    avgRating: number;
  }>;
}

interface TeacherProfile {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  courses: string;
  department: string;
  employeeId: string;
  role: string;
  joiningDate: string;
  isActive: boolean;
}

export default function TeacherDashboard() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "teacher") {
      router.push("/Login");
      return;
    }
    fetchDashboardData();
  }, [user, router]);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, profileResponse] = await Promise.all([
        axios.get("http://localhost:5001/api/teacher-dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5001/api/teacher-dashboard/profile", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setStats(statsResponse.data.stats);
      setProfile(profileResponse.data.teacher);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-yellow-600";
    if (rating >= 2.5) return "text-orange-600";
    return "text-red-600";
  };

  const getRatingText = (rating: number) => {
    if (rating >= 4.5) return "Excellent";
    if (rating >= 3.5) return "Good";
    if (rating >= 2.5) return "Average";
    return "Needs Improvement";
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-5 w-5 text-yellow-400 fill-current opacity-50" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
    }
    
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-200">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Feedback",
      value: stats?.totalFeedbacks || 0,
      icon: MessageSquare,
      color: "bg-blue-500",
      change: `+${stats?.recentFeedbacks || 0} this month`
    },
    {
      title: "Average Rating",
      value: stats?.averageRating ? stats.averageRating.toFixed(1) : "0.0",
      icon: Star,
      color: "bg-yellow-500",
      change: getRatingText(stats?.averageRating || 0)
    },
    {
      title: "Rating Trend",
      value: stats?.monthlyTrend?.length ? "↗" : "→",
      icon: TrendingUp,
      color: "bg-green-500",
      change: "Last 6 months"
    }
  ];

  const quickActions = [
    {
      title: "View All Feedback",
      description: "See all student feedback and ratings",
      icon: Eye,
      href: "/Teacher/Feedback",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "My Profile",
      description: "Update your profile information",
      icon: Users,
      href: "/Teacher/Profile",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      title: "Analytics",
      description: "Detailed performance analytics",
      icon: BarChart3,
      href: "/Teacher/Analytics",
      color: "bg-purple-500 hover:bg-purple-600"
    }
  ];

  return (
    <TeacherOnly>
      <div className="min-h-screen bg-gradient-to-r from-blue-900 to-teal-600 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Teacher Dashboard</h1>
          <p className="text-lg md:text-xl text-gray-200">
            Welcome back, {profile?.fullName || user?.userName}! Here's your performance overview.
          </p>
        </div>

        {/* Profile Card */}
        {profile && (
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="bg-blue-500 p-4 rounded-full">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold text-gray-100">{profile.fullName}</h2>
                  <p className="text-gray-200">{profile.department} • {profile.role}</p>
                  <p className="text-sm text-gray-300">Employee ID: {profile.employeeId}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className={`text-4xl font-bold ${getRatingColor(stats?.averageRating || 0)}`}>
                      {stats?.averageRating ? stats.averageRating.toFixed(1) : "0.0"}
                    </div>
                    <div className="text-lg text-gray-300 font-medium">/5.0</div>
                  </div>
                  <div className="flex justify-center">
                    {renderStars(stats?.averageRating || 0)}
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getRatingColor(stats?.averageRating || 0)} bg-opacity-20`}>
                      {getRatingText(stats?.averageRating || 0)}
                    </div>
                    <div className="text-xs text-gray-300">
                      {stats?.totalFeedbacks || 0} {stats?.totalFeedbacks === 1 ? 'review' : 'reviews'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-200">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-100">{stat.value}</p>
                  <p className="text-xs text-gray-300 mt-1">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-full`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className={`${action.color} text-gray-100 p-6 rounded-2xl transition-colors duration-200 hover:shadow-lg block`}
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

        {/* Rating Distribution */}
        {stats?.ratingDistribution && stats.ratingDistribution.length > 0 ? (
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-6">Rating Distribution</h2>
            <div className="space-y-4">
              {stats.ratingDistribution.map((rating) => {
                const percentage = stats.totalFeedbacks > 0 ? (rating.count / stats.totalFeedbacks) * 100 : 0;
                return (
                  <div key={rating._id} className="flex items-center">
                    <div className="flex items-center w-24">
                      <span className="text-sm font-medium text-gray-200 mr-2">{rating._id}</span>
                      <div className="flex">
                        {renderStars(rating._id)}
                      </div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-3 relative">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                          style={{
                            width: `${percentage}%`
                          }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-100">
                            {percentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center w-16 justify-end">
                      <span className="text-sm font-semibold text-gray-100">
                        {rating.count}
                      </span>
                      <span className="text-xs text-gray-300 ml-1">
                        {rating.count === 1 ? 'review' : 'reviews'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Summary */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-200">
                <span>Total Reviews: {stats.totalFeedbacks}</span>
                <span>Average: {stats.averageRating ? stats.averageRating.toFixed(1) : "0.0"}/5.0</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-6">Rating Distribution</h2>
            <div className="text-center py-8">
              <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-300 mb-2">No ratings yet</p>
              <p className="text-sm text-gray-400">Students haven't rated you yet. Encourage them to leave feedback!</p>
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">Performance Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-100 mb-4 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-purple-400" />
                Key Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-gray-300/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-200">Total Feedback Received</span>
                  </div>
                  <span className="font-bold text-xl text-gray-100">{stats?.totalFeedbacks || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-gray-300/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-200">Average Rating</span>
                  </div>
                  <span className={`font-bold text-xl ${getRatingColor(stats?.averageRating || 0)}`}>
                    {stats?.averageRating ? stats.averageRating.toFixed(1) : "0.0"}/5.0
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-gray-300/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-200">Recent Feedback (30 days)</span>
                  </div>
                  <span className="font-bold text-xl text-green-400">+{stats?.recentFeedbacks || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-gray-300/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-200">Performance Status</span>
                  </div>
                  <span className={`font-bold text-lg ${getRatingColor(stats?.averageRating || 0)}`}>
                    {getRatingText(stats?.averageRating || 0)}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-100 mb-4 flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-blue-400" />
                Courses Taught
              </h3>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-gray-300/20">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-100 text-lg leading-relaxed">
                      {profile?.courses || "No courses specified"}
                    </p>
                    {profile?.courses && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {profile.courses.split(',').map((course, index) => (
                          <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-200 rounded-full text-sm border border-blue-400/30">
                            {course.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-200 mb-3 flex items-center">
                  <Building2 className="h-4 w-4 mr-2 text-green-400" />
                  Department
                </h4>
                <div className="flex items-center space-x-3">
                  <span className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-200 rounded-full text-sm font-medium border border-green-400/30">
                    {profile?.department}
                  </span>
                  <div className="flex items-center text-xs text-gray-300">
                    <MapPin className="h-3 w-3 mr-1" />
                    Academic Department
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </TeacherOnly>
  );
}