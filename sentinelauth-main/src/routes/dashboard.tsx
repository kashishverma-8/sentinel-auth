import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  Shield,
  LogOut,
  Mail,
  Calendar,
  Activity,
  BadgeCheck,
  User as UserIcon,
  Loader2,
  Bell,
  Laptop,
  CheckCircle2,
  X,
  Clock3,
  Sparkles,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
  head: () => ({
    meta: [{ title: "Dashboard — Sentinel" }],
  }),
});

interface LoginRow {
  id: string;
  logged_in_at: string;
  user_agent: string | null;
}

function DashboardPage() {
  const {
    user,
    profile,
    roles,
    loading,
    isAdmin,
    signOut,
    refreshProfile,
  } = useAuth();

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const [history, setHistory] = useState<LoginRow[]>([]);

  // NOTIFICATION STATES
  const [showNotifications, setShowNotifications] =
    useState(false);

  const notifications = [
    {
      id: 1,
      title: "Security scan completed",
      description:
        "Your account passed all Sentinel protection checks.",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "New login detected",
      description:
        "Chrome on Windows successfully authenticated.",
      time: "10 min ago",
      unread: true,
    },
    {
      id: 3,
      title: "Profile updated",
      description:
        "Your profile information synced successfully.",
      time: "1 hour ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter(
    (n) => n.unread
  ).length;

  useEffect(() => {
    if (!loading && !user)
      navigate({ to: "/login" });
  }, [loading, user, navigate]);

  useEffect(() => {
    setName(
      profile?.name ||
        user?.user_metadata?.name ||
        user?.user_metadata?.full_name ||
        user?.email?.split("@")[0] ||
        ""
    );
  }, [profile, user]);

  useEffect(() => {
    if (!user) return;

    supabase
      .from("login_history")
      .select("id, logged_in_at, user_agent")
      .order("logged_in_at", {
        ascending: false,
      })
      .limit(10)
      .then(({ data }) =>
        setHistory(data ?? [])
      );
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#060816]">
        <div className="flex items-center gap-3 text-white">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  const onSave = async () => {
    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        name: name.trim().slice(0, 80),
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) toast.error(error.message);
    else {
      toast.success("Profile updated");
      refreshProfile();
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  const lastLogin =
    history[1]?.logged_in_at ??
    history[0]?.logged_in_at;

  const verified =
    !!user.email_confirmed_at ||
    !!user.confirmed_at;

  return (
    <div className="min-h-screen overflow-hidden bg-[#060816] text-white">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-100px] top-[-100px] h-[400px] w-[400px] rounded-full bg-violet-600/30 blur-[120px]" />

        <div className="absolute bottom-[-100px] right-[-100px] h-[400px] w-[400px] rounded-full bg-cyan-500/20 blur-[120px]" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-2xl">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <Link
            to="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-cyan-500 shadow-[0_0_30px_rgba(139,92,246,0.7)]">
              <Shield className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">
                Sentinel
              </h1>

              <p className="text-xs text-zinc-400">
                Security Dashboard
              </p>
            </div>
          </Link>

          <div className="relative flex items-center gap-3">
            {/* NOTIFICATION BUTTON */}
            <button
              onClick={() =>
                setShowNotifications(
                  !showNotifications
                )
              }
              className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:bg-white/10"
            >
              <Bell className="h-5 w-5 text-zinc-300 transition-transform group-hover:rotate-12" />

              {unreadCount > 0 && (
                <>
                  <span className="absolute right-2 top-2 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-violet-500 px-1 text-[10px] font-bold text-white shadow-[0_0_20px_rgba(34,211,238,0.9)]">
                    {unreadCount}
                  </span>

                  <span className="absolute right-2 top-2 h-5 w-5 animate-ping rounded-full bg-cyan-400/40" />
                </>
              )}
            </button>

            {/* NOTIFICATION PANEL */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                    scale: 0.96,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    scale: 0.96,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  className="absolute right-0 top-16 z-[100] w-[400px] overflow-hidden rounded-[30px] border border-white/10 bg-[#0b1020]/95 shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-3xl"
                >
                  {/* PANEL HEADER */}
                  <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                    <div>
                      <h3 className="text-xl font-black">
                        Notifications
                      </h3>

                      <p className="mt-1 text-sm text-zinc-400">
                        Sentinel activity center
                      </p>
                    </div>

                    <button
                      onClick={() =>
                        setShowNotifications(
                          false
                        )
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all hover:rotate-90 hover:bg-white/10"
                    >
                      <X className="h-4 w-4 text-zinc-300" />
                    </button>
                  </div>

                  {/* PANEL BODY */}
                  <div className="max-h-[420px] overflow-y-auto p-4">
                    <div className="space-y-3">
                      {notifications.map(
                        (notification, index) => (
                          <motion.div
                            key={notification.id}
                            initial={{
                              opacity: 0,
                              x: 20,
                            }}
                            animate={{
                              opacity: 1,
                              x: 0,
                            }}
                            transition={{
                              delay:
                                index * 0.05,
                            }}
                            whileHover={{
                              scale: 1.02,
                            }}
                            className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-2xl transition-all duration-300 hover:bg-white/[0.07]"
                          >
                            {notification.unread && (
                              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-cyan-400 to-violet-500 shadow-[0_0_20px_rgba(34,211,238,0.9)]" />
                            )}

                            <div className="flex items-start gap-4">
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
                                <Sparkles className="h-6 w-6 text-cyan-300" />
                              </div>

                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <h4 className="font-bold text-white">
                                      {
                                        notification.title
                                      }
                                    </h4>

                                    <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                                      {
                                        notification.description
                                      }
                                    </p>
                                  </div>

                                  {notification.unread && (
                                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.9)]" />
                                  )}
                                </div>

                                <div className="mt-4 flex items-center justify-between">
                                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs text-zinc-400">
                                    <Clock3 className="h-3.5 w-3.5" />
                                    {
                                      notification.time
                                    }
                                  </div>

                                  <button className="text-xs font-semibold text-cyan-300 transition hover:text-white">
                                    View
                                  </button>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  </div>

                  {/* PANEL FOOTER */}
                  <div className="border-t border-white/10 p-4">
                    <button
                      onClick={() =>
                        toast.success(
                          "All notifications marked as read"
                        )
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 py-3 text-sm font-semibold text-zinc-300 transition-all duration-300 hover:bg-white/10 hover:text-white"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Mark all as read
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* LOGOUT */}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="rounded-2xl border border-red-500/20 bg-red-500/10 text-red-300 transition-all hover:scale-105 hover:bg-red-500/20"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="container mx-auto px-6 py-10">
        {/* HERO */}
        <div className="mb-8">
          <h1 className="text-4xl font-black md:text-5xl">
  Welcome back,{" "}
  <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
    {profile?.name ||
      user.user_metadata?.name ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "User"}
  </span>
</h1>

          <p className="mt-3 text-zinc-400">
            Manage your account and review
            recent activity.
          </p>
        </div>

        {/* GRID */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* PROFILE */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl lg:col-span-2"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10">
                <UserIcon className="h-5 w-5 text-violet-300" />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Profile
                </h2>

                <p className="text-sm text-zinc-400">
                  Manage account details
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <Label htmlFor="dn-name">
                  Display name
                </Label>

                <Input
                  id="dn-name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="mt-2 h-12 rounded-2xl border-white/10 bg-white/5"
                  maxLength={80}
                />
              </div>

              <div>
                <Label>Email</Label>

                <div className="mt-2 flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-zinc-300">
                  <Mail className="h-4 w-4 text-cyan-400" />
                  {user.email}
                </div>
              </div>

              <Button
                onClick={onSave}
                disabled={
                  saving ||
                  name ===
                    (profile?.name ?? "")
                }
                className="h-12 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-500 px-6 font-semibold shadow-[0_0_30px_rgba(139,92,246,0.6)] transition-all hover:scale-[1.02]"
              >
                {saving && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save changes
              </Button>
            </div>
          </motion.div>

          {/* STATUS */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
            }}
            className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10">
                <BadgeCheck className="h-5 w-5 text-cyan-300" />
              </div>

              <div>
                <h2 className="text-xl font-bold">
                  Account
                </h2>

                <p className="text-sm text-zinc-400">
                  Security overview
                </p>
              </div>
            </div>

            <dl className="space-y-4 text-sm">
              <Stat
                label="Status"
                value={
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                      verified
                        ? "bg-emerald-500/15 text-emerald-300"
                        : "bg-amber-500/15 text-amber-300"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        verified
                          ? "bg-emerald-400"
                          : "bg-amber-400"
                      }`}
                    />

                    {verified
                      ? "Verified"
                      : "Pending"}
                  </span>
                }
              />

              <Stat
                label="Roles"
                value={
                  <div className="flex flex-wrap gap-2">
                    {roles.length === 0 && (
                      <span className="text-zinc-500">
                        —
                      </span>
                    )}

                    {roles.map((r) => (
                      <span
                        key={r}
                        className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-1 text-xs"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                }
              />

              <Stat
                label="Joined"
                value={
                  user.created_at
                    ? format(
                        new Date(
                          user.created_at
                        ),
                        "MMM d, yyyy"
                      )
                    : "—"
                }
                icon={Calendar}
              />

              <Stat
                label="Last login"
                value={
                  lastLogin
                    ? format(
                        new Date(lastLogin),
                        "MMM d, yyyy · HH:mm"
                      )
                    : "First session"
                }
                icon={Activity}
              />
            </dl>

            {isAdmin && (
              <div className="mt-6 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4 text-sm text-violet-300">
                You have admin privileges.
              </div>
            )}
          </motion.div>
        </div>

        {/* LOGIN HISTORY */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.2,
          }}
          className="mt-6 rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-2xl"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-fuchsia-500/10">
              <Activity className="h-5 w-5 text-fuchsia-300" />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                Recent login activity
              </h2>

              <p className="text-sm text-zinc-400">
                Monitor recent sessions
              </p>
            </div>
          </div>

          {history.length === 0 ? (
            <p className="text-sm text-zinc-400">
              No activity yet.
            </p>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-white/5 text-left text-xs uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">
                      When
                    </th>

                    <th className="px-4 py-3">
                      Device
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((row) => (
                    <tr
                      key={row.id}
                      className="border-t border-white/5 transition-all hover:bg-white/[0.03]"
                    >
                      <td className="whitespace-nowrap px-4 py-3">
                        {format(
                          new Date(
                            row.logged_in_at
                          ),
                          "MMM d, HH:mm:ss"
                        )}
                      </td>

                      <td
                        className="truncate px-4 py-3 text-zinc-400"
                        title={
                          row.user_agent ?? ""
                        }
                      >
                        <div className="flex items-center gap-2">
                          <Laptop className="h-4 w-4 text-cyan-400" />

                          {parseUA(
                            row.user_agent
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

function Stat({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="flex items-center gap-2 text-zinc-400">
        {Icon && (
          <Icon className="h-4 w-4" />
        )}

        {label}
      </dt>

      <dd className="text-right font-medium">
        {value}
      </dd>
    </div>
  );
}

function parseUA(ua: string | null) {
  if (!ua) return "Unknown device";

  const browser =
    /Edg\//.test(ua)
      ? "Edge"
      : /Chrome\//.test(ua)
      ? "Chrome"
      : /Firefox\//.test(ua)
      ? "Firefox"
      : /Safari\//.test(ua)
      ? "Safari"
      : "Browser";

  const os =
    /Windows/.test(ua)
      ? "Windows"
      : /Mac OS X/.test(ua)
      ? "macOS"
      : /Android/.test(ua)
      ? "Android"
      : /iPhone|iPad/.test(ua)
      ? "iOS"
      : /Linux/.test(ua)
      ? "Linux"
      : "";

  return `${browser}${
    os ? " · " + os : ""
  }`;
}