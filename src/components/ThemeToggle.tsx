// src/components/ThemeToggle.tsx
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ isDarkMode, toggleTheme }: { isDarkMode: boolean; toggleTheme: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun className="h-[1.5rem] w-[1.5rem] transition-all" />
      ) : (
        <Moon className="h-[1.5rem] w-[1.5rem] transition-all" />
      )}
    </Button>
  );
}
