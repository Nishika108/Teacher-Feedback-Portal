"use client";

import { useAuth } from "@/Store/auth";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

interface Testimonial {
  _id: string;
  userName: string;
  message: string;
}

export default function AboutUs() {
  const { user } = useAuth();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/form/contact/testimonials");
        setTestimonials(res.data);
      } catch (err) {
        console.error("Failed to fetch testimonials", err);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-900 to-teal-600 text-gray-50 px-6 py-12">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-xl mb-4">Hey, {user?.userName}! 👋 Welcome</h1>
        <h1 className="text-4xl font-bold mb-4">Teacher Feedback & Rating System</h1>
        <p className="text-lg text-gray-200 leading-relaxed">
          A simple, secure, and constructive way for students to share feedback
          and for teachers to grow. Honest feedback, better classrooms, happier learning.
        </p>
      </section>

      {/* Mission Section */}
      <section className="max-w-4xl mx-auto mt-16 px-4">
        <h2 className="text-3xl font-semibold mb-4 text-center">Our Mission</h2>
        <p className="text-lg text-gray-200 text-center leading-relaxed">
          We aim to create a transparent communication channel between students and teachers.
          By empowering students to share honest feedback, we help teachers improve and
          classrooms become more engaging and effective.
        </p>
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto mt-20 grid md:grid-cols-3 gap-8 text-center">
        <div className="bg-white/10 p-6 rounded-3xl shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-bold mb-2">Anonymous Feedback</h3>
          <p>Students can provide honest feedback without fear of judgment.</p>
        </div>
        <div className="bg-white/10 p-6 rounded-3xl shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-bold mb-2">Insightful Ratings</h3>
          <p>Teachers receive actionable insights from ratings and comments.</p>
        </div>
        <div className="bg-white/10 p-6 rounded-3xl shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-bold mb-2">Secure & Easy</h3>
          <p>All feedback is stored securely and displayed via a clean, responsive dashboard.</p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto mt-20 px-4">
        <h2 className="text-3xl font-semibold mb-12 text-center">How It Works</h2>

        <div className="grid md:grid-cols-5 gap-6 items-center relative">
          {/* Step 1 */}
          <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-6 rounded-3xl shadow-lg transform hover:scale-105 transition">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-blue-800 font-bold text-lg mb-4">
              1
            </div>
            <h3 className="font-semibold mb-2 text-white">Add Teachers</h3>
            <p className="text-white text-sm">
              Admin adds teachers to the system securely.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-400 p-6 rounded-3xl shadow-lg transform hover:scale-105 transition">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-purple-800 font-bold text-lg mb-4">
              2
            </div>
            <h3 className="font-semibold mb-2 text-white">Select Teacher</h3>
            <p className="text-white text-sm">
              Students log in and choose a teacher to rate.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-gradient-to-r from-green-500 to-lime-400 p-6 rounded-3xl shadow-lg transform hover:scale-105 transition">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-green-800 font-bold text-lg mb-4">
              3
            </div>
            <h3 className="font-semibold mb-2 text-white">Give Feedback</h3>
            <p className="text-white text-sm">
              Submit ratings and comments (anonymous or named).
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-3xl shadow-lg transform hover:scale-105 transition">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-yellow-800 font-bold text-lg mb-4">
              4
            </div>
            <h3 className="font-semibold mb-2 text-white">Store Securely</h3>
            <p className="text-white text-sm">
              Feedback is stored safely in the database.
            </p>
          </div>

          {/* Step 5 */}
          <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-3xl shadow-lg transform hover:scale-105 transition">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-red-800 font-bold text-lg mb-4">
              5
            </div>
            <h3 className="font-semibold mb-2 text-white">Review & Improve</h3>
            <p className="text-white text-sm">
              Teachers access insights and enhance their teaching.
            </p>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto mt-20 mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">What Students Say</h2>
        {testimonials.length === 0 ? (
          <p className="text-center text-white/80">No testimonials yet. Be the first to share your feedback!</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t._id} className="bg-white/10 p-6 rounded-3xl shadow-lg text-white/90">
                <p>"{t.message}"</p>
                <p className="mt-4 font-semibold">- {t.userName}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Future Roadmap Section */}
      <section className="max-w-6xl mx-auto mt-20 px-4">
        <h2 className="text-3xl font-semibold mb-12 text-center"> What's Next</h2>

        <div className="grid md:grid-cols-4 gap-8">
          {/* Future Enhancement 1 */}
          <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-6 rounded-3xl shadow-lg transform hover:scale-105 transition">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-blue-800 font-bold text-lg mb-4">
              1
            </div>
            <h3 className="font-semibold mb-2 text-white text-lg">AI Suggestions</h3>
            <p className="text-white text-sm">
              Smart tips for teachers based on student feedback trends.
            </p>
          </div>

          {/* Future Enhancement 2 */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-400 p-6 rounded-3xl shadow-lg transform hover:scale-105 transition">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-purple-800 font-bold text-lg mb-4">
              2
            </div>
            <h3 className="font-semibold mb-2 text-white text-lg">Gamification</h3>
            <p className="text-white text-sm">
              Badges and rewards for top-rated teachers to motivate and celebrate excellence.
            </p>
          </div>

          {/* Future Enhancement 3 */}
          <div className="bg-gradient-to-r from-green-500 to-lime-400 p-6 rounded-3xl shadow-lg transform hover:scale-105 transition">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-green-800 font-bold text-lg mb-4">
              3
            </div>
            <h3 className="font-semibold mb-2 text-white text-lg">Institution Integration</h3>
            <p className="text-white text-sm">
              Seamless login with school or college systems for easier access.
            </p>
          </div>

          {/* Future Enhancement 4 */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-3xl shadow-lg transform hover:scale-105 transition">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-yellow-800 font-bold text-lg mb-4">
              4
            </div>
            <h3 className="font-semibold mb-2 text-white text-lg">Advanced Analytics</h3>
            <p className="text-white text-sm">
              Track trends and insights over time using graphs and charts.
            </p>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="py-6 text-center text-white/90 border-white/20 mt-auto">
        <div className="mt-4">
          <Link
            href="/"
            className="bg-blue-900 text-white px-6 py-2 rounded-2xl font-semibold shadow-md hover:bg-blue-800 transition"
          >
            Back to Home
          </Link>
        </div>
      </footer>
    </main>
  );
}
