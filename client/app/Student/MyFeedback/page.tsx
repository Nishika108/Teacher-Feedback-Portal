"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/Store/auth";
import Link from "next/link";

interface Teacher {
    _id: string;
    empId?: string;
    fullName: string;
}

interface Feedback {
    _id: string;
    studentId: string;
    teacherId: Teacher;
    rating: number;
    comments: string;
    createdAt: string;
}

export default function StudentFeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const studentId = user._id;

    useEffect(() => {
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <p className="text-lg text-gray-500 animate-pulse">
                    Loading feedbacks...
                </p>
            </div>
        );
    }

    if (feedbacks.length === 0) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <p className="text-lg text-gray-500">No feedback given yet.</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
                My Feedback History
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {feedbacks.map((fb) => (
                    <div
                        key={fb._id}
                        className="bg-gradient-to-br from-white to-gray-50 shadow-md rounded-2xl p-6 border hover:shadow-xl transition-all duration-300"
                    >
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-semibold text-gray-900">
                                {fb.teacherId?.empId
                                    ? `${fb.teacherId.empId} - ${fb.teacherId.fullName}`
                                    : fb.teacherId?.fullName}
                            </h2>
                            <span className="text-sm text-gray-500">
                                {new Date(fb.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        {/* Rating */}
                        <div className="mt-3 flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <span
                                    key={i}
                                    className={`text-lg ${i < fb.rating ? "text-yellow-400" : "text-gray-300"
                                        }`}
                                >
                                    ★
                                </span>
                            ))}
                            <span className="ml-2 text-gray-700 font-medium">
                                {fb.rating}/5
                            </span>
                        </div>

                        {/* Comments */}
                        <p className="mt-4 text-gray-700">
                            {fb.comments ? fb.comments : "No comments provided."}
                        </p>
                    </div>
                ))}
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
