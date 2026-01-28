"use client";

import { useTodo } from "@/context/TodoContext";
import { CheckCircle2, Circle, Trophy, BarChart3, PieChart } from "lucide-react";

export default function Dashboard() {
  const { todos, categories, isInitialized } = useTodo();

  if (!isInitialized) return null;

  const total = todos.length;
  const completed = todos.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  const categoryStats = categories.map((cat) => {
    const catTodos = todos.filter((t) => t.categoryId === cat.id);
    const catTotal = catTodos.length;
    const catCompleted = catTodos.filter((t) => t.completed).length;
    return {
      ...cat,
      total: catTotal,
      completed: catCompleted,
      rate: catTotal === 0 ? 0 : Math.round((catCompleted / catTotal) * 100),
    };
  });

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
        <p className="text-zinc-500">Overview of your productivity.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4 text-blue-600">
            <BarChart3 size={24} />
            <span className="font-bold uppercase tracking-wider text-xs">Total Tasks</span>
          </div>
          <div className="text-4xl font-black">{total}</div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4 text-green-600">
            <CheckCircle2 size={24} />
            <span className="font-bold uppercase tracking-wider text-xs">Completed</span>
          </div>
          <div className="text-4xl font-black">{completed}</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center gap-4 mb-4 text-orange-600">
            <Circle size={24} />
            <span className="font-bold uppercase tracking-wider text-xs">Pending</span>
          </div>
          <div className="text-4xl font-black">{pending}</div>
        </div>
      </div>

      <section className="bg-white dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold mb-1">Overall Progress</h3>
            <p className="text-sm text-zinc-500">You have completed {completionRate}% of your tasks.</p>
          </div>
          <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-2xl">
            <Trophy size={32} />
          </div>
        </div>
        
        <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-4 mb-2 overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-1000 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </section>

      <section>
        <h3 className="text-xl font-bold mb-4">Category Breakdown</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {categoryStats.map((cat) => (
            <div key={cat.id} className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                  <span className="font-bold">{cat.name}</span>
                </div>
                <span className="text-sm font-medium text-zinc-500">{cat.completed} / {cat.total}</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full ${cat.color} transition-all duration-700 ease-out`}
                  style={{ width: `${cat.rate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
