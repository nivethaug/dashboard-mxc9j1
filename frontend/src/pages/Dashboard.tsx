import { useState, useEffect } from "react";
import {
  Wallet,
  Users,
  Activity,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Bell,
  Search,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

type Metric = {
  id: string;
  label: string;
  value: string;
  change: number;
  trend: "up" | "down";
  icon: React.ElementType;
  testId: string;
};

type ActivityItem = {
  id: string;
  user: string;
  action: string;
  amount: string;
  time: string;
  status: "completed" | "pending" | "failed";
};

const metrics: Metric[] = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: "$284,521",
    change: 12.5,
    trend: "up",
    icon: Wallet,
    testId: "dashboard-kpi-revenue",
  },
  {
    id: "users",
    label: "Active Users",
    value: "18,492",
    change: 8.2,
    trend: "up",
    icon: Users,
    testId: "dashboard-kpi-users",
  },
  {
    id: "sessions",
    label: "Avg. Session",
    value: "4m 32s",
    change: 3.1,
    trend: "down",
    icon: Activity,
    testId: "dashboard-kpi-sessions",
  },
  {
    id: "growth",
    label: "Growth Rate",
    value: "24.7%",
    change: 5.4,
    trend: "up",
    icon: TrendingUp,
    testId: "dashboard-kpi-growth",
  },
];

const chartData = [
  { month: "Jan", revenue: 42, users: 28 },
  { month: "Feb", revenue: 55, users: 35 },
  { month: "Mar", revenue: 48, users: 42 },
  { month: "Apr", revenue: 67, users: 51 },
  { month: "May", revenue: 73, users: 58 },
  { month: "Jun", revenue: 82, users: 64 },
  { month: "Jul", revenue: 95, users: 72 },
  { month: "Aug", revenue: 88, users: 78 },
  { month: "Sep", revenue: 102, users: 85 },
  { month: "Oct", revenue: 115, users: 91 },
  { month: "Nov", revenue: 128, users: 96 },
  { month: "Dec", revenue: 142, users: 104 },
];

const activities: ActivityItem[] = [
  { id: "1", user: "Sarah Chen", action: "Upgraded to Pro Plan", amount: "$49.00", time: "2 min ago", status: "completed" },
  { id: "2", user: "Marcus Reid", action: "New subscription", amount: "$99.00", time: "15 min ago", status: "completed" },
  { id: "3", user: "Elena Petrov", action: "Payment received", amount: "$250.00", time: "1 hour ago", status: "completed" },
  { id: "4", user: "James Wilson", action: "Refund processed", amount: "-$35.00", time: "2 hours ago", status: "pending" },
  { id: "5", user: "Aisha Patel", action: "Account created", amount: "$0.00", time: "3 hours ago", status: "completed" },
  { id: "6", user: "Diego Torres", action: "Payment failed", amount: "$79.00", time: "5 hours ago", status: "failed" },
];

const statusColors: Record<ActivityItem["status"], string> = {
  completed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  failed: "bg-rose-500/15 text-rose-400 border-rose-500/30",
};

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [animatedHeights, setAnimatedHeights] = useState<number[]>(chartData.map(() => 0));

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setAnimatedHeights(chartData.map((d) => d.revenue));
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue));
  const filteredActivities = activities.filter(
    (a) =>
      a.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRefresh = () => {
    setLoading(true);
    setAnimatedHeights(chartData.map(() => 0));
    setTimeout(() => {
      setLoading(false);
      setAnimatedHeights(chartData.map((d) => d.revenue));
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-slate-100" data-testid="dashboard-page">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Command Center
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Monitor your business health and performance in real time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
              <Input
                aria-label="Search activities"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 border-slate-700 bg-slate-900/50 pl-9 text-sm md:w-56"
                data-testid="dashboard-search-input"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifications"
              className="relative border border-slate-700 bg-slate-900/50 hover:bg-slate-800"
              data-testid="dashboard-notifications-button"
            >
              <Bell className="h-4 w-4" aria-hidden="true" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-blue-500" />
            </Button>
            <Button
              onClick={handleRefresh}
              aria-label="Refresh data"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
              data-testid="dashboard-refresh-button"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" />
              Refresh
            </Button>
          </div>
        </header>

        {/* KPI Cards */}
        <section aria-label="Key performance indicators" className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card
                key={metric.id}
                className="group relative overflow-hidden border-slate-800 bg-slate-900/60 backdrop-blur-xl transition-all duration-300 hover:border-slate-700 hover:shadow-2xl hover:shadow-blue-500/10"
                data-testid={metric.testId}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-2.5 ring-1 ring-inset ring-white/10 transition-transform duration-300 group-hover:scale-110">
                      <Icon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`border-transparent ${
                        metric.trend === "up"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-rose-500/15 text-rose-400"
                      }`}
                    >
                      {metric.trend === "up" ? (
                        <ArrowUpRight className="mr-0.5 h-3 w-3" aria-hidden="true" />
                      ) : (
                        <ArrowDownRight className="mr-0.5 h-3 w-3" aria-hidden="true" />
                      )}
                      {metric.change}%
                    </Badge>
                  </div>
                  <p className="mt-4 text-2xl font-bold text-white">
                    {loading ? (
                      <span className="inline-block h-7 w-24 animate-pulse rounded bg-slate-700" />
                    ) : (
                      metric.value
                    )}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{metric.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Charts + Side Panel */}
        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Revenue Chart */}
          <Card
            className="lg:col-span-2 border-slate-800 bg-slate-900/60 backdrop-blur-xl"
            data-testid="dashboard-revenue-chart"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="text-lg text-white">Revenue Overview</CardTitle>
                <p className="text-sm text-slate-400">Monthly performance · Last 12 months</p>
              </div>
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="mr-1 h-3 w-3" aria-hidden="true" />
                +18.2%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="mt-4 flex h-64 items-end justify-between gap-1.5 md:gap-3">
                {chartData.map((data, i) => (
                  <div key={data.month} className="group flex flex-1 flex-col items-center gap-2">
                    <div className="relative flex w-full flex-1 items-end">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-blue-600/40 to-indigo-500 transition-all duration-700 ease-out hover:from-blue-500/60 hover:to-violet-500"
                        style={{
                          height: `${(animatedHeights[i] / maxRevenue) * 100}%`,
                          minHeight: loading ? "4px" : "12px",
                        }}
                      >
                        <div className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-200 shadow-lg group-hover:block">
                          ${data.revenue}K
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{data.month}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goals Panel */}
          <Card
            className="border-slate-800 bg-slate-900/60 backdrop-blur-xl"
            data-testid="dashboard-goals-panel"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Quarterly Goals</CardTitle>
              <p className="text-sm text-slate-400">Q4 2025 targets</p>
            </CardHeader>
            <CardContent className="space-y-5 pt-2">
              {[
                { label: "Revenue Target", value: 78, current: "$221K / $284K", color: "bg-blue-500" },
                { label: "New Customers", value: 62, current: "1,240 / 2,000", color: "bg-indigo-500" },
                { label: "Retention Rate", value: 91, current: "91%", color: "bg-emerald-500" },
                { label: "NPS Score", value: 45, current: "68 / 72", color: "bg-violet-500" },
              ].map((goal) => (
                <div key={goal.label}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300">{goal.label}</span>
                    <span className="text-xs text-slate-500">{goal.current}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className={`h-full rounded-full ${goal.color} transition-all duration-1000 ease-out`}
                      style={{ width: loading ? "0%" : `${goal.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Activity Table */}
        <Card
          className="border-slate-800 bg-slate-900/60 backdrop-blur-xl"
          data-testid="dashboard-activity-table"
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-white">Recent Activity</CardTitle>
              <p className="text-sm text-slate-400">Latest transactions and events</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-400 hover:text-blue-300"
              data-testid="dashboard-view-all-button"
            >
              View All
              <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th scope="col" className="px-6 py-3 font-medium">User</th>
                    <th scope="col" className="px-6 py-3 font-medium">Action</th>
                    <th scope="col" className="hidden px-6 py-3 font-medium md:table-cell">Amount</th>
                    <th scope="col" className="hidden px-6 py-3 font-medium sm:table-cell">Time</th>
                    <th scope="col" className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody aria-live="polite">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i} className="border-b border-slate-800/50">
                        {Array.from({ length: 5 }).map((__, j) => (
                          <td key={j} className="px-6 py-4">
                            <div className="h-4 w-20 animate-pulse rounded bg-slate-800" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filteredActivities.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                        No activities found matching "{searchQuery}"
                      </td>
                    </tr>
                  ) : (
                    filteredActivities.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-500/30 text-xs font-semibold text-blue-300 ring-1 ring-inset ring-white/10">
                              {item.user.split(" ").map((n) => n[0]).join("")}
                            </div>
                            <span className="text-sm font-medium text-slate-200">{item.user}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{item.action}</td>
                        <td className="hidden px-6 py-4 text-sm font-medium text-slate-200 md:table-cell">
                          {item.amount}
                        </td>
                        <td className="hidden px-6 py-4 text-sm text-slate-500 sm:table-cell">{item.time}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={`capitalize ${statusColors[item.status]}`}>
                            {item.status}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
