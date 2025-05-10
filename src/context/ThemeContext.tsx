
import React, { createContext, useContext } from "react";

interface ThemeContextType {
  theme: "light";
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always use light theme
  const theme = "light";

  // This function is kept for compatibility but does nothing now
  const toggleTheme = () => {
    // No-op function, we no longer toggle themes
    console.log("Theme toggling disabled - app uses light mode only");
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
