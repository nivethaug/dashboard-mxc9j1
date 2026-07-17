import { useState, useMemo } from "react";
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Plus,
  PieChart,
  DollarSign,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Holding {
  id: string;
  name: string;
  symbol: string;
  category: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
  color: string;
}

const COLORS = [
  "#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444",
  "#06b6d4", "#ec4899", "#84cc16", "#f97316", "#6366f1",
];

const initialHoldings: Holding[] = [
  { id: "h1", name: "Bitcoin", symbol: "BTC", category: "Crypto", quantity: 0.85, avgPrice: 42000, currentPrice: 63500, color: COLORS[0] },
  { id: "h2", name: "Ethereum", symbol: "ETH", category: "Crypto", quantity: 12.5, avgPrice: 2200, currentPrice: 3450, color: COLORS[1] },
  { id: "h3", name: "Apple Inc.", symbol: "AAPL", category: "Stock", quantity: 50, avgPrice: 175, currentPrice: 212, color: COLORS[2] },
  { id: "h4", name: "NVIDIA Corp.", symbol: "NVDA", category: "Stock", quantity: 30, avgPrice: 450, currentPrice: 880, color: COLORS[3] },
  { id: "h5", name: "S&P 500 ETF", symbol: "SPY", category: "ETF", quantity: 25, avgPrice: 430, currentPrice: 518, color: COLORS[4] },
  { id: "h6", name: "Gold ETF", symbol: "GLD", category: "Commodity", quantity: 40, avgPrice: 180, currentPrice: 215, color: COLORS[5] },
];

export default function Portfolio() {
  const [holdings, setHoldings] = useState<Holding[]>(initialHoldings);
  const [refreshing, setRefreshing] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newHolding, setNewHolding] = useState({ name: "", symbol: "", category: "Stock", quantity: "", avgPrice: "", currentPrice: "" });

  const stats = useMemo(() => {
    let totalValue = 0;
    let totalCost = 0;
    for (const h of holdings) {
      totalValue += h.quantity * h.currentPrice;
      totalCost += h.quantity * h.avgPrice;
    }
    const totalPL = totalValue - totalCost;
    const totalPLPct = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;
    const todayChange = totalValue * 0.0234;
    const todayChangePct = 2.34;
    const categories = new Set(holdings.map((h) => h.category)).size;
    const diversityScore = Math.min(100, categories * 20 + holdings.length * 5);
    return { totalValue, totalCost, totalPL, totalPLPct, todayChange, todayChangePct, categories, diversityScore };
  }, [holdings]);

  const allocation = useMemo(() => {
    return holdings
      .map((h) => ({
        ...h,
        value: h.quantity * h.currentPrice,
        pct: stats.totalValue > 0 ? (h.quantity * h.currentPrice) / stats.totalValue * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [holdings, stats.totalValue]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  };

  const handleAddHolding = () => {
    if (!newHolding.name || !newHolding.symbol || !newHolding.quantity || !newHolding.currentPrice) return;
    const holding: Holding = {
      id: `h${Date.now()}`,
      name: newHolding.name,
      symbol: newHolding.symbol.toUpperCase(),
      category: newHolding.category,
      quantity: parseFloat(newHolding.quantity),
      avgPrice: parseFloat(newHolding.avgPrice || newHolding.currentPrice),
      currentPrice: parseFloat(newHolding.currentPrice),
      color: COLORS[holdings.length % COLORS.length],
    };
    setHoldings([...holdings, holding]);
    setNewHolding({ name: "", symbol: "", category: "Stock", quantity: "", avgPrice: "", currentPrice: "" });
    setDialogOpen(false);
  };

  const handleDeleteHolding = (id: string) => {
    setHoldings(holdings.filter((h) => h.id !== id));
  };

  const fmtCurrency = (val: number) =>
    `$${val.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const fmtPct = (val: number) =>
    `${val >= 0 ? "+" : ""}${val.toFixed(2)}%`;

  // Donut chart segments
  let cumulativePct = 0;
  const donutSegments = allocation.map((h) => {
    const startAngle = cumulativePct * 3.6;
    const angle = h.pct * 3.6;
    cumulativePct += h.pct;
    return { ...h, startAngle, angle };
  });

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white" data-testid="portfolio-page">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" data-testid="portfolio-title">
              Portfolio
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Track your investments, allocations, and performance in one place.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              aria-label="Refresh portfolio data"
              data-testid="portfolio-refresh-button"
              className="border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white"
            >
              <RefreshCw className={`mr-1.5 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
              Refresh
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  data-testid="portfolio-add-button"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="mr-1.5 h-4 w-4" aria-hidden="true" />
                  Add Position
                </Button>
              </DialogTrigger>
              <DialogContent className="border-slate-800 bg-slate-900">
                <DialogHeader>
                  <DialogTitle>Add New Position</DialogTitle>
                  <DialogDescription>Enter the details for your new investment holding.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="add-name">Asset Name</Label>
                      <Input
                        id="add-name"
                        value={newHolding.name}
                        onChange={(e) => setNewHolding({ ...newHolding, name: e.target.value })}
                        placeholder="e.g. Tesla Inc."
                        aria-label="Asset name"
                        data-testid="portfolio-add-name"
                        className="border-slate-700 bg-slate-800"
                      />
                    </div>
                    <div>
                      <Label htmlFor="add-symbol">Symbol</Label>
                      <Input
                        id="add-symbol"
                        value={newHolding.symbol}
                        onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value })}
                        placeholder="e.g. TSLA"
                        aria-label="Asset symbol"
                        data-testid="portfolio-add-symbol"
                        className="border-slate-700 bg-slate-800"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <Label htmlFor="add-qty">Quantity</Label>
                      <Input
                        id="add-qty"
                        type="number"
                        value={newHolding.quantity}
                        onChange={(e) => setNewHolding({ ...newHolding, quantity: e.target.value })}
                        placeholder="0"
                        aria-label="Quantity"
                        data-testid="portfolio-add-quantity"
                        className="border-slate-700 bg-slate-800"
                      />
                    </div>
                    <div>
                      <Label htmlFor="add-avg">Avg Price</Label>
                      <Input
                        id="add-avg"
                        type="number"
                        value={newHolding.avgPrice}
                        onChange={(e) => setNewHolding({ ...newHolding, avgPrice: e.target.value })}
                        placeholder="0.00"
                        aria-label="Average price"
                        data-testid="portfolio-add-avgprice"
                        className="border-slate-700 bg-slate-800"
                      />
                    </div>
                    <div>
                      <Label htmlFor="add-cur">Current Price</Label>
                      <Input
                        id="add-cur"
                        type="number"
                        value={newHolding.currentPrice}
                        onChange={(e) => setNewHolding({ ...newHolding, currentPrice: e.target.value })}
                        placeholder="0.00"
                        aria-label="Current price"
                        data-testid="portfolio-add-currentprice"
                        className="border-slate-700 bg-slate-800"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleAddHolding}
                    data-testid="portfolio-add-submit"
                    className="mt-2 bg-blue-600 hover:bg-blue-700"
                  >
                    Add to Portfolio
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* ── KPI Cards ──────────────────────────────────────── */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Value */}
          <Card className="border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40" data-testid="portfolio-kpi-total-value">
            <CardContent className="p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/15">
                <Wallet className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-400">Total Value</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">{fmtCurrency(stats.totalValue)}</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-emerald-400">
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                {fmtCurrency(stats.todayChange)} today ({fmtPct(stats.todayChangePct)})
              </div>
            </CardContent>
          </Card>

          {/* Total P&L */}
          <Card className="border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40" data-testid="portfolio-kpi-total-pl">
            <CardContent className="p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600/15">
                <DollarSign className="h-5 w-5 text-emerald-400" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-400">Total P&L</p>
              <p className={`mt-1 text-2xl font-bold tracking-tight ${stats.totalPL >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                {stats.totalPL >= 0 ? "+" : ""}{fmtCurrency(stats.totalPL)}
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                <TrendingUp className="h-3 w-3" aria-hidden="true" />
                {fmtPct(stats.totalPLPct)} all-time
              </div>
            </CardContent>
          </Card>

          {/* Today's Change */}
          <Card className="border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40" data-testid="portfolio-kpi-today-change">
            <CardContent className="p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-600/15">
                <TrendingUp className="h-5 w-5 text-amber-400" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-400">Today's Change</p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-400">
                +{fmtCurrency(stats.todayChange)}
              </p>
              <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                {fmtPct(stats.todayChangePct)} vs. yesterday
              </div>
            </CardContent>
          </Card>

          {/* Diversity Score */}
          <Card className="border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40" data-testid="portfolio-kpi-diversity">
            <CardContent className="p-5">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/15">
                <PieChart className="h-5 w-5 text-indigo-400" aria-hidden="true" />
              </div>
              <p className="text-sm text-slate-400">Diversity Score</p>
              <p className="mt-1 text-2xl font-bold tracking-tight">{stats.diversityScore}<span className="text-base text-slate-500">/100</span></p>
              <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                {stats.categories} asset classes
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ── Main Grid: Allocation + Holdings ───────────────── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Allocation Donut */}
          <Card className="border-slate-800 bg-slate-900/40 lg:col-span-1" data-testid="portfolio-allocation-section">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <PieChart className="h-5 w-5 text-blue-400" aria-hidden="true" />
                Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {/* CSS Donut Chart */}
              <div className="mb-4 flex justify-center" data-testid="portfolio-donut-chart">
                <div className="relative h-48 w-48">
                  <div
                    className="h-full w-full rounded-full"
                    style={{
                      background: `conic-gradient(${donutSegments
                        .map((s) => `${s.color} ${s.startAngle}deg ${s.startAngle + s.angle}deg`)
                        .join(", ")})`,
                    }}
                    role="img"
                    aria-label="Portfolio allocation donut chart"
                  />
                  <div className="absolute inset-6 flex flex-col items-center justify-center rounded-full bg-[#0a0a0f]">
                    <span className="text-xs text-slate-400">Total</span>
                    <span className="text-lg font-bold">{fmtCurrency(stats.totalValue)}</span>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2" data-testid="portfolio-allocation-legend">
                {allocation.map((h) => (
                  <div key={h.id} className="flex items-center gap-2 text-sm">
                    <span className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: h.color }} />
                    <span className="flex-1 truncate text-slate-300">{h.symbol}</span>
                    <span className="text-slate-400">{h.pct.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Holdings Table */}
          <Card className="border-slate-800 bg-slate-900/40 lg:col-span-2" data-testid="portfolio-holdings-section">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg text-white">
                <Wallet className="h-5 w-5 text-blue-400" aria-hidden="true" />
                Holdings ({holdings.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="text-slate-400">Asset</TableHead>
                      <TableHead className="text-right text-slate-400">Qty</TableHead>
                      <TableHead className="hidden text-right text-slate-400 sm:table-cell">Avg Cost</TableHead>
                      <TableHead className="text-right text-slate-400">Price</TableHead>
                      <TableHead className="text-right text-slate-400">Value</TableHead>
                      <TableHead className="hidden text-right text-slate-400 md:table-cell">P&L</TableHead>
                      <TableHead className="text-slate-400"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allocation.map((h) => {
                      const pl = (h.currentPrice - h.avgPrice) * h.quantity;
                      const plPct = ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100;
                      const isPositive = pl >= 0;
                      return (
                        <TableRow key={h.id} className="border-slate-800/50" data-testid={`portfolio-row-${h.symbol.toLowerCase()}`}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="h-8 w-8 flex-shrink-0 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${h.color}25`, color: h.color }}>
                                {h.symbol.slice(0, 2)}
                              </span>
                              <div>
                                <p className="font-medium text-slate-200">{h.symbol}</p>
                                <p className="text-xs text-slate-500">{h.name}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-sm text-slate-300">{h.quantity}</TableCell>
                          <TableCell className="hidden text-right text-sm text-slate-400 sm:table-cell">{fmtCurrency(h.avgPrice)}</TableCell>
                          <TableCell className="text-right text-sm text-slate-200">{fmtCurrency(h.currentPrice)}</TableCell>
                          <TableCell className="text-right text-sm font-medium text-slate-200">{fmtCurrency(h.value)}</TableCell>
                          <TableCell className="hidden text-right md:table-cell">
                            <div className={`flex items-center justify-end gap-1 text-sm ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                              {isPositive ? <ArrowUpRight className="h-3 w-3" aria-hidden="true" /> : <ArrowDownRight className="h-3 w-3" aria-hidden="true" />}
                              <span>{fmtPct(plPct)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-500 hover:text-red-400"
                              aria-label={`Remove ${h.symbol} from portfolio`}
                              onClick={() => handleDeleteHolding(h.id)}
                              data-testid={`portfolio-delete-${h.symbol.toLowerCase()}`}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
