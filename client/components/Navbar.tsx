"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/Store/auth";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();

  const links = [
    { href: "/", label: "Home" },
    { href: "/AboutUs", label: "About Us" },
    { href: "/Contact", label: "Contact" },
    { href: "/Services", label: "Services" },
  ];

  return (
    <header className="sticky top-0 z-50 shadow-md bg-gradient-to-r from-blue-900 to-teal-600 text-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
          <span className="bg-white text-blue-900 rounded-full px-2 py-1">FP</span>
          Feedback Portal
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 items-center">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`hover:text-yellow-300 transition ${pathname === href ? "underline underline-offset-4" : ""
                }`}
            >
              {label}
            </Link>
          ))}
          {
            user && user.role === "student" && (
              <Link
                href="/Student"
                className={`hover:text-yellow-300 transition ${pathname.startsWith("/Student") ? "underline underline-offset-4" : ""
                  }`}
              >
                Dashboard
              </Link>
            )
          }
          {
            user && user.role === "teacher" && (
              <Link
                href="/Teacher"
                className={`hover:text-yellow-300 transition ${pathname.startsWith("/Teacher") ? "underline underline-offset-4" : ""
                  }`}
              >
                Teacher Dashboard
              </Link>
            )
          }
          {
            user && user.role === "admin" && (
              <Link
                href="/Admin"
                className={`hover:text-yellow-300 transition ${pathname.startsWith("/Admin") ? "underline underline-offset-4" : ""
                  }`}
              >
                Admin Dashboard
              </Link>
            )
          }

          {isLoggedIn ? (
            <Link
              href="/Logout"
              className="px-4 py-2 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-300 transition"
            >
              Logout
            </Link>
          ) : (
            <>
              <Link
                href="/Login"
                className="px-4 py-2 bg-yellow-400 text-blue-900 font-semibold rounded-lg hover:bg-yellow-300 transition"
              >
                Login
              </Link>
              <Link
                href="/Register"
                className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-900 transition"
              >
                Register
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <Menu size={28} />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-blue-600 px-6 py-4 flex flex-col gap-4">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-yellow-300 transition"
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          ))}

          {user && user.role === "student" && (
            <Link
              href="/Student"
              className="hover:text-yellow-300 transition"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </Link>
          )}
          {user && user.role === "teacher" && (
            <Link
              href="/Teacher"
              className="hover:text-yellow-300 transition"
              onClick={() => setIsOpen(false)}
            >
              Teacher Dashboard
            </Link>
          )}
          {user && user.role === "admin" && (
            <Link
              href="/Admin"
              className="hover:text-yellow-300 transition"
              onClick={() => setIsOpen(false)}
            >
              Admin Dashboard
            </Link>
          )}

          {isLoggedIn ? (
            <Link
              href="/Logout"
              className="bg-blue-200 text-blue-900 px-4 py-2 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Logout
            </Link>
          ) : (
            <>
              <Link
                href="/Login"
                className="bg-blue-200 text-blue-900 px-4 py-2 rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/Register"
                className="border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-blue-900"
                onClick={() => setIsOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
