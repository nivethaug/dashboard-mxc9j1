import { useState, useMemo } from "react";
import {
  Activity,
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Zap,
  Clock,
  Eye,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TimeRange = "7d" | "30d" | "90d";

interface MetricCard {
  key: string;
  label: string;
  value: string;
  change: number;
  icon: typeof Activity;
  testId: string;
}

interface DayData {
  day: string;
  visitors: number;
  pageviews: number;
}

interface SourceRow {
  source: string;
  visitors: number;
  percentage: number;
  trend: "up" | "down";
}

interface PageRow {
  path: string;
  views: number;
  avgTime: string;
  bounceRate: number;
}

export default function Analytics() {
  const [range, setRange] = useState<TimeRange>("7d");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  // ── Data derived from selected range ──────────────────────────
  const { weeklyData, sources, pages, metrics } = useMemo(() => {
    const multiplier = range === "7d" ? 1 : range === "30d" ? 4.2 : 12.5;

    const days: DayData[] = [
      { day: "Mon", visitors: Math.round(3200 * multiplier), pageviews: Math.round(7800 * multiplier) },
      { day: "Tue", visitors: Math.round(4100 * multiplier), pageviews: Math.round(9200 * multiplier) },
      { day: "Wed", visitors: Math.round(3800 * multiplier), pageviews: Math.round(8500 * multiplier) },
      { day: "Thu", visitors: Math.round(5200 * multiplier), pageviews: Math.round(11800 * multiplier) },
      { day: "Fri", visitors: Math.round(6100 * multiplier), pageviews: Math.round(14200 * multiplier) },
      { day: "Sat", visitors: Math.round(4500 * multiplier), pageviews: Math.round(9900 * multiplier) },
      { day: "Sun", visitors: Math.round(3900 * multiplier), pageviews: Math.round(8700 * multiplier) },
    ];

    const computedSources: SourceRow[] = [
      { source: "Organic Search", visitors: Math.round(12400 * multiplier), percentage: 42, trend: "up" },
      { source: "Direct", visitors: Math.round(6800 * multiplier), percentage: 23, trend: "up" },
      { source: "Social Media", visitors: Math.round(5200 * multiplier), percentage: 18, trend: "down" },
      { source: "Referral", visitors: Math.round(3100 * multiplier), percentage: 11, trend: "up" },
      { source: "Email", visitors: Math.round(1900 * multiplier), percentage: 6, trend: "down" },
    ];

    const computedPages: PageRow[] = [
      { path: "/", views: Math.round(18400 * multiplier), avgTime: "2m 14s", bounceRate: 38 },
      { path: "/overview", views: Math.round(12200 * multiplier), avgTime: "1m 48s", bounceRate: 45 },
      { path: "/weather", views: Math.round(9600 * multiplier), avgTime: "3m 02s", bounceRate: 29 },
      { path: "/settings", views: Math.round(4100 * multiplier), avgTime: "0m 52s", bounceRate: 62 },
      { path: "/analytics", views: Math.round(3400 * multiplier), avgTime: "4m 21s", bounceRate: 22 },
    ];

    const computedMetrics: MetricCard[] = [
      {
        key: "revenue",
        label: "Revenue",
        value: `$${(48200 * multiplier).toLocaleString("en-US", { maximumFractionDigits: 0 })}`,
        change: 12.5,
        icon: DollarSign,
        testId: "analytics-kpi-revenue",
      },
      {
        key: "visitors",
        label: "Unique Visitors",
        value: Math.round(30800 * multiplier).toLocaleString(),
        change: 8.2,
        icon: Eye,
        testId: "analytics-kpi-visitors",
      },
      {
        key: "sessions",
        label: "Sessions",
        value: Math.round(70100 * multiplier).toLocaleString(),
        change: -2.4,
        icon: Zap,
        testId: "analytics-kpi-sessions",
      },
      {
        key: "duration",
        label: "Avg. Session",
        value: "2m 36s",
        change: 5.1,
        icon: Clock,
        testId: "analytics-kpi-duration",
      },
    ];

    return { weeklyData: days, sources: computedSources, pages: computedPages, metrics: computedMetrics };
  }, [range]);

  const maxVisitors = Math.max(...weeklyData.map((d) => d.visitors));
  const totalVisitors = weeklyData.reduce((sum, d) => sum + d.visitors, 0);
  const totalPageviews = weeklyData.reduce((sum, d) => sum + d.pageviews, 0);

  const rangeOptions: { key: TimeRange; label: string }[] = [
    { key: "7d", label: "7 Days" },
    { key: "30d", label: "30 Days" },
    { key: "90d", label: "90 Days" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white" data-testid="analytics-page">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" data-testid="analytics-title">
              Analytics
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Monitor traffic, engagement, and performance metrics at a glance.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Time range selector */}
            <div
              className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/60 p-1"
              role="group"
              aria-label="Time range selector"
              data-testid="analytics-range-selector"
            >
              {rangeOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setRange(opt.key)}
                  aria-pressed={range === opt.key}
                  data-testid={`analytics-range-${opt.key}`}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    range === opt.key
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              aria-label="Refresh analytics data"
              onClick={handleRefresh}
              data-testid="analytics-refresh-button"
              className="border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* ── KPI Cards ──────────────────────────────────────── */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            const isPositive = m.change >= 0;
            return (
              <Card
                key={m.key}
                className="border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40"
                data-testid={m.testId}
              >
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/15">
                      <Icon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`gap-1 border-0 text-xs ${
                        isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {isPositive ? (
                        <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3" aria-hidden="true" />
                      )}
                      {Math.abs(m.change)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400">{m.label}</p>
                  <p className="mt-1 text-2xl font-bold tracking-tight">{m.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ── Traffic Chart ──────────────────────────────────── */}
        <Card
          className="mb-8 border-slate-800 bg-slate-900/40"
          data-testid="analytics-traffic-chart"
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <BarChart3 className="h-5 w-5 text-blue-400" aria-hidden="true" />
                Weekly Traffic
              </CardTitle>
              <p className="mt-1 text-sm text-slate-400">
                {totalVisitors.toLocaleString()} visitors · {totalPageviews.toLocaleString()} pageviews
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                Visitors
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-400" />
                Pageviews
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div
              className="flex items-end justify-between gap-2 sm:gap-4"
              style={{ height: "220px" }}
              role="img"
              aria-label="Weekly traffic bar chart"
            >
              {weeklyData.map((d) => (
                <div
                  key={d.day}
                  className="flex flex-1 flex-col items-center gap-2"
                  data-testid={`analytics-bar-${d.day.toLowerCase()}`}
                >
                  {/* Bar group */}
                  <div className="relative flex w-full max-w-[48px] flex-1 items-end justify-center gap-1">
                    <div
                      className="w-1/2 rounded-t bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-500"
                      style={{ height: `${(d.visitors / maxVisitors) * 100}%` }}
                      title={`${d.visitors.toLocaleString()} visitors`}
                    />
                    <div
                      className="w-1/2 rounded-t bg-gradient-to-t from-indigo-600 to-indigo-300 transition-all duration-500"
                      style={{ height: `${(d.pageviews / (maxVisitors * 2.5)) * 100}%` }}
                      title={`${d.pageviews.toLocaleString()} pageviews`}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-500">{d.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ── Bottom grid: Sources + Pages ───────────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Traffic Sources */}
          <Card
            className="border-slate-800 bg-slate-900/40"
            data-testid="analytics-sources-section"
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Sparkles className="h-5 w-5 text-blue-400" aria-hidden="true" />
                Top Traffic Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                {sources.map((s) => (
                  <div key={s.source} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-200">{s.source}</span>
                        <span className="text-xs text-slate-400">{s.visitors.toLocaleString()}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500"
                          style={{ width: `${s.percentage}%` }}
                        />
                      </div>
                    </div>
                    <div className="w-8 text-right">
                      {s.trend === "up" ? (
                        <TrendingUp className="ml-auto h-4 w-4 text-emerald-400" aria-hidden="true" />
                      ) : (
                        <TrendingDown className="ml-auto h-4 w-4 text-red-400" aria-hidden="true" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Pages */}
          <Card
            className="border-slate-800 bg-slate-900/40"
            data-testid="analytics-pages-section"
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Activity className="h-5 w-5 text-blue-400" aria-hidden="true" />
                Top Pages
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400">Page</TableHead>
                    <TableHead className="text-right text-slate-400">Views</TableHead>
                    <TableHead className="hidden text-right text-slate-400 sm:table-cell">Avg. Time</TableHead>
                    <TableHead className="text-right text-slate-400">Bounce</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pages.map((p) => (
                    <TableRow
                      key={p.path}
                      className="border-slate-800/50"
                      data-testid={`analytics-page-row-${p.path.replace("/", "").replace("/", "") || "home"}`}
                    >
                      <TableCell className="font-mono text-sm text-blue-300">{p.path}</TableCell>
                      <TableCell className="text-right text-sm text-slate-200">
                        {p.views.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden text-right text-sm text-slate-400 sm:table-cell">
                        {p.avgTime}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={`border-0 text-xs ${
                            p.bounceRate < 40
                              ? "bg-emerald-500/10 text-emerald-400"
                              : p.bounceRate < 55
                                ? "bg-amber-500/10 text-amber-400"
                                : "bg-red-500/10 text-red-400"
                          }`}
                        >
                          {p.bounceRate}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
