"use client";

import { useState, useEffect } from "react";
import { User, Moon, Sun, Monitor, Bell, Shield, Info } from "lucide-react";

export default function SettingsPage() {
  const [userName, setUserName] = useState("User");
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    const savedName = localStorage.getItem("userName");
    if (savedName) setUserName(savedName);
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setUserName(newName);
    localStorage.setItem("userName", newName);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Settings</h2>
        <p className="text-zinc-500">Personalize your app experience.</p>
      </header>

      <div className="space-y-6">
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
            <User className="text-blue-600" size={20} />
            <h3 className="font-bold">Profile</h3>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium mb-1.5 text-zinc-500">Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={handleNameChange}
              className="w-full max-w-md px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 transition-all"
            />
          </div>
        </section>

        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
            <Sun className="text-orange-600" size={20} />
            <h3 className="font-bold">Appearance</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4 max-w-md">
              {[
                { id: "light", icon: <Sun size={18} />, label: "Light" },
                { id: "dark", icon: <Moon size={18} />, label: "Dark" },
                { id: "system", icon: <Monitor size={18} />, label: "System" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    theme === t.id
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                      : "border-zinc-100 dark:border-zinc-800 text-zinc-500 hover:border-zinc-200"
                  }`}
                >
                  {t.icon}
                  <span className="text-xs font-medium">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
           <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                  <Bell size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">Notifications</p>
                  <p className="text-xs text-zinc-500">Manage alerts</p>
                </div>
              </div>
              <div className="w-10 h-6 bg-zinc-200 dark:bg-zinc-700 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
           </section>

           <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm">Privacy</p>
                  <p className="text-xs text-zinc-500">Data & Security</p>
                </div>
              </div>
              <div className="text-zinc-400">
                <Info size={20} />
              </div>
           </section>
        </div>

        <div className="text-center pt-8">
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-widest">Pro Todo v1.0.0</p>
        </div>
      </div>
    </div>
  );
}
