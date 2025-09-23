"use client";

import { useState } from "react";
import axios from "axios";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Briefcase,
  IdCard,
  Calendar,
} from "lucide-react";

export default function AddTeacherPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    courses: "",
    department: "",
    employeeId: "",
    role: "Teacher",
    joiningDate: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5001/api/teacher/add",
        formData
      );
      setMessage(res.data.message);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        courses: "",
        department: "",
        employeeId: "",
        role: "Teacher",
        joiningDate: "",
      });
    } catch (error: any) {
      setMessage(
        error.response?.data?.message || "Error submitting teacher form"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full border border-gray-300 p-3 pl-10 rounded-xl bg-gray-50 hover:bg-white transition-all focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none shadow-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple to-teal-200 p-6">
      <div className="w-full max-w-xl bg-white shadow-2xl rounded-3xl p-10 border border-blue-100">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-700 tracking-wide">
          Add New Teacher
        </h2>

        {message && (
          <p
            className={`mb-5 text-center text-sm font-medium py-2 px-3 rounded-lg ${
              message.toLowerCase().includes("error")
                ? "bg-red-100 text-red-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="relative">
            <User className="absolute top-3.5 left-3 text-gray-400" size={20} />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute top-3.5 left-3 text-gray-400" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          {/* Phone */}
          <div className="relative">
            <Phone className="absolute top-3.5 left-3 text-gray-400" size={20} />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          {/* Courses */}
          <div className="relative">
            <BookOpen
              className="absolute top-3.5 left-3 text-gray-400"
              size={20}
            />
            <input
              type="text"
              name="courses"
              placeholder="Courses"
              value={formData.courses}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          {/* Department */}
          <div className="relative">
            <Briefcase
              className="absolute top-3.5 left-3 text-gray-400"
              size={20}
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          {/* Employee ID */}
          <div className="relative">
            <IdCard
              className="absolute top-3.5 left-3 text-gray-400"
              size={20}
            />
            <input
              type="text"
              name="employeeId"
              placeholder="Employee ID"
              value={formData.employeeId}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          {/* Role */}
          <div className="relative">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-xl bg-gray-50 hover:bg-white transition-all focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none shadow-sm"
            >
              <option value="Teacher">Teacher</option>
              <option value="HOD">HOD</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Joining Date */}
          <div className="relative">
            <Calendar
              className="absolute top-3.5 left-3 text-gray-400"
              size={20}
            />
            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate}
              onChange={handleChange}
              className={inputClasses}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-transform duration-200 ease-in-out font-semibold tracking-wide"
          >
            {loading ? "Submitting..." : "✨ Add Teacher"}
          </button>
        </form>
      </div>
    </div>
  );
}
