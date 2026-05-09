import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  Shield,
  Loader2,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

import { signInSchema, recordLogin } from "@/lib/auth-helpers";

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    meta: [
      {
        title: "Login — Sentinel Security",
      },
      {
        name: "description",
        content: "Securely sign in to your Sentinel account.",
      },
    ],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      navigate({ to: "/dashboard" });
    }
  }, [loading, user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = signInSchema.safeParse({
      email,
      password,
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    try {
      setSubmitting(true);

      const { data, error } = await supabase.auth.signInWithPassword(
  parsed.data
);

if (error) {
  toast.error(error.message);
  return;
}

if (!data.user?.email_confirmed_at) {
  toast.error("Please verify your email first");
  return;
}

if (data.user) {
  await recordLogin(data.user.id);
}

toast.success("Successfully signed in");

navigate({
  to: "/dashboard",
});
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const onGoogle = async () => {
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/dashboard`,
      });

      if (result.error) {
        toast.error("Google sign-in failed");
      }
    } catch (error) {
      toast.error("Unable to continue with Google");
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-background">
      {/* BACK BUTTON */}
      <button
        onClick={handleGoBack}
        className="absolute left-6 top-6 z-50 flex items-center gap-2 rounded-xl border bg-background/80 px-4 py-2 text-sm font-medium shadow-md backdrop-blur transition-all hover:scale-[1.02] hover:bg-muted"
      >
        <ArrowLeft className="h-4 w-4" />
        Go Back
      </button>

      {/* LEFT SIDE */}
      <div className="relative hidden overflow-hidden border-r bg-gradient-to-br from-primary/10 via-background to-background lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(120,119,198,0.15),transparent_35%)]" />

        <div className="relative z-10 flex flex-col justify-between p-12">
          <div>
            <Link
              to="/"
              className="flex items-center gap-3 transition-opacity hover:opacity-80"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <Shield className="h-5 w-5" />
              </div>

              <div>
                <h1 className="text-xl font-bold tracking-tight">
                  Sentinel
                </h1>

                <p className="text-sm text-muted-foreground">
                  Advanced Security Platform
                </p>
              </div>
            </Link>
          </div>

          <div className="max-w-lg">
            <div className="space-y-6">
              <div className="inline-flex items-center rounded-full border bg-background/70 px-4 py-2 text-sm backdrop-blur">
                Enterprise-grade authentication
              </div>

              <h2 className="text-5xl font-bold leading-tight tracking-tight">
                Secure access for modern applications.
              </h2>

              <p className="text-lg leading-relaxed text-muted-foreground">
                Protect your users with fast, secure, and scalable
                authentication infrastructure built for modern web platforms.
              </p>

              <div className="grid gap-4 pt-6 sm:grid-cols-2">
                <FeatureCard
                  title="OAuth Login"
                  description="Google authentication with secure redirects."
                />

                <FeatureCard
                  title="Encrypted Sessions"
                  description="Industry-standard authentication security."
                />

                <FeatureCard
                  title="Fast Performance"
                  description="Optimized authentication flow experience."
                />

                <FeatureCard
                  title="Protected Dashboard"
                  description="Secure route handling and access control."
                />
              </div>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            © 2026 Sentinel Security Systems
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2">
        <div className="w-full max-w-md">
          {/* MOBILE LOGO */}
          <Link
            to="/"
            className="mb-8 flex items-center justify-center gap-3 lg:hidden"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <Shield className="h-5 w-5" />
            </div>

            <span className="text-xl font-bold tracking-tight">
              Sentinel
            </span>
          </Link>

          <div className="rounded-3xl border bg-card/80 p-8 shadow-2xl backdrop-blur-xl">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back
              </h1>

              <p className="text-muted-foreground">
                Sign in to continue to your account.
              </p>
            </div>

            {/* GOOGLE BUTTON */}
            <Button
              onClick={onGoogle}
              variant="outline"
              size="lg"
              className="mt-8 h-12 w-full rounded-xl text-sm font-medium"
            >
              <GoogleIcon />
              Continue with Google
            </Button>

            {/* DIVIDER */}
            <div className="my-8 flex items-center gap-4">
              <div className="h-px flex-1 bg-border" />

              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Or continue with email
              </span>

              <div className="h-px flex-1 bg-border" />
            </div>

            {/* FORM */}
            <form onSubmit={onSubmit} className="space-y-5">
              {/* EMAIL */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 rounded-xl pl-10 pr-12"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* SUBMIT */}
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="h-12 w-full rounded-xl text-sm font-semibold"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* FOOTER */}
            <div className="mt-8 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-primary hover:underline"
              >
                Create account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border bg-background/70 p-4 backdrop-blur transition-all hover:scale-[1.02] hover:shadow-lg">
      <h3 className="font-semibold">{title}</h3>

      <p className="mt-1 text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />

      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />

      <path
        fill="#FBBC05"
        d="M5.84 14.09A7.03 7.03 0 015.49 12c0-.73.13-1.43.35-2.09V7.07H2.18A11.96 11.96 0 001 12c0 1.92.46 3.73 1.18 4.93l3.66-2.84z"
      />

      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}