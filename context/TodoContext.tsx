"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Todo = {
  id: number;
  text: string;
  completed: boolean;
  categoryId: string;
  createdAt: number;
};

type TodoContextType = {
  todos: Todo[];
  categories: Category[];
  addTodo: (text: string, categoryId: string) => void;
  toggleTodo: (id: number) => void;
  deleteTodo: (id: number) => void;
  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  isInitialized: boolean;
};

const TodoContext = createContext<TodoContextType | undefined>(undefined);

const DEFAULT_CATEGORIES: Category[] = [
  { id: "1", name: "Work", color: "bg-blue-500" },
  { id: "2", name: "Personal", color: "bg-green-500" },
  { id: "3", name: "Shopping", color: "bg-purple-500" },
];

export const TodoProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    const savedCategories = localStorage.getItem("categories");
    
    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (e) {
        console.error("Failed to parse todos", e);
      }
    }
    
    if (savedCategories) {
      try {
        setCategories(JSON.parse(savedCategories));
      } catch (e) {
        console.error("Failed to parse categories", e);
      }
    }
    
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("todos", JSON.stringify(todos));
      localStorage.setItem("categories", JSON.stringify(categories));
    }
  }, [todos, categories, isInitialized]);

  const addTodo = (text: string, categoryId: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      categoryId,
      createdAt: Date.now(),
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const addCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      color,
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    // Also remove or reassign todos in this category? 
    // For simplicity, let's keep them but they might have missing category info in UI
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        categories,
        addTodo,
        toggleTodo,
        deleteTodo,
        addCategory,
        deleteCategory,
        isInitialized,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodo must be used within a TodoProvider");
  }
  return context;
};
