import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Lock,
  Users,
  Activity,
  Sparkles,
  ArrowRight,
  Globe,
  Radar,
  Layers3,
  CheckCircle2,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Sentinel — Production-grade authentication" },
      {
        name: "description",
        content:
          "A secure, modern authentication platform with enterprise-grade security, session tracking, RBAC and intelligent monitoring.",
      },
    ],
  }),
});

function Landing() {
  const { user } = useAuth();

  const features = [
    {
      icon: Lock,
      title: "Enterprise Security",
      desc: "JWT authentication, password hashing, session protection and database-level security policies.",
    },
    {
      icon: Users,
      title: "Role-Based Access",
      desc: "Secure permission layers with protected routes and enforced server-side authorization.",
    },
    {
      icon: Activity,
      title: "Session Intelligence",
      desc: "Track login activity, devices, timestamps and suspicious authentication attempts.",
    },
    {
      icon: Shield,
      title: "Production Ready",
      desc: "Type-safe architecture with scalable infrastructure and secure-by-default practices.",
    },
  ];

  const stats = [
    "JWT Secured",
    "RLS Enabled",
    "OAuth Ready",
    "Type Safe",
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[500px] w-[500px] rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-[350px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-500/10 blur-3xl" />

        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:70px_70px]" />
      </div>

      {/* Floating Objects */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute left-10 top-40 hidden h-28 w-28 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl lg:block"
      />

      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
        className="absolute bottom-32 right-20 hidden h-40 w-40 rounded-full border border-white/10 bg-gradient-to-br from-violet-500/20 to-cyan-500/20 backdrop-blur-2xl lg:block"
      />

      {/* Navbar */}
      <header className="container mx-auto flex items-center justify-between px-6 py-7">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_0_25px_rgba(168,85,247,0.5)]">
            <Shield className="h-5 w-5 text-white" />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight">Sentinel</h1>
            <p className="text-xs text-zinc-400">
              Modern Auth Infrastructure
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
          <a
            href="#features"
            className="transition hover:text-white"
          >
            Features
          </a>

          <a
            href="#security"
            className="transition hover:text-white"
          >
            Security
          </a>

          <a
            href="#dashboard"
            className="transition hover:text-white"
          >
            Dashboard
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <Button
              asChild
              className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 text-white hover:opacity-90"
            >
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10"
              >
                <Link to="/login">Sign in</Link>
              </Button>

              <Button
                asChild
                className="rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-6 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] transition hover:scale-[1.02]"
              >
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="container relative mx-auto px-6 pb-24 pt-14 md:pb-36 md:pt-28">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-zinc-300 backdrop-blur-xl"
          >
            <Sparkles className="h-4 w-4 text-violet-400" />
            Production-ready • RLS-secured • Enterprise-grade
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto mt-8 max-w-5xl text-5xl font-black leading-[1.05] tracking-tight md:text-7xl"
          >
            Authentication
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              infrastructure{" "}
            </span>
            built for modern applications.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-zinc-400 md:text-xl"
          >
            Secure authentication, intelligent session management,
            role-based access control and production-grade security —
            all inside one modern platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-12 flex flex-wrap items-center justify-center gap-5"
          >
            <Button
              asChild
              className="group h-14 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-8 text-base text-white shadow-[0_0_40px_rgba(168,85,247,0.4)] transition-all hover:scale-[1.03]"
            >
              <Link to={user ? "/dashboard" : "/signup"}>
                {user ? "Open Dashboard" : "Create Account"}

                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            {!user && (
              <Button
                asChild
                variant="ghost"
                className="h-14 rounded-2xl border border-white/10 bg-white/5 px-8 text-base backdrop-blur-xl hover:bg-white/10"
              >
                <Link to="/login">I already have an account</Link>
              </Button>
            )}
          </motion.div>

          {/* Stats */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
            {stats.map((item) => (
              <div
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-2 text-sm text-zinc-300 backdrop-blur-xl"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section
        id="dashboard"
        className="container mx-auto px-6 pb-28"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-500/10" />

          <div className="relative grid gap-8 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-1 text-sm text-violet-300">
                Real-time Security Monitoring
              </div>

              <h2 className="text-4xl font-bold leading-tight">
                Complete visibility into your authentication system.
              </h2>

              <p className="mt-5 text-zinc-400">
                Monitor active sessions, failed login attempts,
                suspicious activity and user analytics from a clean,
                enterprise-grade dashboard.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Advanced session tracking",
                  "Threat detection system",
                  "Live authentication analytics",
                  "Multi-device monitoring",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-violet-400" />
                    <span className="text-zinc-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fake Dashboard */}
            <div className="relative">
              <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="font-semibold">Security Overview</h3>
                    <p className="text-sm text-zinc-500">
                      Last 24 hours
                    </p>
                  </div>

                  <div className="rounded-xl bg-violet-500/10 px-3 py-1 text-sm text-violet-300">
                    Protected
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-cyan-400" />
                      <span className="text-sm text-zinc-400">
                        Active Users
                      </span>
                    </div>

                    <h2 className="mt-4 text-3xl font-bold">12.4K</h2>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-violet-400" />
                      <span className="text-sm text-zinc-400">
                        Threat Score
                      </span>
                    </div>

                    <h2 className="mt-4 text-3xl font-bold">98%</h2>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-2">
                      <Radar className="h-5 w-5 text-fuchsia-400" />
                      <span className="text-sm text-zinc-400">
                        Sessions
                      </span>
                    </div>

                    <h2 className="mt-4 text-3xl font-bold">8.2K</h2>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-emerald-400" />
                      <span className="text-sm text-zinc-400">
                        Regions
                      </span>
                    </div>

                    <h2 className="mt-4 text-3xl font-bold">42</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="container mx-auto px-6 pb-32"
      >
        <div className="mb-16 text-center">
          <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 backdrop-blur-xl">
            Powerful Authentication Features
          </div>

          <h2 className="mt-6 text-4xl font-bold md:text-5xl">
            Built for security,
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              {" "}
              scalability
            </span>
            , and modern workflows.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <motion.div
              whileHover={{ y: -6 }}
              key={f.title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-2xl transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/0 to-cyan-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:from-violet-500/10 group-hover:to-cyan-500/10" />

              <div className="relative">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_0_25px_rgba(168,85,247,0.35)]">
                  <f.icon className="h-6 w-6 text-white" />
                </div>

                <h3 className="text-xl font-semibold">{f.title}</h3>

                <p className="mt-4 leading-7 text-zinc-400">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 text-sm text-zinc-500 md:flex-row">
          <div className="flex items-center gap-2">
            <Layers3 className="h-4 w-4" />
            Built with enterprise-grade security architecture.
          </div>

          <div>
            © 2026 Sentinel Authentication Platform
          </div>
        </div>
      </footer>
    </div>
  );
}