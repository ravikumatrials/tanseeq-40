
import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check for saved theme preference or system preference
    if (typeof window !== "undefined") {
      const savedTheme = window.localStorage.getItem("theme") as Theme;
      const systemPreference = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      return savedTheme || systemPreference;
    }
    return "light"; // Default to light
  });

  useEffect(() => {
    // Update class on document.documentElement when theme changes
    const root = window.document.documentElement;
    
    // Add transition class before changing theme
    root.classList.add('transition-colors', 'duration-300');
    
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    
    // Save theme preference
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
