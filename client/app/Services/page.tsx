"use client";

import Link from "next/link";

export default function Services() {
  const services = [
    {
      title: "Submit Feedback",
      description:
        "Students can easily submit feedback for their teachers anonymously or with their identity.",
      icon: "📝",
      gradient: "from-blue-500 to-teal-400",
    },
    {
      title: "View Ratings",
      description:
        "Teachers can see their average ratings and detailed feedback to improve their teaching.",
      icon: "⭐",
      gradient: "from-purple-500 to-pink-400",
    },
    {
      title: "Secure Storage",
      description:
        "All feedback is stored safely and securely in the database for authorized access only.",
      icon: "🔒",
      gradient: "from-green-500 to-lime-400",
    },
    {
      title: "Admin Dashboard",
      description:
        "Admins can manage teachers, moderate feedback, and view overall platform insights.",
      icon: "🛠️",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      title: "Analytics & Reports",
      description:
        "Visual dashboards and reports to track trends, teacher performance, and feedback insights.",
      icon: "📊",
      gradient: "from-red-500 to-pink-600",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-r from-blue-900 to-teal-600 text-gray-50 px-6 py-12 flex flex-col">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mt-12">
        <h1 className="text-4xl font-bold mb-4">Our Services</h1>
        <p className="text-lg text-gray-200 leading-relaxed">
          Explore what the Teacher Feedback & Rating System offers to make classrooms better.
          From submitting feedback to insightful analytics, everything is designed to improve
          teaching and learning.
        </p>
      </section>

      {/* Services Cards */}
      <section className="max-w-6xl mx-auto mt-20 grid md:grid-cols-3 gap-8">
        {services.map((s, idx) => (
          <div
            key={idx}
            className={`bg-gradient-to-r ${s.gradient} p-6 rounded-3xl shadow-lg transform hover:scale-105 transition`}
          >
            <div className="text-4xl mb-4">{s.icon}</div>
            <h3 className="text-xl font-bold mb-2">{s.title}</h3>
            <p className="text-white/90 text-sm">{s.description}</p>
          </div>
        ))}
      </section>

      {/* How It Helps */}
      <section className="max-w-6xl mx-auto mt-20 px-4">
        <h2 className="text-3xl font-semibold mb-12 text-center">🌟 How It Helps</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Benefit 1 */}
          <div className="bg-gradient-to-r from-blue-500 to-teal-400 p-6 rounded-3xl shadow-lg transform hover:scale-105 transition">
            <div className="text-4xl mb-4">🗣️</div>
            <h3 className="text-xl font-bold mb-2 text-white">Encourages Honest Communication</h3>
            <p className="text-white/90 text-sm">
              Students can provide genuine feedback to teachers without fear, improving transparency.
            </p>
          </div>

          {/* Benefit 2 */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-400 p-6 rounded-3xl shadow-lg transform hover:scale-105 transition">
            <div className="text-4xl mb-4">📈</div>
            <h3 className="text-xl font-bold mb-2 text-white">Actionable Insights for Teachers</h3>
            <p className="text-white/90 text-sm">
              Teachers get clear ratings and feedback trends, helping them enhance their teaching methods.
            </p>
          </div>

          {/* Benefit 3 */}
          <div className="bg-gradient-to-r from-green-500 to-lime-400 p-6 rounded-3xl shadow-lg transform hover:scale-105 transition">
            <div className="text-4xl mb-4">🛠️</div>
            <h3 className="text-xl font-bold mb-2 text-white">Effective Admin Management</h3>
            <p className="text-white/90 text-sm">
              Admins can monitor performance, manage teachers, and maintain a healthy feedback system.
            </p>
          </div>

          {/* Benefit 4 */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-3xl shadow-lg transform hover:scale-105 transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2 text-white">Track Trends & Progress</h3>
            <p className="text-white/90 text-sm">
              Visual analytics help track feedback trends over time for continuous improvement.
            </p>
          </div>

          {/* Benefit 5 */}
          <div className="bg-gradient-to-r from-red-500 to-pink-600 p-6 rounded-3xl shadow-lg transform hover:scale-105 transition">
            <div className="text-4xl mb-4">🌐</div>
            <h3 className="text-xl font-bold mb-2 text-white">Accessible Anywhere</h3>
            <p className="text-white/90 text-sm">
              Mobile-friendly design ensures students and teachers can access the platform anytime.
            </p>
          </div>
        </div>
      </section>

      {/* CTA / Footer */}
      <footer className="py-6 text-center text-white/90 mt-auto">
        <p className="mb-2 font-semibold">Get Started Today</p>
        <Link
          href="/"
          className="bg-blue-900 text-white px-6 py-2 rounded-2xl font-semibold shadow-md hover:bg-blue-800 transition"
        >
          Back to Home
        </Link>
        <p className="mt-2 text-sm">© 2025 Teacher Feedback System. All rights reserved.</p>
      </footer>
    </main>
  );
}
