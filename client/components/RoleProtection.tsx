"use client";

import { useAuth } from "@/Store/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RoleProtectionProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function RoleProtection({ 
  allowedRoles, 
  children, 
  fallback 
}: RoleProtectionProps) {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("RoleProtection - isLoggedIn:", isLoggedIn, "user:", user, "allowedRoles:", allowedRoles);
    
    // Only redirect if we have confirmed authentication state and user data
    if (isLoggedIn === true && user && !allowedRoles.includes(user.role)) {
      console.log("User role", user.role, "not in allowed roles", allowedRoles, "- redirecting");
      // Redirect to appropriate dashboard based on user role
      switch (user.role) {
        case "admin":
          router.push("/Admin");
          break;
        case "teacher":
          router.push("/Teacher");
          break;
        case "student":
          router.push("/Student");
          break;
        default:
          router.push("/");
      }
    } else if (isLoggedIn === true && user && allowedRoles.includes(user.role)) {
      console.log("User role", user.role, "is allowed for this page - showing content");
    }
  }, [user, isLoggedIn, allowedRoles, router]);

  // Show loading while checking authentication
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If user is logged in but doesn't have the required role
  if (user && !allowedRoles.includes(user.role)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-red-500 mb-6">
            You don't have permission to access this page. This area is restricted to {allowedRoles.join(", ")} users only.
          </p>
          <div className="bg-white rounded-lg p-4 shadow-lg">
            <p className="text-sm text-gray-600 mb-3">Your current role:</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-semibold text-gray-800 capitalize">{user.role}</span>
            </div>
          </div>
          <button
            onClick={() => router.push("/")}
            className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // If user has the required role, show the protected content
  return <>{children}</>;
}

// Convenience components for specific roles
export function AdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleProtection allowedRoles={["admin"]} fallback={fallback}>
      {children}
    </RoleProtection>
  );
}

export function TeacherOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleProtection allowedRoles={["teacher"]} fallback={fallback}>
      {children}
    </RoleProtection>
  );
}

export function StudentOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleProtection allowedRoles={["student"]} fallback={fallback}>
      {children}
    </RoleProtection>
  );
}

