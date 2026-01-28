"use client";

import { useState } from "react";
import { useTodo } from "@/context/TodoContext";
import { Trash2, Plus, Tag } from "lucide-react";

const COLORS = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-red-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-zinc-500",
];

export default function CategoriesPage() {
  const { categories, addCategory, deleteCategory, isInitialized } = useTodo();
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addCategory(name.trim(), selectedColor);
    setName("");
  };

  if (!isInitialized) return null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Categories</h2>
        <p className="text-zinc-500">Organize your tasks by topics.</p>
      </header>

      <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-500">Category Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Study, Health, Travel"
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5 text-zinc-500">Pick a Color</label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full transition-all flex items-center justify-center ${color} ${
                    selectedColor === color ? "ring-4 ring-offset-2 ring-blue-500 dark:ring-offset-black" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Create Category
          </button>
        </form>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group relative flex flex-col p-5 bg-white rounded-2xl shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${cat.color} text-white shadow-lg shadow-${cat.color.split('-')[1]}-500/20`}>
                <Tag size={24} />
              </div>
              <button
                onClick={() => deleteCategory(cat.id)}
                className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                aria-label="Delete category"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <h3 className="text-xl font-bold">{cat.name}</h3>
            <p className="text-zinc-500 text-sm mt-1">
              {/* Optional: Add task count here */}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
