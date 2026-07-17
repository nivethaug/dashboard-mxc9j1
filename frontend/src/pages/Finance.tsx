import { useState, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Receipt,
  PiggyBank,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type TxnType = "income" | "expense";
type Category = "salary" | "food" | "transport" | "housing" | "entertainment" | "shopping" | "utilities" | "investment" | "other";

interface Transaction {
  id: string;
  type: TxnType;
  amount: number;
  category: Category;
  description: string;
  date: string;
}

const categoryMeta: Record<Category, { label: string; color: string; bgColor: string }> = {
  salary: { label: "Salary", color: "text-emerald-400", bgColor: "bg-emerald-500" },
  food: { label: "Food & Dining", color: "text-orange-400", bgColor: "bg-orange-500" },
  transport: { label: "Transport", color: "text-blue-400", bgColor: "bg-blue-500" },
  housing: { label: "Housing", color: "text-purple-400", bgColor: "bg-purple-500" },
  entertainment: { label: "Entertainment", color: "text-pink-400", bgColor: "bg-pink-500" },
  shopping: { label: "Shopping", color: "text-yellow-400", bgColor: "bg-yellow-500" },
  utilities: { label: "Utilities", color: "text-cyan-400", bgColor: "bg-cyan-500" },
  investment: { label: "Investment", color: "text-indigo-400", bgColor: "bg-indigo-500" },
  other: { label: "Other", color: "text-slate-400", bgColor: "bg-slate-500" },
};

const initialTransactions: Transaction[] = [
  { id: "1", type: "income", amount: 5200, category: "salary", description: "Monthly Salary", date: "2025-01-15" },
  { id: "2", type: "expense", amount: 1450, category: "housing", description: "Rent Payment", date: "2025-01-01" },
  { id: "3", type: "expense", amount: 320, category: "food", description: "Grocery Shopping", date: "2025-01-08" },
  { id: "4", type: "expense", amount: 85, category: "transport", description: "Gas & Parking", date: "2025-01-10" },
  { id: "5", type: "income", amount: 850, category: "investment", description: "Dividend Income", date: "2025-01-12" },
  { id: "6", type: "expense", amount: 120, category: "entertainment", description: "Streaming Subscriptions", date: "2025-01-05" },
  { id: "7", type: "expense", amount: 240, category: "utilities", description: "Electric & Internet", date: "2025-01-07" },
  { id: "8", type: "expense", amount: 410, category: "shopping", description: "Winter Jacket", date: "2025-01-14" },
  { id: "9", type: "expense", amount: 65, category: "food", description: "Restaurant Dinner", date: "2025-01-16" },
  { id: "10", type: "expense", amount: 30, category: "transport", description: "Ride Share", date: "2025-01-18" },
];

const monthlyBudget = 4000;

export default function Finance() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filterType, setFilterType] = useState<"all" | TxnType>("all");

  const [formType, setFormType] = useState<TxnType>("expense");
  const [formAmount, setFormAmount] = useState("");
  const [formCategory, setFormCategory] = useState<Category>("food");
  const [formDesc, setFormDesc] = useState("");

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
    const net = income - expenses;
    const budgetUsed = monthlyBudget > 0 ? (expenses / monthlyBudget) * 100 : 0;
    return { income, expenses, net, budgetUsed };
  }, [transactions]);

  const categoryBreakdown = useMemo(() => {
    const expenseTxns = transactions.filter(t => t.type === "expense");
    const total = expenseTxns.reduce((s, t) => s + t.amount, 0);
    const map: Record<string, number> = {};
    expenseTxns.forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map)
      .map(([cat, amt]) => ({
        category: cat as Category,
        amount: amt,
        percent: total > 0 ? (amt / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  const weeklyData = useMemo(() => {
    const days = ["W1", "W2", "W3", "W4"];
    return days.map((label, i) => {
      const start = i * 7 + 1;
      const end = start + 6;
      const weekTxns = transactions.filter(t => {
        const day = parseInt(t.date.split("-")[2]);
        return day >= start && day <= end;
      });
      const income = weekTxns.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
      const expenses = weekTxns.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
      return { label, income, expenses };
    });
  }, [transactions]);

  const maxBar = Math.max(...weeklyData.flatMap(w => [w.income, w.expenses]), 1);

  const filteredTxns = useMemo(() => {
    const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date));
    if (filterType === "all") return sorted;
    return sorted.filter(t => t.type === filterType);
  }, [transactions, filterType]);

  const handleAdd = () => {
    const amount = parseFloat(formAmount);
    if (!amount || amount <= 0 || !formDesc.trim()) return;
    const newTxn: Transaction = {
      id: Date.now().toString(),
      type: formType,
      amount,
      category: formCategory,
      description: formDesc.trim(),
      date: new Date().toISOString().split("T")[0],
    };
    setTransactions([...transactions, newTxn]);
    setFormAmount("");
    setFormDesc("");
    setFormCategory("food");
    setFormType("expense");
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f]" data-testid="finance-page">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Finance Tracker</h1>
            <p className="mt-1 text-slate-400">Track income, expenses, and stay on budget</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="finance-add-button" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Plus className="mr-2 h-4 w-4" aria-hidden="true" /> Add Transaction
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Transaction</DialogTitle>
                <DialogDescription>Record a new income or expense entry</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={formType === "income" ? "default" : "outline"}
                    onClick={() => setFormType("income")}
                    data-testid="finance-type-income"
                    className={formType === "income" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                  >
                    <TrendingUp className="mr-2 h-4 w-4" aria-hidden="true" /> Income
                  </Button>
                  <Button
                    variant={formType === "expense" ? "default" : "outline"}
                    onClick={() => setFormType("expense")}
                    data-testid="finance-type-expense"
                    className={formType === "expense" ? "bg-rose-600 hover:bg-rose-700" : ""}
                  >
                    <TrendingDown className="mr-2 h-4 w-4" aria-hidden="true" /> Expense
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="finance-amount">Amount ($)</Label>
                  <Input
                    id="finance-amount"
                    type="number"
                    placeholder="0.00"
                    value={formAmount}
                    onChange={(e) => setFormAmount(e.target.value)}
                    data-testid="finance-amount-input"
                    aria-label="Transaction amount"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="finance-category">Category</Label>
                  <Select value={formCategory} onValueChange={(v) => setFormCategory(v as Category)}>
                    <SelectTrigger id="finance-category" data-testid="finance-category-select" aria-label="Transaction category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryMeta).map(([key, meta]) => (
                        <SelectItem key={key} value={key}>{meta.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="finance-desc">Description</Label>
                  <Input
                    id="finance-desc"
                    type="text"
                    placeholder="e.g., Grocery shopping"
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    data-testid="finance-desc-input"
                    aria-label="Transaction description"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)} data-testid="finance-cancel-button">Cancel</Button>
                <Button onClick={handleAdd} data-testid="finance-save-button" className="bg-blue-600 hover:bg-blue-700">
                  Save Transaction
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* KPI Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-800 bg-slate-900/50" data-testid="finance-kpi-income">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Income</CardTitle>
              <div className="rounded-lg bg-emerald-500/10 p-2"><TrendingUp className="h-4 w-4 text-emerald-400" aria-hidden="true" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-400">${stats.income.toLocaleString()}</div>
              <p className="mt-1 text-xs text-slate-500">{transactions.filter(t => t.type === "income").length} income entries</p>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900/50" data-testid="finance-kpi-expenses">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Expenses</CardTitle>
              <div className="rounded-lg bg-rose-500/10 p-2"><TrendingDown className="h-4 w-4 text-rose-400" aria-hidden="true" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-rose-400">${stats.expenses.toLocaleString()}</div>
              <p className="mt-1 text-xs text-slate-500">{transactions.filter(t => t.type === "expense").length} expense entries</p>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900/50" data-testid="finance-kpi-net">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Net Balance</CardTitle>
              <div className="rounded-lg bg-blue-500/10 p-2"><Wallet className="h-4 w-4 text-blue-400" aria-hidden="true" /></div>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stats.net >= 0 ? "text-blue-400" : "text-rose-400"}`}>
                ${stats.net.toLocaleString()}
              </div>
              <p className="mt-1 text-xs text-slate-500">{stats.net >= 0 ? "Surplus" : "Deficit"}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900/50" data-testid="finance-kpi-budget">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Budget Used</CardTitle>
              <div className="rounded-lg bg-indigo-500/10 p-2"><PiggyBank className="h-4 w-4 text-indigo-400" aria-hidden="true" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-400">{stats.budgetUsed.toFixed(0)}%</div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full transition-all ${stats.budgetUsed > 90 ? "bg-rose-500" : stats.budgetUsed > 75 ? "bg-orange-500" : "bg-indigo-500"}`}
                  style={{ width: `${Math.min(stats.budgetUsed, 100)}%` }}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">of ${monthlyBudget.toLocaleString()} budget</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts row */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Weekly bar chart */}
          <Card className="border-slate-800 bg-slate-900/50" data-testid="finance-chart-weekly">
            <CardHeader>
              <CardTitle className="text-lg text-white">Weekly Income vs Expenses</CardTitle>
              <CardDescription className="text-slate-500">Current month breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between gap-4 h-48 px-2">
                {weeklyData.map((week) => (
                  <div key={week.label} className="flex flex-1 flex-col items-center gap-2">
                    <div className="flex w-full items-end justify-center gap-1.5 h-36">
                      <div className="group relative flex w-1/2 items-end">
                        <div
                          className="w-full rounded-t bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all hover:from-emerald-500 hover:to-emerald-300"
                          style={{ height: `${(week.income / maxBar) * 100}%`, minHeight: week.income > 0 ? "4px" : "0" }}
                          aria-hidden="true"
                        />
                        <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-emerald-400 opacity-0 group-hover:opacity-100">
                          ${week.income}
                        </span>
                      </div>
                      <div className="group relative flex w-1/2 items-end">
                        <div
                          className="w-full rounded-t bg-gradient-to-t from-rose-600 to-rose-400 transition-all hover:from-rose-500 hover:to-rose-300"
                          style={{ height: `${(week.expenses / maxBar) * 100}%`, minHeight: week.expenses > 0 ? "4px" : "0" }}
                          aria-hidden="true"
                        />
                        <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-rose-400 opacity-0 group-hover:opacity-100">
                          ${week.expenses}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500">{week.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-emerald-500" aria-hidden="true" />
                  <span className="text-xs text-slate-400">Income</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm bg-rose-500" aria-hidden="true" />
                  <span className="text-xs text-slate-400">Expenses</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category breakdown */}
          <Card className="border-slate-800 bg-slate-900/50" data-testid="finance-chart-categories">
            <CardHeader>
              <CardTitle className="text-lg text-white">Expense Breakdown</CardTitle>
              <CardDescription className="text-slate-500">Spending by category</CardDescription>
            </CardHeader>
            <CardContent>
              {categoryBreakdown.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">No expenses recorded yet</p>
              ) : (
                <div className="space-y-3">
                  {categoryBreakdown.map((item) => {
                    const meta = categoryMeta[item.category];
                    return (
                      <div key={item.category} data-testid={`finance-category-${item.category}`}>
                        <div className="mb-1 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`h-2.5 w-2.5 rounded-full ${meta.bgColor}`} aria-hidden="true" />
                            <span className="text-sm text-slate-300">{meta.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-200">${item.amount.toLocaleString()}</span>
                            <span className="text-xs text-slate-500">{item.percent.toFixed(0)}%</span>
                          </div>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                          <div
                            className={`h-full rounded-full ${meta.bgColor} transition-all`}
                            style={{ width: `${item.percent}%` }}
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Transactions table */}
        <Card className="border-slate-800 bg-slate-900/50" data-testid="finance-transactions-section">
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle className="text-lg text-white">Recent Transactions</CardTitle>
                <CardDescription className="text-slate-500">{filteredTxns.length} transactions</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterType === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("all")}
                  data-testid="finance-filter-all"
                >
                  All
                </Button>
                <Button
                  variant={filterType === "income" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("income")}
                  data-testid="finance-filter-income"
                  className={filterType === "income" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
                >
                  Income
                </Button>
                <Button
                  variant={filterType === "expense" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterType("expense")}
                  data-testid="finance-filter-expense"
                  className={filterType === "expense" ? "bg-rose-600 hover:bg-rose-700" : ""}
                >
                  Expenses
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead className="text-slate-400">Description</TableHead>
                    <TableHead className="text-slate-400">Category</TableHead>
                    <TableHead className="text-slate-400">Date</TableHead>
                    <TableHead className="text-right text-slate-400">Amount</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTxns.map((txn) => {
                    const meta = categoryMeta[txn.category];
                    return (
                      <TableRow key={txn.id} className="border-slate-800/50 hover:bg-slate-800/30" data-testid={`finance-txn-${txn.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${txn.type === "income" ? "bg-emerald-500/10" : "bg-rose-500/10"}`}>
                              {txn.type === "income" ? (
                                <ArrowUpRight className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 text-rose-400" aria-hidden="true" />
                              )}
                            </div>
                            <span className="text-sm font-medium text-slate-200">{txn.description}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`${meta.color} border-current`}>{meta.label}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-400">{txn.date}</TableCell>
                        <TableCell className="text-right">
                          <span className={`text-sm font-semibold ${txn.type === "income" ? "text-emerald-400" : "text-rose-400"}`}>
                            {txn.type === "income" ? "+" : "-"}${txn.amount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 transition-opacity hover:bg-rose-500/10 group-hover:opacity-100"
                            onClick={() => handleDelete(txn.id)}
                            aria-label={`Delete ${txn.description}`}
                            data-testid={`finance-delete-${txn.id}`}
                          >
                            <Trash2 className="h-4 w-4 text-slate-500 hover:text-rose-400" aria-hidden="true" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredTxns.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-sm text-slate-500">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
