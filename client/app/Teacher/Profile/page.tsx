"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/Store/auth";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, User, Save, CheckCircle } from "lucide-react";
import { TeacherOnly } from "@/components/RoleProtection";

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

export default function TeacherProfile() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    courses: "",
    department: ""
  });

  useEffect(() => {
    if (!user || user.role !== "teacher") {
      router.push("/Login");
      return;
    }
    fetchProfile();
  }, [user, router]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/teacher-dashboard/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const profileData = response.data.teacher;
      setProfile(profileData);
      setFormData({
        fullName: profileData.fullName,
        phone: profileData.phone,
        courses: profileData.courses,
        department: profileData.department
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await axios.put("http://localhost:5001/api/teacher-dashboard/profile", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setSuccess(true);
        setProfile(response.data.teacher);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <TeacherOnly>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/Teacher")}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </button>
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            </div>
            <p className="text-gray-600 mt-2">Update your profile information.</p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Profile updated successfully!
            </div>
          )}

          {/* Profile Information */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                  <div className="bg-blue-500 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">{profile?.fullName}</h2>
                  <p className="text-gray-600">{profile?.department}</p>
                  <p className="text-sm text-gray-500 mt-2">{profile?.role}</p>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Employee ID</h3>
                    <p className="text-gray-900">{profile?.employeeId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Email</h3>
                    <p className="text-gray-900">{profile?.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Joining Date</h3>
                    <p className="text-gray-900">
                      {profile?.joiningDate ? new Date(profile.joiningDate).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">Status</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      profile?.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {profile?.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Profile</h2>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter full name"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter phone number"
                      />
                    </div>

                    {/* Department */}
                    <div>
                      <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                        Department *
                      </label>
                      <select
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  </div>

                  {/* Courses */}
                  <div>
                    <label htmlFor="courses" className="block text-sm font-medium text-gray-700 mb-2">
                      Courses Taught *
                    </label>
                    <textarea
                      id="courses"
                      name="courses"
                      value={formData.courses}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter courses taught (separated by commas)"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={() => router.push("/Teacher")}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TeacherOnly>
  );
}
