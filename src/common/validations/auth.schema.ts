import { z } from "zod";


export const usernameSchema = z
  .string()
  .min(3, { message: "Username must be at least 3 characters long." })
  .max(15, { message: "Username must be at most 15 characters long." })
  .regex(/^(?![_\.])[a-zA-Z0-9._]+(?<![_.])$/, {
    message: "Username can only contain letters, numbers, dots, and underscores, and cannot start or end with them.",
  });

export const emailSchema = z
  .string()
  .email({ message: "Invalid email address." });

export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .max(64, { message: "Password must be at most 64 characters long." });


export const signupSchema = z.object({
  username: usernameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match.",
});

export const updateProfileSchema = z.object({
  username: usernameSchema,
  profileImage: z.string().url().optional(),
});
