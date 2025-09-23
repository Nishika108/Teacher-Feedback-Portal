"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/Store/auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, UserPlus, CheckCircle } from "lucide-react";
import { AdminOnly } from "@/components/RoleProtection";

interface TeacherFormData {
  fullName: string;
  email: string;
  phone: string;
  courses: string;
  department: string;
  employeeId: string;
  role: string;
  joiningDate: string;
}

export default function AddTeacher() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<TeacherFormData>({
    fullName: "",
    email: "",
    phone: "",
    courses: "",
    department: "",
    employeeId: "",
    role: "Teacher",
    joiningDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/Login");
      return;
    }
  }, [user, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5001/api/teacher/add", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          courses: "",
          department: "",
          employeeId: "",
          role: "Teacher",
          joiningDate: new Date().toISOString().split('T')[0]
        });
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to add teacher");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Teacher Added Successfully!</h2>
            <p className="text-gray-200 mb-6">The teacher has been added to the system.</p>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/Admin")}
                className="w-full bg-blue-600 text-gray-100 py-2 px-4 rounded-2xl hover:bg-blue-700 transition"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => setSuccess(false)}
                className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-2xl hover:bg-gray-300 transition"
              >
                Add Another Teacher
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AdminOnly>
      <div className="min-h-screen bg-gradient-to-r from-blue-900 to-teal-600 text-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <button
            onClick={() => router.push("/Admin")}
            className="flex items-center text-gray-200 hover:text-gray-100 mb-6 mx-auto"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-center mb-4">
            <UserPlus className="h-8 w-8 text-gray-100 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-100">Add New Teacher</h1>
          </div>
          <p className="text-lg md:text-xl text-gray-100">Add a new teacher to the feedback system.</p>
        </div>

        {/* Form */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-lg p-8">
          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-200 px-4 py-3 rounded-2xl mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-100 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter full name"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-100 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-100 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              {/* Employee ID */}
              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium text-gray-100 mb-2">
                  Employee ID *
                </label>
                <input
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter employee ID"
                />
              </div>

              {/* Department */}
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-100 mb-2">
                  Department *
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="English">English</option>
                  <option value="History">History</option>
                  <option value="Economics">Economics</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Role */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-100 mb-2">
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Teacher">Teacher</option>
                  <option value="HOD">Head of Department</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {/* Joining Date */}
              <div>
                <label htmlFor="joiningDate" className="block text-sm font-medium text-gray-100 mb-2">
                  Joining Date *
                </label>
                <input
                  type="date"
                  id="joiningDate"
                  name="joiningDate"
                  value={formData.joiningDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Courses */}
            <div>
              <label htmlFor="courses" className="block text-sm font-medium text-gray-100 mb-2">
                Courses Taught *
              </label>
              <textarea
                id="courses"
                name="courses"
                value={formData.courses}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter courses taught (separated by commas)"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => router.push("/Admin")}
                className="px-6 py-2 border border-gray-300 rounded-2xl text-gray-100 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-gray-100 rounded-2xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding Teacher...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Teacher
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </AdminOnly>
  );
}
