"use client"
import { useAuth } from "@/Store/auth";
import axios from "axios";
import Image from "next/image"
import { useState } from "react";
import { toast } from "react-toastify";

type userContact = {
    userName: string,
    email: string,
    message: string
};
export const Contact = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth(); //useContext(AuthContext) || {};
    const [formData, setFormData] = useState<userContact>({
        userName: "",
        email: "",
        message: ""
    });
    const [userData, setUserData] = useState(true);
    if (user && userData) {
        setFormData((prev) => ({
            ...prev,
            userName: user.userName,
            email: user.email
        }));
        setUserData(false);
    }
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        console.log(formData);
        try {
            const payload = {
                ...formData
            };
            const res = await axios.post(
                "http://localhost:5001/api/form/contact",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (res.status === 201) {
                setFormData({
                    userName: "",
                    email: "",
                    message: ""
                });
                toast.success(res.data.message || "Provider registered successfully!");
            } else {
                toast.error(
                    typeof res.data.message === "string" ? res.data.message : "All fields required!"
                );
            }
        } catch (err: any) {
            console.error("Error submitting:", err);
            toast.error("Failed to Contact US!");
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-900 to-teal-600 px-4 text-black">
            <h1 className="text-3xl font-bold text-center text-white p-4">Help Us to Improve</h1>
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-4xl">

                {/* Left Image Section */}
                <div className="md:w-1/2 bg-gradient-to-r from-blue-900 to-teal-600 flex items-center justify-center p-6">
                    <Image
                        src="/Contact.png"
                        alt="Contact illustration"
                        width={400}
                        height={400}
                        className="rounded-lg"
                    />
                </div>

                {/* Right Form Section */}
                <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
                        Contact Me
                    </h1>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        {/* userName */}
                        <div className="flex flex-col">
                            <label htmlFor="userName" className="text-sm font-semibold text-gray-700 mb-1">User Name</label>
                            <input
                                type="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                id="userName"
                                name="userName"
                                placeholder="Enter UserName"
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

                        {/* message */}
                        <div className="flex flex-col">
                            <label htmlFor="message" className="text-sm font-semibold text-gray-700 mb-1">message</label>
                            <input
                                type="message"
                                value={formData.message}
                                onChange={handleChange}
                                id="message"
                                name="message"
                                placeholder="Enter your message"
                                required
                                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none"
                            />
                        </div>

                        {/* Button */}
                        <button
                            type="submit"
                            className="mt-4 bg-gradient-to-r from-blue-900 to-teal-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
