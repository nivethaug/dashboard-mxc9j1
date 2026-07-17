import { useState, useEffect } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Server,
  Zap,
  Clock,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RegionData = {
  region: string;
  users: number;
  revenue: number;
  share: number;
};

type ServiceMetric = {
  name: string;
  status: "operational" | "degraded" | "down";
  uptime: number;
  latency: number;
};

const regions: RegionData[] = [
  { region: "North America", users: 8240, revenue: 142000, share: 45 },
  { region: "Europe", users: 5102, revenue: 88000, share: 28 },
  { region: "Asia Pacific", users: 3421, revenue: 41000, share: 19 },
  { region: "Latin America", users: 1189, revenue: 9500, share: 6 },
  { region: "Middle East", users: 540, revenue: 4021, share: 2 },
];

const services: ServiceMetric[] = [
  { name: "API Gateway", status: "operational", uptime: 99.98, latency: 42 },
  { name: "Web Application", status: "operational", uptime: 99.95, latency: 120 },
  { name: "Database Cluster", status: "operational", uptime: 99.99, latency: 8 },
  { name: "Background Workers", status: "degraded", uptime: 97.82, latency: 340 },
  { name: "CDN Network", status: "operational", uptime: 99.97, latency: 15 },
  { name: "Email Service", status: "operational", uptime: 99.91, latency: 220 },
];

const trafficData = [
  { day: "Mon", visitors: 3200, conversions: 180 },
  { day: "Tue", visitors: 4100, conversions: 240 },
  { day: "Wed", visitors: 3800, conversions: 210 },
  { day: "Thu", visitors: 5200, conversions: 310 },
  { day: "Fri", visitors: 6100, conversions: 380 },
  { day: "Sat", visitors: 4500, conversions: 260 },
  { day: "Sun", visitors: 3900, conversions: 220 },
];

const statusConfig: Record<
  ServiceMetric["status"],
  { color: string; dot: string; label: string }
> = {
  operational: { color: "text-emerald-400", dot: "bg-emerald-500", label: "Operational" },
  degraded: { color: "text-amber-400", dot: "bg-amber-500", label: "Degraded" },
  down: { color: "text-rose-400", dot: "bg-rose-500", label: "Down" },
};

export default function Overview() {
  const [timeRange, setTimeRange] = useState("7d");
  const [loading, setLoading] = useState(true);
  const [animatedBars, setAnimatedBars] = useState<number[]>(trafficData.map(() => 0));

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setAnimatedBars(trafficData.map((d) => d.visitors));
    }, 500);
    return () => clearTimeout(timer);
  }, [timeRange]);

  const maxVisitors = Math.max(...trafficData.map((d) => d.visitors));
  const totalVisitors = trafficData.reduce((sum, d) => sum + d.visitors, 0);
  const totalConversions = trafficData.reduce((sum, d) => sum + d.conversions, 0);
  const conversionRate = ((totalConversions / totalVisitors) * 100).toFixed(1);

  const summaryStats = [
    { label: "Total Visitors", value: totalVisitors.toLocaleString(), change: 14.2, trend: "up" as const, icon: Users, testId: "overview-stat-visitors" },
    { label: "Conversions", value: totalConversions.toLocaleString(), change: 9.8, trend: "up" as const, icon: Zap, testId: "overview-stat-conversions" },
    { label: "Conversion Rate", value: `${conversionRate}%`, change: 2.1, trend: "up" as const, icon: TrendingUp, testId: "overview-stat-conversion-rate" },
    { label: "Avg. Response", value: "128ms", change: 5.3, trend: "down" as const, icon: Clock, testId: "overview-stat-response" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-slate-100" data-testid="overview-page">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Overview</h1>
            <p className="mt-1 text-sm text-slate-400">
              Cross-platform analytics and system performance at a glance
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger
                className="w-32 border-slate-700 bg-slate-900/50"
                aria-label="Select time range"
                data-testid="overview-time-range-select"
              >
                <Calendar className="mr-2 h-4 w-4" aria-hidden="true" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                <SelectItem value="90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="border-slate-700 bg-slate-900/50 text-slate-300 hover:bg-slate-800"
              data-testid="overview-export-button"
            >
              <Download className="mr-2 h-4 w-4" aria-hidden="true" />
              Export
            </Button>
          </div>
        </header>

        {/* Summary Stats */}
        <section aria-label="Summary statistics" className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryStats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="group border-slate-800 bg-slate-900/60 backdrop-blur-xl transition-all duration-300 hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/10"
                data-testid={stat.testId}
              >
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-slate-400 transition-colors group-hover:text-indigo-400" aria-hidden="true" />
                    <Badge
                      variant="outline"
                      className={`border-transparent ${
                        stat.trend === "up"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-rose-500/15 text-rose-400"
                      }`}
                    >
                      {stat.trend === "up" ? (
                        <ArrowUpRight className="mr-0.5 h-3 w-3" aria-hidden="true" />
                      ) : (
                        <ArrowDownRight className="mr-0.5 h-3 w-3" aria-hidden="true" />
                      )}
                      {stat.change}%
                    </Badge>
                  </div>
                  <p className="mt-4 text-2xl font-bold text-white">
                    {loading ? (
                      <span className="inline-block h-7 w-20 animate-pulse rounded bg-slate-700" />
                    ) : (
                      stat.value
                    )}
                  </p>
                  <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* Traffic Chart + Regional Breakdown */}
        <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Traffic Chart */}
          <Card
            className="lg:col-span-2 border-slate-800 bg-slate-900/60 backdrop-blur-xl"
            data-testid="overview-traffic-chart"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <BarChart3 className="h-5 w-5 text-indigo-400" aria-hidden="true" />
                  Traffic & Conversions
                </CardTitle>
                <p className="text-sm text-slate-400">Daily visitors and conversion events</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" aria-hidden="true" />
                  Visitors
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="h-2.5 w-2.5 rounded-full bg-violet-400" aria-hidden="true" />
                  Conversions
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mt-4 flex h-64 items-end justify-between gap-2 md:gap-4">
                {trafficData.map((data, i) => (
                  <div key={data.day} className="group flex flex-1 flex-col items-center gap-2">
                    <div className="relative flex w-full flex-1 flex-col justify-end gap-1">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-violet-500/60 to-violet-400 transition-all duration-700 ease-out"
                        style={{
                          height: `${(data.conversions / maxVisitors) * 100}%`,
                          minHeight: loading ? "0" : "6px",
                          opacity: loading ? 0 : 1,
                        }}
                      />
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-indigo-600/50 to-indigo-400 transition-all duration-700 ease-out"
                        style={{
                          height: `${(animatedBars[i] / maxVisitors) * 100}%`,
                          minHeight: loading ? "4px" : "12px",
                        }}
                      >
                        <div className="pointer-events-none absolute -top-10 left-1/2 hidden -translate-x-1/2 flex-col items-center whitespace-nowrap rounded-lg bg-slate-800 px-2.5 py-1.5 text-xs shadow-xl group-hover:flex">
                          <span className="font-semibold text-indigo-300">{data.visitors.toLocaleString()} visitors</span>
                          <span className="text-violet-300">{data.conversions} conversions</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{data.day}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Regional Breakdown */}
          <Card
            className="border-slate-800 bg-slate-900/60 backdrop-blur-xl"
            data-testid="overview-regional-breakdown"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-white">Top Regions</CardTitle>
              <p className="text-sm text-slate-400">User distribution by geography</p>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {regions.map((region) => (
                <div key={region.region} data-testid={`overview-region-${region.region.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-300">{region.region}</span>
                    <span className="text-xs text-slate-500">{region.share}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-1000 ease-out"
                      style={{ width: loading ? "0%" : `${region.share}%` }}
                    />
                  </div>
                  <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                    <span>{region.users.toLocaleString()} users</span>
                    <span>${(region.revenue / 1000).toFixed(1)}K</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* System Health */}
        <Card
          className="border-slate-800 bg-slate-900/60 backdrop-blur-xl"
          data-testid="overview-system-health"
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Server className="h-5 w-5 text-blue-400" aria-hidden="true" />
                System Health
              </CardTitle>
              <p className="text-sm text-slate-400">Real-time service status and performance</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-400 hover:text-blue-300"
              data-testid="overview-view-details-button"
            >
              Details
              <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 text-left text-xs uppercase tracking-wider text-slate-500">
                    <th scope="col" className="px-6 py-3 font-medium">Service</th>
                    <th scope="col" className="px-6 py-3 font-medium">Status</th>
                    <th scope="col" className="hidden px-6 py-3 font-medium sm:table-cell">Uptime (30d)</th>
                    <th scope="col" className="hidden px-6 py-3 font-medium md:table-cell">Avg Latency</th>
                    <th scope="col" className="px-6 py-3 font-medium">Health</th>
                  </tr>
                </thead>
                <tbody aria-live="polite">
                  {loading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="border-b border-slate-800/50">
                        {Array.from({ length: 5 }).map((__, j) => (
                          <td key={j} className="px-6 py-4">
                            <div className="h-4 w-20 animate-pulse rounded bg-slate-800" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    services.map((service) => {
                      const config = statusConfig[service.status];
                      return (
                        <tr
                          key={service.name}
                          className="border-b border-slate-800/50 transition-colors hover:bg-slate-800/30"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Activity className="h-4 w-4 text-slate-500" aria-hidden="true" />
                              <span className="text-sm font-medium text-slate-200">{service.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`flex items-center gap-2 text-sm ${config.color}`}>
                              <span className={`relative flex h-2 w-2 ${service.status === "operational" ? "" : ""}`}>
                                <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${config.dot} opacity-75`} />
                                <span className={`relative inline-flex h-2 w-2 rounded-full ${config.dot}`} />
                              </span>
                              {config.label}
                            </span>
                          </td>
                          <td className="hidden px-6 py-4 text-sm text-slate-300 sm:table-cell">
                            {service.uptime}%
                          </td>
                          <td className="hidden px-6 py-4 text-sm text-slate-300 md:table-cell">
                            {service.latency}ms
                          </td>
                          <td className="px-6 py-4">
                            <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-800">
                              <div
                                className={`h-full rounded-full ${
                                  service.uptime > 99.5
                                    ? "bg-emerald-500"
                                    : service.uptime > 98
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                                }`}
                                style={{ width: `${service.uptime}%` }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
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
