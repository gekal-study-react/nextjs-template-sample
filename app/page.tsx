"use client";

import { useState } from "react";
import { useTodo } from "@/context/TodoContext";
import { Trash2, Plus, Calendar } from "lucide-react";

export default function Home() {
  const { todos, categories, addTodo, toggleTodo, deleteTodo, isInitialized } = useTodo();
  const [inputValue, setInputValue] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    addTodo(inputValue.trim(), selectedCategory);
    setInputValue("");
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold mb-2">My Tasks</h2>
        <p className="text-zinc-500">Manage your daily activities and stay organized.</p>
      </header>

      <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-zinc-200 dark:border-zinc-800 mb-8">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 transition-all"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium flex items-center gap-2"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-zinc-500 mr-2">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === cat.id
                    ? `${cat.color} text-white`
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </form>
      </section>

      <div className="space-y-4">
        {todos.length === 0 ? (
          <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
            <Calendar className="mx-auto mb-4 text-zinc-300" size={48} />
            <p className="text-zinc-500">No tasks yet. Enjoy your free time!</p>
          </div>
        ) : (
          <ul className="grid gap-3">
            {[...todos].sort((a, b) => b.createdAt - a.createdAt).map((todo) => {
              const category = categories.find((c) => c.id === todo.categoryId);
              return (
                <li
                  key={todo.id}
                  className="group flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="peer h-6 w-6 rounded-lg border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer transition-all"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`text-lg font-medium transition-all ${
                          todo.completed
                            ? "line-through text-zinc-400"
                            : "text-zinc-800 dark:text-zinc-200"
                        }`}
                      >
                        {todo.text}
                      </span>
                      {category && (
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full w-fit mt-1 text-white ${category.color}`}>
                          {category.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Delete task"
                  >
                    <Trash2 size={18} />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
