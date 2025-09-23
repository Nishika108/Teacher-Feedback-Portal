"use client";

import { useState, useEffect, use } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { StarIcon as StarSolid } from "@heroicons/react/24/solid";
import { StarIcon as StarOutline } from "@heroicons/react/24/outline";
import { useAuth } from "@/Store/auth";

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

export default function FeedbackForm() {
  const params = useParams();
  const teacherIdFromURL = (params?.teacherId as string) || "";
  const router = useRouter();

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comments, setComments] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/teacher/${teacherIdFromURL}`);
        setTeacher(res.data);
      } catch (error) {
        setMessage({ type: "error", text: "Failed to fetch teacher details." });
      }
    };
    if (teacherIdFromURL) fetchTeacher();
  }, [teacherIdFromURL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacher || rating === 0) {
      setMessage({ type: "error", text: "Please select a rating." });
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:5001/api/feedback", {
        teacherId: teacher._id,
        rating,
        comments,
      },{
        headers: {
          Authorization: `Bearer ${token}`,  // token must come from login/auth
        }
      });
      setMessage({ type: "success", text: " Feedback submitted successfully!" });
      setRating(0);
      setHoverRating(0);
      setComments("");
      setTimeout(() => router.push("/Student/Feedback"), 2000);
    } catch (error) {
      setMessage({ type: "error", text: " Failed to submit feedback. Try again." });
    } finally {
      setLoading(false);
    }
  };

  if (!teacher) return <p className="text-center mt-20 text-gray-600">Loading teacher...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 via-purple-100 to-teal-200 p-6">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden transform hover:scale-105 transition duration-300">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-teal-100 p-6 text-center relative">
          <div className="inline-block rounded-full bg-white p-1 shadow-lg mb-3">
            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-500 animate-pulse">
              {teacher.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
          </div>
          <h1 className="text-black text-2xl font-bold">{teacher.fullName}</h1>
          <p className="text-black/90 mt-1">{teacher.department}</p>
          <div className="flex justify-center mt-2 space-x-2 flex-wrap">
            {Array.isArray(teacher.courses)
              ? teacher.courses.map((c, idx) => (
                <span
                  key={idx}
                  className="bg-white/30 text-black px-3 py-1 rounded-full text-sm font-medium"
                >
                  {c}
                </span>
              ))
              : (
                <span className="bg-white/30 text-black px-3 py-1 rounded-full text-sm font-medium">
                  {teacher.courses}
                </span>
              )}
          </div>
          <p className="mt-2 text-black/80 text-sm">{teacher.email}</p>
          <p className="text-black/80 text-sm">{teacher.phone}</p>
          <span
            className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-semibold ${teacher.isActive ? "bg-green-500 text-black" : "bg-red-500 text-white"
              }`}
          >
            {teacher.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Form */}
        <div className="p-6">
          {message && (
            <p
              className={`text-center mb-4 text-sm font-medium ${message.type === "success" ? "text-green-600" : "text-red-600"
                }`}
            >
              {message.text}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star Rating */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Rating</label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transform hover:scale-110 transition"
                  >
                    {rating >= star || hoverRating >= star ? (
                      <StarSolid className="h-9 w-9 text-yellow-400 transition-all duration-300" />
                    ) : (
                      <StarOutline className="h-9 w-9 text-gray-300 transition-all duration-300" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">Comments</label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Write your feedback here (optional)"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={4}
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 font-bold rounded-xl text-white text-lg transition duration-200 ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-300 hover:bg-blue-500"
                }`}
            >
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
