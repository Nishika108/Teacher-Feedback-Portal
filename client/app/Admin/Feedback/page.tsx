"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/Store/auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Search, Filter, Star, Calendar, User, Eye } from "lucide-react";
import { AdminOnly } from "@/components/RoleProtection";

interface Feedback {
  _id: string;
  studentId: {
    _id: string;
    userName: string;
    email: string;
  } | null;
  teacherId: {
    _id: string;
    fullName: string;
    email: string;
    department: string;
  } | null;
  rating: number;
  comments: string;
  createdAt: string;
}

export default function AdminFeedback() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/Login");
      return;
    }
    fetchFeedbacks();
  }, [user, router, currentPage]);

  useEffect(() => {
    filterFeedbacks();
  }, [feedbacks, searchTerm, ratingFilter, teacherFilter, dateFilter]);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/admin-dashboard/feedbacks?page=${currentPage}&limit=${itemsPerPage}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setFeedbacks(response.data.feedbacks);
      setTotalPages(response.data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterFeedbacks = () => {
    let filtered = feedbacks;

    if (searchTerm) {
      filtered = filtered.filter(feedback =>
        (feedback.studentId?.userName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (feedback.teacherId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (feedback.comments?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (ratingFilter) {
      filtered = filtered.filter(feedback => feedback.rating === parseInt(ratingFilter));
    }

    if (teacherFilter) {
      filtered = filtered.filter(feedback => feedback.teacherId?._id === teacherFilter);
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      filtered = filtered.filter(feedback => {
        const feedbackDate = new Date(feedback.createdAt);
        return feedbackDate.toDateString() === filterDate.toDateString();
      });
    }

    setFilteredFeedbacks(filtered);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      );
    }
    return stars;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600 bg-green-100";
    if (rating >= 3) return "text-yellow-600 bg-yellow-100";
    if (rating >= 2) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-900 to-teal-600 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-200">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminOnly>
      <div className="min-h-screen bg-gradient-to-r from-blue-900 to-teal-600 text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <button
              onClick={() => router.push("/Admin")}
              className="flex items-center text-gray-200 hover:text-gray-100 mb-6 mx-auto"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">All Feedback</h1>
            <p className="text-lg md:text-xl text-gray-100">Monitor all student feedback across the system.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-500 rounded-full">
                  <Star className="h-6 w-6 text-gray-100" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-200">Total Feedback</p>
                  <p className="text-2xl font-bold text-gray-100">{feedbacks.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-500 rounded-full">
                  <Star className="h-6 w-6 text-gray-100" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-200">5 Star Ratings</p>
                  <p className="text-2xl font-bold text-gray-100">
                    {feedbacks.filter(f => f.rating === 5).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-500 rounded-full">
                  <Star className="h-6 w-6 text-gray-100" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-200">4+ Star Ratings</p>
                  <p className="text-2xl font-bold text-gray-100">
                    {feedbacks.filter(f => f.rating >= 4).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-500 rounded-full">
                  <Star className="h-6 w-6 text-gray-100" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-200">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-100">
                    {feedbacks.length > 0 
                      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
                      : "0.0"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search feedback..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-gray-300/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100 placeholder-gray-300 backdrop-blur-sm"
                />
              </div>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(e.target.value)}
                className="px-3 py-3 bg-white/10 border border-gray-300/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100 backdrop-blur-sm"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-3 bg-white/10 border border-gray-300/50 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-100 backdrop-blur-sm"
              />
              <button
                onClick={() => {
                  setSearchTerm("");
                  setRatingFilter("");
                  setDateFilter("");
                }}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Filter className="h-5 w-5 mr-2" />
                <span className="font-semibold">Clear Filters</span>
              </button>
            </div>
          </div>

          {/* Feedback List */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-100">
                Feedback ({filteredFeedbacks.length})
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredFeedbacks.map((feedback) => (
                <div key={feedback._id} className="p-6 hover:bg-gray-200/20">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className="bg-blue-500 p-2 rounded-full mr-3">
                          <User className="h-5 w-5 text-gray-100" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-100">
                            {feedback.studentId?.userName || "Anonymous Student"}
                          </h3>
                          <p className="text-sm text-gray-300">{feedback.studentId?.email || "No email provided"}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-gray-200 mr-2">Teacher:</span>
                          <span className="text-sm text-gray-100">{feedback.teacherId?.fullName || "Unknown Teacher"}</span>
                          {feedback.teacherId?.department && (
                            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              {feedback.teacherId.department}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center mb-3">
                        <div className="flex mr-3">
                          {renderStars(feedback.rating)}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getRatingColor(feedback.rating)}`}>
                          {feedback.rating} Star{feedback.rating !== 1 ? 's' : ''}
                        </span>
                      </div>
                      
                      {feedback.comments && (
                        <div className="bg-gray-200/20 rounded-2xl p-4 mb-3">
                          <p className="text-gray-100">{feedback.comments}</p>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-300">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatDate(feedback.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredFeedbacks.length === 0 && (
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300">No feedback found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg p-6 mt-8">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-100">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-2xl text-gray-100 hover:bg-gray-200/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 border rounded-2xl ${
                        page === currentPage
                          ? "bg-blue-600 text-gray-100 border-blue-600"
                          : "border-gray-300 text-gray-100 hover:bg-gray-200/20"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-2xl text-gray-100 hover:bg-gray-200/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminOnly>
  );
}
