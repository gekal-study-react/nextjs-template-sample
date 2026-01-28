import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TodoProvider } from "@/context/TodoContext";
import Navigation from "@/components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pro Todo App",
  description: "Advanced Todo Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-100`}
      >
        <TodoProvider>
          <div className="flex flex-col md:flex-row min-h-screen">
            <Navigation />
            <main className="flex-1 pb-20 md:pb-0 overflow-auto">
              {children}
            </main>
          </div>
        </TodoProvider>
      </body>
    </html>
  );
}
