import { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Clock,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

/* ── Types ─────────────────────────────────────────────────────────── */
interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  category: CategoryKey;
}

type CategoryKey = "work" | "personal" | "important" | "social";

const CATEGORIES: Record<CategoryKey, { label: string; dot: string; badge: string }> = {
  work: { label: "Work", dot: "bg-blue-500", badge: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  personal: { label: "Personal", dot: "bg-emerald-500", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  important: { label: "Important", dot: "bg-rose-500", badge: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
  social: { label: "Social", dot: "bg-amber-500", badge: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
};

/* ── Helpers ───────────────────────────────────────────────────────── */
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function fmtDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function todayString(): string {
  const d = new Date();
  return fmtDate(d.getFullYear(), d.getMonth(), d.getDate());
}

/* ── Seed events (this month) ──────────────────────────────────────── */
function seedEvents(): CalendarEvent[] {
  const t = new Date();
  const y = t.getFullYear();
  const m = t.getMonth();
  return [
    { id: "e1", title: "Team Standup", date: fmtDate(y, m, t.getDate()), time: "09:00", category: "work" },
    { id: "e2", title: "Product Review", date: fmtDate(y, m, Math.min(t.getDate() + 2, 28)), time: "14:00", category: "important" },
    { id: "e3", title: "Lunch with Alex", date: fmtDate(y, m, Math.min(t.getDate() + 1, 28)), time: "12:30", category: "social" },
    { id: "e4", title: "Gym Session", date: fmtDate(y, m, Math.min(t.getDate() + 3, 28)), time: "18:00", category: "personal" },
  ];
}

/* ── Page ──────────────────────────────────────────────────────────── */
export default function Calendar() {
  const today = new Date();
  const todayStr = todayString();

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [events, setEvents] = useState<CalendarEvent[]>(seedEvents);

  // Add-event dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogDate, setDialogDate] = useState<string>(todayStr);
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("09:00");
  const [newCategory, setNewCategory] = useState<CategoryKey>("work");

  /* ── Derived calendar grid ────────────────────────────────────────── */
  const grid = useMemo(() => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [viewYear, viewMonth]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const e of events) {
      (map[e.date] ||= []).push(e);
    }
    // Sort each day's events by time
    for (const k of Object.keys(map)) {
      map[k].sort((a, b) => a.time.localeCompare(b.time));
    }
    return map;
  }, [events]);

  const selectedDayEvents = eventsByDate[selectedDate] || [];

  /* ── Stats ────────────────────────────────────────────────────────── */
  const monthEventCount = events.filter((e) => e.date.startsWith(`${viewYear}-${String(viewMonth + 1).padStart(2, "0")}`)).length;

  /* ── Handlers ─────────────────────────────────────────────────────── */
  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };
  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDate(todayStr);
  };

  const openAddDialog = (date: string) => {
    setDialogDate(date);
    setNewTitle("");
    setNewTime("09:00");
    setNewCategory("work");
    setDialogOpen(true);
  };

  const saveEvent = () => {
    if (!newTitle.trim()) return;
    const e: CalendarEvent = {
      id: `e${Date.now()}`,
      title: newTitle.trim(),
      date: dialogDate,
      time: newTime,
      category: newCategory,
    };
    setEvents((prev) => [...prev, e]);
    setDialogOpen(false);
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  /* ── Render ───────────────────────────────────────────────────────── */
  return (
    <main className="min-h-screen bg-[#0a0a0f] p-4 md:p-8" data-testid="calendar-page">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Calendar</h1>
            <p className="mt-1 text-sm text-slate-400">Schedule and track your events and appointments</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToday} data-testid="calendar-today-button" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              Today
            </Button>
            <Button size="sm" onClick={() => openAddDialog(selectedDate)} data-testid="calendar-add-button" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-1 h-4 w-4" aria-hidden="true" /> Add Event
            </Button>
          </div>
        </div>

        {/* KPI strip */}
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Card className="border-slate-800 bg-slate-900/50" data-testid="calendar-kpi-month">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/15">
                <CalendarIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{monthEventCount}</p>
                <p className="text-xs text-slate-400">Events this month</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900/50" data-testid="calendar-kpi-today">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15">
                <Clock className="h-5 w-5 text-emerald-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{(eventsByDate[todayStr] || []).length}</p>
                <p className="text-xs text-slate-400">Today's events</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900/50" data-testid="calendar-kpi-selected">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15">
                <CalendarIcon className="h-5 w-5 text-amber-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{selectedDayEvents.length}</p>
                <p className="text-xs text-slate-400">Selected day</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-800 bg-slate-900/50" data-testid="calendar-kpi-total">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15">
                <Plus className="h-5 w-5 text-indigo-400" aria-hidden="true" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{events.length}</p>
                <p className="text-xs text-slate-400">Total events</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Layout: calendar grid + selected day panel */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Calendar grid */}
          <Card className="border-slate-800 bg-slate-900/50 lg:col-span-2" data-testid="calendar-grid-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-xl font-semibold text-white">
                {MONTHS[viewMonth]} {viewYear}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" aria-label="Previous month" onClick={prevMonth} data-testid="calendar-prev-month" className="h-8 w-8 text-slate-400 hover:bg-slate-800">
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Next month" onClick={nextMonth} data-testid="calendar-next-month" className="h-8 w-8 text-slate-400 hover:bg-slate-800">
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Weekday header */}
              <div className="mb-2 grid grid-cols-7 gap-1">
                {DAYS.map((d) => (
                  <div key={d} className="pb-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {d}
                  </div>
                ))}
              </div>
              {/* Day cells */}
              <div className="grid grid-cols-7 gap-1" role="grid">
                {grid.map((day, idx) => {
                  if (day === null) {
                    return <div key={idx} className="min-h-[72px] rounded-lg bg-slate-900/20 md:min-h-[88px]" />;
                  }
                  const dateStr = fmtDate(viewYear, viewMonth, day);
                  const dayEvents = eventsByDate[dateStr] || [];
                  const isToday = dateStr === todayStr;
                  const isSelected = dateStr === selectedDate;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedDate(dateStr)}
                      aria-label={`${MONTHS[viewMonth]} ${day}, ${viewYear}${dayEvents.length ? `, ${dayEvents.length} events` : ""}`}
                      data-testid={`calendar-day-${dateStr}`}
                      className={`min-h-[72px] rounded-lg border p-1.5 text-left transition-all duration-150 md:min-h-[88px] ${
                        isSelected
                          ? "border-blue-500 bg-blue-500/10"
                          : isToday
                          ? "border-emerald-600/40 bg-emerald-500/5"
                          : "border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-800/40"
                      }`}
                    >
                      <span className={`text-xs font-medium ${isToday ? "text-emerald-400" : "text-slate-400"}`}>
                        {day}
                      </span>
                      {/* Event dots */}
                      <div className="mt-1 flex flex-col gap-0.5">
                        {dayEvents.slice(0, 3).map((e) => (
                          <div key={e.id} className="flex items-center gap-1 truncate">
                            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${CATEGORIES[e.category].dot}`} aria-hidden="true" />
                            <span className="truncate text-[10px] text-slate-400">{e.title}</span>
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <span className="text-[10px] text-slate-500">+{dayEvents.length - 3} more</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Selected day panel */}
          <Card className="border-slate-800 bg-slate-900/50" data-testid="calendar-day-panel">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-white">
                {selectedDate === todayStr
                  ? "Today"
                  : new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </CardTitle>
              <Button size="sm" variant="outline" onClick={() => openAddDialog(selectedDate)} data-testid="calendar-add-to-day-button" className="mt-2 w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                <Plus className="mr-1 h-4 w-4" aria-hidden="true" /> Add to this day
              </Button>
            </CardHeader>
            <CardContent>
              {selectedDayEvents.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-12 text-center">
                  <CalendarIcon className="h-8 w-8 text-slate-600" aria-hidden="true" />
                  <p className="text-sm text-slate-500">No events scheduled</p>
                  <p className="text-xs text-slate-600">Click "Add to this day" to create one</p>
                </div>
              ) : (
                <div className="space-y-3" aria-live="polite">
                  {selectedDayEvents.map((e) => (
                    <div
                      key={e.id}
                      data-testid={`calendar-event-${e.id}`}
                      className="group flex items-start gap-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3"
                    >
                      <div className={`mt-1 h-3 w-3 shrink-0 rounded-full ${CATEGORIES[e.category].dot}`} aria-hidden="true" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-200">{e.title}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Clock className="h-3 w-3 text-slate-500" aria-hidden="true" />
                          <span className="text-xs text-slate-500">{e.time}</span>
                          <Badge variant="outline" className={`ml-1 border ${CATEGORIES[e.category].badge}`}>
                            {CATEGORIES[e.category].label}
                          </Badge>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteEvent(e.id)}
                        aria-label={`Delete event ${e.title}`}
                        data-testid={`calendar-delete-${e.id}`}
                        className="opacity-0 transition-opacity group-hover:opacity-100 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4" data-testid="calendar-legend">
          {(Object.keys(CATEGORIES) as CategoryKey[]).map((k) => (
            <div key={k} className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${CATEGORIES[k].dot}`} aria-hidden="true" />
              <span className="text-xs text-slate-400">{CATEGORIES[k].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-slate-800 bg-slate-900" data-testid="calendar-add-dialog">
          <DialogHeader>
            <DialogTitle className="text-white">Add Event</DialogTitle>
            <DialogDescription className="text-slate-400">
              {dialogDate === todayStr
                ? "Today"
                : new Date(dialogDate + "T00:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="event-title" className="text-slate-300">Event title</Label>
              <Input
                id="event-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Doctor appointment"
                aria-label="Event title"
                data-testid="calendar-event-title-input"
                className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                onKeyDown={(e) => { if (e.key === "Enter") saveEvent(); }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-time" className="text-slate-300">Time</Label>
              <Input
                id="event-time"
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                aria-label="Event time"
                data-testid="calendar-event-time-input"
                className="border-slate-700 bg-slate-800 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-slate-300">Category</Label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(CATEGORIES) as CategoryKey[]).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setNewCategory(k)}
                    aria-label={`Select ${CATEGORIES[k].label} category`}
                    aria-pressed={newCategory === k}
                    data-testid={`calendar-category-${k}`}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                      newCategory === k
                        ? "border-blue-500 bg-blue-500/10 text-white"
                        : "border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-800"
                    }`}
                  >
                    <span className={`h-2.5 w-2.5 rounded-full ${CATEGORIES[k].dot}`} aria-hidden="true" />
                    {CATEGORIES[k].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} data-testid="calendar-cancel-button" className="border-slate-700 text-slate-300 hover:bg-slate-800">
              <X className="mr-1 h-4 w-4" aria-hidden="true" /> Cancel
            </Button>
            <Button onClick={saveEvent} disabled={!newTitle.trim()} data-testid="calendar-save-button" className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-1 h-4 w-4" aria-hidden="true" /> Save Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
