
import * as React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="theme-switch"
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
      />
      <Label htmlFor="theme-switch">{theme === "dark" ? "Dark" : "Light"} Mode</Label>
    </div>
  );
}
