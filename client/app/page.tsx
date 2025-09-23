"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Contact } from "@/components/Contact";
import AboutUs from "@/components/AboutUs";

interface Testimonial {
  _id: string;
  userName: string;
  message: string;
}

export default function HomePage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/form/contact/testimonials");
        setTestimonials(res.data); // assuming backend returns an array of testimonials
      } catch (error) {
        console.error("Failed to fetch testimonials", error);
      }
    };
    fetchTestimonials();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-900 to-teal-600 text-white px-6 flex flex-col">
      
      {/* ------------------- Hero Section ------------------- */}
      <section className="text-center max-w-2xl mx-auto mt-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Teacher Feedback & Rating System
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Empower students to share feedback — anonymously or openly — 
          and help teachers improve with honest insights.
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/AboutUs"
            className="bg-white text-blue-900 px-6 py-3 rounded-2xl font-semibold shadow-md hover:bg-gray-200 transition"
          >
            Learn More
          </Link>
          <Link
            href="/Contact"
            className="bg-teal-500 px-6 py-3 rounded-2xl font-semibold shadow-md hover:bg-teal-400 transition"
          >
            Give Feedback
          </Link>
        </div>
      </section>

      {/* ------------------- Features Section ------------------- */}
      <section className="max-w-6xl mx-auto mt-20 grid md:grid-cols-3 gap-8 text-center">
        <div className="bg-white/10 p-6 rounded-3xl shadow-lg hover:scale-105 transition">
          <h2 className="text-xl font-bold mb-2">Anonymous Feedback</h2>
          <p>Students can provide honest feedback without revealing identity.</p>
        </div>
        <div className="bg-white/10 p-6 rounded-3xl shadow-lg hover:scale-105 transition">
          <h2 className="text-xl font-bold mb-2">Teacher Ratings</h2>
          <p>Rate teachers on multiple aspects to provide actionable insights.</p>
        </div>
        <div className="bg-white/10 p-6 rounded-3xl shadow-lg hover:scale-105 transition">
          <h2 className="text-xl font-bold mb-2">Improvement Insights</h2>
          <p>Teachers get analytics to improve teaching quality and engagement.</p>
        </div>
      </section>
      {/* ------------------- Testimonials Section ------------------- */}
      <section className="max-w-6xl mx-auto mt-20 mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">What Students Say</h2>
        {testimonials.length === 0 ? (
          <p className="text-center text-white/80">No testimonials yet.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="bg-white/10 p-6 rounded-3xl shadow-lg hover:scale-105 transition text-white/90"
              >
                <p>"{t.message}"</p>
                <p className="mt-4 font-semibold">- {t.userName}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ------------------- Footer ------------------- */}
      <footer>
        <Contact/>
        <div  className="text-center text-white/90 border-t border-white/20 mt-auto">
        <p>Email: support@feedbacksystem.com | Phone: +91 7906323164</p>
        <p className="mt-2 text-sm">© 2025 FeedbackSystem. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
