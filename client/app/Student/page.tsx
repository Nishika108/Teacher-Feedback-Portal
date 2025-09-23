"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/Store/auth";
import TeacherDirectory from "@/components/TeacherDirectory";

interface Feedback {
  _id: string;
  teacherId: string;
  rating: number;
  comments: string;
}

export default function StudentPage() {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const studentId = user?._id;

  // Fetch student feedback history
  useEffect(() => {
    if (!studentId) return;
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/feedback/${studentId}`
        );
        setFeedbacks(res.data || []);
      } catch (error) {
        console.error("Error fetching feedbacks", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, [studentId]);

  return (
    <div className="p-6 bg-gradient-to-br from-blue-200 via-purple to-teal-200 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        🎓 Student Dashboard
      </h1>
      <p className="text-gray-600 mb-6">
        Welcome! Manage your teacher feedbacks here.
      </p>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
          onClick={() => router.push("/Student/Feedback")}
          className="cursor-pointer bg-blue-100 hover:bg-blue-200 p-6 rounded-2xl shadow transition"
        >
          <h2 className="text-xl font-semibold text-blue-700">
            👩‍🏫 Give Feedback
          </h2>
          <p className="text-gray-600 mt-2">
            Browse teachers and submit your feedback.
          </p>
        </div>

        <div
          onClick={() => router.push("/Student/MyFeedback")}
          className="cursor-pointer bg-green-100 hover:bg-green-200 p-6 rounded-2xl shadow transition"
        >
          <h2 className="text-xl font-semibold text-green-700">
            📑 My Feedbacks
          </h2>
          <p className="text-gray-600 mt-2">
            View All your submitted feedbacks.
          </p>
        </div>

        <div className="bg-purple-100 p-6 rounded-2xl shadow">
          <h2 className="text-xl font-semibold text-purple-700">
            📊 Stats Overview
          </h2>
          <p className="text-gray-600 mt-2">
            You have submitted{" "}
            <span className="font-bold">{feedbacks.length}</span> feedbacks so
            far.
          </p>
        </div>
      </div>
      {/* Recent Feedbacks */}
      <div className="bg-yellow-50 p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold mb-4">🕒 Recent Feedbacks</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : feedbacks.length === 0 ? (
          <p className="text-gray-500">No feedbacks submitted yet.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {feedbacks.slice(0, 2).map((fb: any) => (
              <div key={fb._id} className="p-4 border rounded-lg shadow mb-3 bg-gray-50">
                <p className="font-semibold text-lg">
                  {fb.teacherId?.empId ? `${fb.teacherId.empId} - ${fb.teacherId.fullName}` : fb.teacherId?.fullName}
                </p>
                <p className="text-sm text-gray-600">Rating: ⭐ {fb.rating}</p>
                <p className="text-gray-700">{fb.comments || "No comments"}</p>
              </div>
            ))}
          </ul>
        )}
      </div>
      <TeacherDirectory />
    </div>
  );
}
