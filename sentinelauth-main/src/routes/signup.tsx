import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import {
  Eye,
  EyeOff,
  Shield,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Mail,
  Lock,
  User,
} from "lucide-react";

import { motion } from "framer-motion";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/hooks/use-auth";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

import { signUpSchema, passwordStrength } from "@/lib/auth-helpers";

export const Route = createFileRoute("/signup")({
  component: SignupPage,
  head: () => ({
    meta: [
      {
        title: "Create Account — Sentinel",
      },
      {
        name: "description",
        content: "Create your secure Sentinel account.",
      },
    ],
  }),
});

function SignupPage() {
  const navigate = useNavigate();

  const { user, loading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPw, setShowPw] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const strength = useMemo(
    () => passwordStrength(password),
    [password]
  );

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/dashboard" });
    }
  }, [loading, user, navigate]);

  const handleGoBack = () => {
    window.history.back();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = signUpSchema.safeParse({
      name,
      email,
      password,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    try {
      setSubmitting(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },

          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      if (!data.user) {
        toast.error("Unable to create account");
        return;
      }

      // Create profile
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: data.user.id,
          name,
        });

      if (profileError) {
        console.error("Profile Error:", profileError);
      }

      // Save login history
      const { error: historyError } = await supabase
        .from("login_history")
        .insert({
          user_id: data.user.id,
          user_agent: navigator.userAgent,
        });

      if (historyError) {
        console.error("History Error:", historyError);
      }

      // EMAIL CONFIRMATION ENABLED
      if (!data.session) {
        toast.success(
          "Account created successfully! Please check your email to verify your account."
        );

        navigate({
          to: "/login",
        });

        return;
      }

      // DIRECT LOGIN
      toast.success("Welcome to Sentinel!");

      navigate({
        to: "/dashboard",
      });

    } catch (error) {
      console.error(error);

      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogle = async () => {
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/auth/callback`,
      });

      if (result.error) {
        toast.error("Google sign-in failed");
      }

    } catch (error) {
      console.error(error);

      toast.error("Unable to continue with Google");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-background">

      {/* BACK BUTTON */}
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleGoBack}
        className="absolute left-6 top-6 z-50 flex items-center gap-2 rounded-xl border bg-background/80 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:bg-muted"
      >
        <ArrowLeft className="h-4 w-4" />
        Go Back
      </motion.button>

      {/* CENTER */}
      <div className="flex w-full items-center justify-center px-6 py-10">

        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >

          {/* LOGO */}
          <Link
            to="/"
            className="mb-8 flex items-center justify-center gap-3"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xl">
              <Shield className="h-5 w-5" />
            </div>

            <span className="text-2xl font-bold">
              Sentinel
            </span>
          </Link>

          {/* CARD */}
          <div className="rounded-3xl border bg-card/80 p-8 shadow-2xl backdrop-blur-2xl">

            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Create account
              </h1>

              <p className="text-muted-foreground">
                Start your secure journey with Sentinel.
              </p>
            </div>

            {/* GOOGLE */}
            <Button
              onClick={onGoogle}
              variant="outline"
              size="lg"
              className="mt-8 h-12 w-full rounded-xl"
            >
              Continue with Google
            </Button>

            {/* FORM */}
            <form
              onSubmit={onSubmit}
              className="mt-6 space-y-5"
            >

              {/* NAME */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Full Name
                </Label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 rounded-xl pl-10"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email Address
                </Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 rounded-xl pl-10"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <Label htmlFor="password">
                  Password
                </Label>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl pl-10 pr-12"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPw((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPw ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {password && (
                  <p className="text-xs text-muted-foreground">
                    Strength: {strength.label}
                  </p>
                )}
              </div>

              {/* SUBMIT */}
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="h-12 w-full rounded-xl"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

            </form>

            {/* FOOTER */}
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}

              <Link
                to="/login"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>
            </div>

          </div>
        </motion.div>
      </div>
    </main>
  );
}