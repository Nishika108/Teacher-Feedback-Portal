"use client"
import { useAuth } from "@/Store/auth";
import axios from "axios";
import Image from "next/image"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

type userRegister = {
    userName: string;
    email: string;
    phone: string;
    password: string;
    role: string;
};
export const Register = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {storeTokenLS} = useAuth();
    const [formData, setFormData] = useState<userRegister>({
        userName: "",
        email: "",
        phone: "",
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
        setIsLoading(true);
        // console.log(formData);
        try {
            const payload = {
                ...formData, 
            };
            const res = await axios.post(
                "http://localhost:5001/api/auth/register",
                payload
            );
            if (res.status === 201) {
                router.push("/Student");
                storeTokenLS(res.data.token);
                setFormData({
                    userName: "",
                    email: "",
                    phone: "",
                    password: "",
                    role: "",
                });
                toast.success(res.data.message || "User registered successfully!");
            } else {
                toast.error(
                    typeof res.data.message === "string" ? res.data.message : "All fields required!"
                );
            }
        } catch (err: any) {
            console.error("Error submitting:", err);
            toast.error("Failed to register provider!");
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
                        src="/register.png"
                        alt="Register illustration"
                        width={400}
                        height={400}
                        className="rounded-lg"
                    />
                </div>

                {/* Right Form Section */}
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
                        Register Here
                    </h1>

                    <form onSubmit = {handleSubmit} className="flex flex-col gap-4">
                        {/* Username */}
                        <div className="flex flex-col">
                            <label htmlFor="userName" className="text-sm font-semibold text-gray-700 mb-1">Username</label>
                            <input
                                type="text"
                                id="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                name="userName"
                                placeholder="Enter username"
                                required
                                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>

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

                        {/* Phone */}
                        <div className="flex flex-col">
                            <label htmlFor="phone" className="text-sm font-semibold text-gray-700 mb-1">Phone No.</label>
                            <input
                                type="text"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                name="phone"
                                placeholder="Enter phone number"
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
                                <option defaultValue="student">
                                    Select Role
                                </option>
                                <option value="teacher">Teacher</option>
                                <option value="student">Student</option>
                            </select>
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            className="mt-4 bg-gradient-to-r from-blue-900 to-teal-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
                        >
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
