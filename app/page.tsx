"use client";

import {useState, useEffect} from "react";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        console.error("Failed to parse todos from localStorage", e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage when todos change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos, isInitialized]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? {...todo, completed: !todo.completed} : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  if (!isInitialized) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans p-8 dark:bg-black dark:text-white">
      <main className="w-full max-w-md flex flex-col gap-8">
        <h1 className="text-4xl font-bold text-center mt-8">ToDo App</h1>

        <form onSubmit={addTodo} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Add
          </button>
        </form>

        <ul className="flex flex-col gap-3">
          {todos.length === 0 ? (
            <p className="text-center text-zinc-500 py-4">No tasks yet. Add one above!</p>
          ) : (
            todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border dark:bg-zinc-900 dark:border-zinc-800"
              >
                <div className="flex items-center gap-3 flex-1">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="w-5 h-5 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span
                    className={`text-lg transition-all ${
                      todo.completed
                        ? "line-through text-zinc-400"
                        : "text-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                  aria-label="Delete task"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                </button>
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
}
