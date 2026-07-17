import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, Settings, BarChart3, Menu, X, Sun, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, testId: "navbar-link-dashboard" },
  { to: "/overview", label: "Overview", icon: BarChart3, testId: "navbar-link-overview" },
  { to: "/settings", label: "Settings", icon: Settings, testId: "navbar-link-settings" },
  { to: "/weather", label: "Weather", icon: Sun, testId: "navbar-link-weather" },
  { to: "/analytics", label: "Analytics", icon: Activity, testId: "navbar-link-analytics" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <nav aria-label="Main navigation" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2" data-testid="navbar-logo">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/20">
            <LayoutDashboard className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <span className="hidden text-lg font-bold tracking-tight text-white sm:block">
            Command<span className="text-blue-400">Center</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-slate-800 text-blue-400"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`
                }
                data-testid={item.testId}
              >
                <span className="flex items-center gap-2">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/50 py-1.5 pl-2 pr-3 md:flex">
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500" />
            <div className="text-xs">
              <p className="font-medium text-slate-200">Jordan M.</p>
              <p className="text-slate-500">Operations Lead</p>
            </div>
          </div>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle navigation menu"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            data-testid="sidebar-toggle-button"
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-800 bg-[#0a0a0f]/95 backdrop-blur-xl md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-slate-800 text-blue-400"
                        : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                    }`
                  }
                  data-testid={`${item.testId}-mobile`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
