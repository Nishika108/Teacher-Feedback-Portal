const {z} = require("zod");

const signUpSchema = z.object({
    userName: z
    .string({required_error:"Name is require"})
    .trim()
    .min(3, "Username should be at least 3 characters long")
    .max(255, "Username should not exceed 255 characters"),
    email: z
    .string({required_error:"Email is require"})
    .trim()
    .email("Invalid email address"),
    phone: z
    .string({required_error:"Phone is require"})
    .trim()
    .min(10, "Phone number should be at least 10 digits long"),
    password: z
    .string({required_error:"Password is require"})
    .trim()
    .min(6, "Password should be at least 6 characters long"),
    role: z
    .enum(["admin", "teacher", "student"],{invalid_type_error : "Role must be either admin, teacher, or student"})
    .optional()
});

module.exports = signUpSchema;