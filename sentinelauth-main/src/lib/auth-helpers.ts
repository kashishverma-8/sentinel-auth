import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export const emailSchema = z.string().trim().email("Enter a valid email").max(255);
export const passwordSchema = z
  .string()
  .min(8, "Min 8 characters")
  .max(72, "Max 72 characters")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[0-9]/, "Add a number");

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Name required").max(80),
  email: emailSchema,
  password: passwordSchema,
});

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password required").max(72),
});

export function passwordStrength(pw: string): { score: number; label: string } {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
  return { score, label: labels[score] };
}

export async function recordLogin(userId: string) {
  try {
    await supabase.from("login_history").insert({
      user_id: userId,
      user_agent: typeof navigator !== "undefined" ? navigator.userAgent : null,
    });
  } catch (e) {
    console.error("login history insert failed", e);
  }
}
