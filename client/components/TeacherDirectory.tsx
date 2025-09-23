"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Search, Filter, Mail, Phone, BadgeCheck, IdCard } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Teacher {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  courses: string[] | string;
  department: string;
  employeeId: string;
  isActive: boolean;
}

export default function TeacherDirectory() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [departments, setDepartments] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/teacher/all");
        setTeachers(res.data);

        const depts: string[] = Array.from(
          new Set(res.data.map((t: Teacher) => t.department).filter(Boolean))
        );
        setDepartments(depts);
      } catch (error) {
        console.error("Failed to fetch teachers", error);
      }
    };
    fetchTeachers();
  }, []);

  // ✅ keep search + filter logic unchanged
  const filteredTeachers = teachers.filter((teacher) => {
    const matchesName = teacher.fullName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesDept = filterDept ? teacher.department === filterDept : true;
    return matchesName && matchesDept;
  });

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-200 via-purple to-teal-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-extrabold mb-2 text-center text-gray-800">
          Teacher Directory
        </h1>
        <p className="text-gray-500 text-center mb-8">
          Browse teachers, filter by department, and give your feedback easily.
        </p>

        {/* Search & Filter */}
        <div className="bg-white shadow rounded-xl p-4 flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-2 top-2.5 text-gray-400" size={18} />
          </div>

          {/* Department Dropdown */}
          <div className="relative w-full sm:w-64">
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <Filter className="absolute left-2 top-2.5 text-gray-400" size={18} />
          </div>
        </div>

        {/* Teacher Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filteredTeachers.map((teacher) => (
            <motion.div
              key={teacher._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 flex flex-col gap-4 transition"
            >
              {/* Header Info */}
              <div className="flex items-center gap-4">
                <img
                  src={"/default-profile.png"}
                  alt={teacher.fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {teacher.fullName}
                  </h2>
                  <span
                    className={`inline-block mt-1 text-xs px-2 py-1 rounded-full ${teacher.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {teacher.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="text-sm text-gray-600 space-y-2">
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-blue-500" />
                  {teacher.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-green-500" />
                  {teacher.phone}
                </p>
                <p className="flex items-center gap-2">
                  <IdCard size={16} className="text-purple-500" />
                  Employee ID: {teacher.employeeId}
                </p>
                {teacher.department && (
                  <p className="flex items-center gap-2">
                    <BadgeCheck size={16} className="text-yellow-500" />
                    Department:{" "}
                    <span className="font-medium text-gray-800">
                      {teacher.department}
                    </span>
                  </p>
                )}
              </div>

              {/* Courses */}
              <div className="flex flex-wrap gap-2 mt-3">
                {Array.isArray(teacher.courses)
                  ? teacher.courses.map((course, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                    >
                      {course}
                    </span>
                  ))
                  : teacher.courses
                    ? teacher.courses
                      .split(",")
                      .map((c, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full"
                        >
                          {c.trim()}
                        </span>
                      ))
                    : (
                      <p className="text-gray-400 text-sm">No courses listed</p>
                    )}
              </div>

              {/* Feedback Button */}
              <button
                onClick={() => router.push(`/Student/Feedback/${teacher._id}`)}
                className="self-start mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Give Feedback
              </button>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTeachers.length === 0 && (
          <div className="text-center mt-10">
            <img
              src="/empty-state.svg"
              alt="No results"
              className="mx-auto w-40 opacity-80"
            />
            <p className="text-gray-500 mt-4">
              No teachers found for your search/filter.
            </p>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <div className="mt-4 ">
          <Link
            href="/Student"
            className="bg-blue-900 text-white px-6 py-2 rounded-2xl font-semibold shadow-md hover:bg-blue-800 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
