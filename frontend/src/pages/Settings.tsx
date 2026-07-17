import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  SlidersHorizontal,
  Bell,
  Globe,
  Moon,
  Sun,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

type ToastState = { visible: boolean; message: string; type: "success" | "error" };

type ProfileData = {
  name: string;
  email: string;
  company: string;
  role: string;
};

type PasswordData = {
  current: string;
  newPassword: string;
  confirm: string;
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<ToastState>({ visible: false, message: "", type: "success" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [profile, setProfile] = useState<ProfileData>({
    name: "Jordan Mitchell",
    email: "jordan@commandcenter.io",
    company: "Command Center Inc.",
    role: "Operations Lead",
  });

  const [passwords, setPasswords] = useState<PasswordData>({
    current: "",
    newPassword: "",
    confirm: "",
  });

  const [twoFactor, setTwoFactor] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("utc-5");

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast({ ...toast, visible: false }), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ visible: true, message, type });
  };

  const validateProfile = () => {
    const errs: Record<string, string> = {};
    if (!profile.name.trim()) errs.name = "Name is required";
    if (!profile.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) errs.email = "Invalid email format";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePassword = () => {
    const errs: Record<string, string> = {};
    if (!passwords.current) errs.current = "Current password is required";
    if (passwords.newPassword.length < 8) errs.newPassword = "Password must be at least 8 characters";
    if (passwords.newPassword !== passwords.confirm) errs.confirm = "Passwords do not match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveProfile = () => {
    if (validateProfile()) {
      setSaving(true);
      setTimeout(() => {
        setSaving(false);
        showToast("Profile updated successfully", "success");
      }, 800);
    }
  };

  const handleSavePassword = () => {
    if (validatePassword()) {
      setSaving(true);
      setTimeout(() => {
        setSaving(false);
        setPasswords({ current: "", newPassword: "", confirm: "" });
        showToast("Password changed successfully", "success");
      }, 800);
    }
  };

  const handleSavePreferences = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast("Preferences saved", "success");
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-slate-100" data-testid="settings-page">
      <div className="mx-auto max-w-4xl px-4 py-6 md:px-8 md:py-8">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-2.5 ring-1 ring-inset ring-white/10">
              <SettingsIcon className="h-6 w-6 text-blue-400" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Settings</h1>
              <p className="mt-0.5 text-sm text-slate-400">Manage your account and preferences</p>
            </div>
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList
            className="mb-6 grid w-full grid-cols-3 border border-slate-800 bg-slate-900/60 backdrop-blur-xl"
            data-testid="settings-tabs"
          >
            <TabsTrigger
              value="profile"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400"
              data-testid="settings-tab-profile"
            >
              <User className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400"
              data-testid="settings-tab-security"
            >
              <Shield className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Security
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="data-[state=active]:bg-slate-800 data-[state=active]:text-blue-400"
              data-testid="settings-tab-preferences"
            >
              <SlidersHorizontal className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Preferences
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card
              className="border-slate-800 bg-slate-900/60 backdrop-blur-xl"
              data-testid="settings-profile-section"
            >
              <CardHeader>
                <CardTitle className="text-lg text-white">Profile Information</CardTitle>
                <p className="text-sm text-slate-400">Update your personal and company details</p>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm text-slate-300">Full Name</Label>
                    <Input
                      id="name"
                      aria-label="Full name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className={`border-slate-700 bg-slate-900/50 ${errors.name ? "border-rose-500" : ""}`}
                      data-testid="settings-name-input"
                    />
                    {errors.name && (
                      <p className="flex items-center gap-1 text-xs text-rose-400">
                        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-slate-300">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      aria-label="Email address"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className={`border-slate-700 bg-slate-900/50 ${errors.email ? "border-rose-500" : ""}`}
                      data-testid="settings-email-input"
                    />
                    {errors.email && (
                      <p className="flex items-center gap-1 text-xs text-rose-400">
                        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm text-slate-300">Company</Label>
                    <Input
                      id="company"
                      aria-label="Company name"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      className="border-slate-700 bg-slate-900/50"
                      data-testid="settings-company-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm text-slate-300">Role</Label>
                    <Input
                      id="role"
                      aria-label="Role"
                      value={profile.role}
                      onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                      className="border-slate-700 bg-slate-900/50"
                      data-testid="settings-role-input"
                    />
                  </div>
                </div>
                <Separator className="bg-slate-800" />
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800"
                    data-testid="settings-cancel-button"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                    data-testid="settings-save-button"
                  >
                    {saving ? (
                      "Saving..."
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <div className="space-y-4">
              <Card
                className="border-slate-800 bg-slate-900/60 backdrop-blur-xl"
                data-testid="settings-password-section"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-white">Change Password</CardTitle>
                  <p className="text-sm text-slate-400">Ensure your account stays secure</p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="current-pw" className="text-sm text-slate-300">Current Password</Label>
                    <Input
                      id="current-pw"
                      type="password"
                      aria-label="Current password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      className={`border-slate-700 bg-slate-900/50 ${errors.current ? "border-rose-500" : ""}`}
                      data-testid="settings-current-password-input"
                    />
                    {errors.current && (
                      <p className="flex items-center gap-1 text-xs text-rose-400">
                        <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                        {errors.current}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="new-pw" className="text-sm text-slate-300">New Password</Label>
                      <Input
                        id="new-pw"
                        type="password"
                        aria-label="New password"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                        className={`border-slate-700 bg-slate-900/50 ${errors.newPassword ? "border-rose-500" : ""}`}
                        data-testid="settings-new-password-input"
                      />
                      {errors.newPassword && (
                        <p className="flex items-center gap-1 text-xs text-rose-400">
                          <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                          {errors.newPassword}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-pw" className="text-sm text-slate-300">Confirm Password</Label>
                      <Input
                        id="confirm-pw"
                        type="password"
                        aria-label="Confirm new password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        className={`border-slate-700 bg-slate-900/50 ${errors.confirm ? "border-rose-500" : ""}`}
                        data-testid="settings-confirm-password-input"
                      />
                      {errors.confirm && (
                        <p className="flex items-center gap-1 text-xs text-rose-400">
                          <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                          {errors.confirm}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSavePassword}
                      disabled={saving}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                      data-testid="settings-update-password-button"
                    >
                      {saving ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="border-slate-800 bg-slate-900/60 backdrop-blur-xl"
                data-testid="settings-2fa-section"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-white">Two-Factor Authentication</CardTitle>
                  <p className="text-sm text-slate-400">Add an extra layer of security</p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-medium text-slate-200">Authenticator App</p>
                        <p className="text-xs text-slate-500">Use an authenticator app for verification codes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={twoFactor ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" : "border-slate-600 bg-slate-800 text-slate-400"}>
                        {twoFactor ? "Enabled" : "Disabled"}
                      </Badge>
                      <Switch
                        checked={twoFactor}
                        onCheckedChange={setTwoFactor}
                        aria-label="Toggle two-factor authentication"
                        data-testid="settings-2fa-switch"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="space-y-4">
              <Card
                className="border-slate-800 bg-slate-900/60 backdrop-blur-xl"
                data-testid="settings-notifications-section"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-white">Notifications</CardTitle>
                  <p className="text-sm text-slate-400">Choose what you want to be notified about</p>
                </CardHeader>
                <CardContent className="space-y-1">
                  {[
                    { label: "Email Alerts", desc: "Receive email notifications for important events", value: emailAlerts, setter: setEmailAlerts, icon: Bell, testId: "settings-email-alerts-switch" },
                    { label: "Push Notifications", desc: "Get real-time push notifications in your browser", value: pushNotifications, setter: setPushNotifications, icon: Bell, testId: "settings-push-notifications-switch" },
                    { label: "Weekly Digest", desc: "A summary of your account activity every Monday", value: weeklyDigest, setter: setWeeklyDigest, icon: Bell, testId: "settings-weekly-digest-switch" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-3">
                          <item.icon className="h-4 w-4 text-slate-400" aria-hidden="true" />
                          <div>
                            <p className="text-sm font-medium text-slate-200">{item.label}</p>
                            <p className="text-xs text-slate-500">{item.desc}</p>
                          </div>
                        </div>
                        <Switch
                          checked={item.value}
                          onCheckedChange={item.setter}
                          aria-label={item.label}
                          data-testid={item.testId}
                        />
                      </div>
                      <Separator className="bg-slate-800/50" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card
                className="border-slate-800 bg-slate-900/60 backdrop-blur-xl"
                data-testid="settings-appearance-section"
              >
                <CardHeader>
                  <CardTitle className="text-lg text-white">Appearance & Localization</CardTitle>
                  <p className="text-sm text-slate-400">Customize your interface</p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm text-slate-300">Theme</Label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setTheme("dark")}
                        aria-label="Select dark theme"
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg border p-3 text-sm transition-all ${
                          theme === "dark"
                            ? "border-blue-500 bg-blue-500/10 text-blue-400"
                            : "border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600"
                        }`}
                        data-testid="settings-theme-dark"
                      >
                        <Moon className="h-4 w-4" aria-hidden="true" />
                        Dark
                      </button>
                      <button
                        onClick={() => setTheme("light")}
                        aria-label="Select light theme"
                        className={`flex flex-1 items-center justify-center gap-2 rounded-lg border p-3 text-sm transition-all ${
                          theme === "light"
                            ? "border-blue-500 bg-blue-500/10 text-blue-400"
                            : "border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600"
                        }`}
                        data-testid="settings-theme-light"
                      >
                        <Sun className="h-4 w-4" aria-hidden="true" />
                        Light
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-sm text-slate-300">Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger
                          id="language"
                          className="border-slate-700 bg-slate-900/50"
                          data-testid="settings-language-select"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                          <SelectItem value="ja">日本語</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone" className="text-sm text-slate-300">Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger
                          id="timezone"
                          className="border-slate-700 bg-slate-900/50"
                          data-testid="settings-timezone-select"
                        >
                          <Globe className="mr-2 h-4 w-4" aria-hidden="true" />
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc-8">UTC-8 (Pacific)</SelectItem>
                          <SelectItem value="utc-5">UTC-5 (Eastern)</SelectItem>
                          <SelectItem value="utc+0">UTC+0 (London)</SelectItem>
                          <SelectItem value="utc+1">UTC+1 (Central European)</SelectItem>
                          <SelectItem value="utc+9">UTC+9 (Tokyo)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={handleSavePreferences}
                      disabled={saving}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                      data-testid="settings-save-preferences-button"
                    >
                      {saving ? "Saving..." : "Save Preferences"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Toast */}
      {toast.visible && (
        <div
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 animate-[fadeIn_0.3s_ease-out]"
        >
          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${
              toast.type === "success"
                ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                : "border-rose-500/30 bg-rose-500/15 text-rose-300"
            }`}
          >
            {toast.type === "success" ? (
              <Check className="h-5 w-5" aria-hidden="true" />
            ) : (
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </main>
  );
}
