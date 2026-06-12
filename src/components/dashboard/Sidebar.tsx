"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  Home,
  Users,
  BarChart3,
  Settings,
  LogOut,
  X,
  UserSquare2,
  Wrench,
  CalendarCheck,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/provider";
import { useDashboard } from "./DashboardShell";

const navItems = [
  { label: "Overview",    href: "/dashboard",              icon: LayoutDashboard, exact: true  },
  { label: "Leads",       href: "/dashboard/leads",        icon: Users,           exact: false },
  { label: "Properties",  href: "/dashboard/properties",   icon: Home,            exact: false },
  { label: "Tenants",     href: "/dashboard/tenants",      icon: UserSquare2,     exact: false },
  { label: "Maintenance", href: "/dashboard/maintenance",  icon: Wrench,          exact: false },
  { label: "Showings",    href: "/dashboard/visits",       icon: CalendarCheck,   exact: false },
  { label: "Analytics",   href: "/dashboard/analytics",    icon: BarChart3,       exact: false },
  { label: "Settings",    href: "/dashboard/settings",     icon: Settings,        exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const { mobileOpen, setMobileOpen } = useDashboard();

  const initials = profile?.full_name
    ? profile.full_name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "sidebar-premium fixed left-0 top-0 h-screen w-[240px] flex flex-col z-50 transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Subtle top accent glow */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(91,141,239,0.6), transparent)" }} />

        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-5 shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 relative"
            style={{
              background: "linear-gradient(135deg, #5b8def 0%, #3b82f6 100%)",
              boxShadow: "0 4px 20px rgba(91,141,239,0.45)",
            }}
          >
            <Building2 size={16} className="text-white" />
            {/* Glow ring */}
            <div className="absolute inset-0 rounded-xl"
              style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)" }} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold leading-none">
              <span className="text-white">Estate</span>
              <span style={{ background: "linear-gradient(135deg, #5b8def, #85aef5)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Flow</span>
            </p>
            <p className="text-[10px] mt-0.5 flex items-center gap-1" style={{ color: "rgba(255,255,255,0.3)" }}>
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              AI CRM · Live
            </p>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
            aria-label="Close menu"
          >
            <X size={15} />
          </button>
        </div>

        {/* Nav section label */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-[9.5px] font-bold uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.2)" }}>
            Navigation
          </p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 flex flex-col gap-0.5 overflow-y-auto pb-4">
          {navItems.map((item) => {
            const active = isActive(pathname, item.href, item.exact);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200",
                  active
                    ? "text-white"
                    : "hover:text-white"
                )}
                style={
                  active
                    ? {
                        background: "linear-gradient(135deg, rgba(91,141,239,0.2) 0%, rgba(59,130,246,0.12) 100%)",
                        border: "1px solid rgba(91,141,239,0.25)",
                        color: "#fff",
                        boxShadow: "0 4px 20px rgba(91,141,239,0.12)",
                      }
                    : {
                        color: "rgba(255,255,255,0.45)",
                        border: "1px solid transparent",
                      }
                }
              >
                {/* Left accent bar for active */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ background: "linear-gradient(180deg, #5b8def, #85aef5)", boxShadow: "0 0 8px rgba(91,141,239,0.8)" }} />
                )}
                <item.icon
                  size={15}
                  className="shrink-0 transition-transform duration-200 group-hover:scale-110"
                  style={{ color: active ? "#85aef5" : undefined }}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* AI status strip */}
        <div className="mx-3 mb-3 rounded-xl overflow-hidden relative" style={{ height: "72px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=70"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(7,12,24,0.92) 0%, rgba(7,12,24,0.6) 100%)" }} />
          <div className="absolute inset-0 flex flex-col justify-center px-3.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap size={10} className="text-blue-400" />
              <p className="text-[9.5px] font-bold uppercase tracking-[0.12em]" style={{ color: "rgba(133,174,245,0.9)" }}>
                AI Active
              </p>
            </div>
            <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.35)" }}>Monitoring all channels 24/7</p>
          </div>
          {/* Subtle border */}
          <div className="absolute inset-0 rounded-xl"
            style={{ border: "1px solid rgba(91,141,239,0.18)" }} />
        </div>

        {/* Bottom: sign out + user */}
        <div className="px-3 pb-4 flex flex-col gap-1.5"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: "12px" }}>
          <button
            onClick={signOut}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all w-full"
            style={{ color: "rgba(255,255,255,0.35)", border: "1px solid transparent" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(248,113,113,0.08)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(248,113,113,0.15)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.35)";
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "transparent";
            }}
          >
            <LogOut size={15} className="shrink-0" />
            <span>Sign out</span>
          </button>

          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}>
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{
                background: "linear-gradient(135deg, #5b8def 0%, #3b82f6 100%)",
                boxShadow: "0 2px 10px rgba(91,141,239,0.35)",
              }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold truncate leading-none" style={{ color: "rgba(255,255,255,0.85)" }}>
                {profile?.full_name ?? "Loading…"}
              </p>
              <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
                Broker · Owner
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
