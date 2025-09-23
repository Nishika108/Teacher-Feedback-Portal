"use client"
import { useAuth } from "@/Store/auth";
import axios from "axios";
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type userRegister = {
    email: string;
    password: string;
    role: string;
};
export const Login = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { storeTokenLS, setUserData } = useAuth();
    const {user} = useAuth();
    const router = useRouter();
    const [formData, setFormData] = useState<userRegister>({
        email: "",
        password: "",
        role: "",
    });
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted!", formData);
        setIsLoading(true);
        
        // Validate form data
        if (!formData.email || !formData.password || !formData.role) {
            console.log("Form validation failed - missing fields");
            toast.error("Please fill in all fields");
            setIsLoading(false);
            return;
        }
        
        try {
            const payload = {
                ...formData,
            };
            console.log("Making API call to:", "http://localhost:5001/api/auth/login");
            console.log("Payload:", payload);
            
            const res = await axios.post(
                "http://localhost:5001/api/auth/login",
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000,
                }
            );
            console.log("API Response:", res);
            if (res.status === 201) {
                setFormData({
                    email: "",
                    password: "",
                    role: "",
                });
                storeTokenLS(res.data.token);
                
                // Get user role from response data or form data
                const userRole = res.data.userData?.role || formData.role;
                console.log("Login successful - userRole:", userRole, "userData:", res.data.userData);
                
                // Set user data immediately to avoid timing issues
                if (res.data.userData) {
                    setUserData(res.data.userData);
                    console.log("User data set immediately:", res.data.userData);
                }
                
                toast.success(res.data.message || "User Login successfully!");
                
                // Redirect based on role with a small delay to ensure token is stored
                setTimeout(() => {
                    console.log("Redirecting to:", userRole);
                    if (userRole === "admin") {
                        router.push("/Admin");
                    } else if (userRole === "teacher") {
                        router.push("/Teacher");
                    } else {
                        router.push("/Student");
                    }
                }, 100);
            } else {
                toast.error(
                    typeof res.data.message === "string" ? res.data.message : "All fields required!"
                );
            }
        } catch (err: any) {
            console.error("Login error:", err);
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else if (err.response?.status === 401) {
                toast.error("Invalid credentials. Please check your email and password.");
            } else if (err.response?.status === 400) {
                toast.error("Invalid request. Please check your input.");
            } else if (err.code === 'ECONNREFUSED') {
                toast.error("Cannot connect to server. Please check if the backend is running.");
            } else if (err.code === 'NETWORK_ERROR') {
                toast.error("Network error. Please check your internet connection.");
            } else {
                toast.error("Login failed. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <section className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-teal-600 px-4">
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl">

                {/* Left Image Section */}
                <div className="md:w-1/2 bg-gradient-to-r from-blue-900 to-teal-600 flex items-center justify-center p-6">
                    <Image
                        src="/Login.png"
                        alt="Register illustration"
                        width={400}
                        height={400}
                        className="rounded-lg"
                    />
                </div>

                {/* Right Form Section */}
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
                        Login Here
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                        {/* Email */}
                        <div className="flex flex-col">
                            <label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                id="email"
                                name="email"
                                placeholder="Enter email"
                                required
                                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col">
                            <label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                id="password"
                                name="password"
                                placeholder="Enter password"
                                required
                                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>

                        {/* Role */}
                        <div className="flex flex-col">
                            <label htmlFor="role" className="text-sm font-semibold text-gray-700 mb-1">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            >
                                <option value="">
                                    Select Role
                                </option>
                                <option value="admin">Admin</option>
                                <option value="teacher">Teacher</option>
                                <option value="student">Student</option>
                            </select>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            className="mt-4 bg-gradient-to-r from-blue-900 to-teal-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
