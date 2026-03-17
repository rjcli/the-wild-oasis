import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export const updateMeSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .optional(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const adminUpdateUserSchema = z.object({
  fullName: z.string().min(2).optional(),
  role: z.enum(["admin", "user"]).optional(),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type SignupDto = z.infer<typeof signupSchema>;
export type UpdatePasswordDto = z.infer<typeof updatePasswordSchema>;
export type UpdateMeDto = z.infer<typeof updateMeSchema>;
export type AdminUpdateUserDto = z.infer<typeof adminUpdateUserSchema>;
