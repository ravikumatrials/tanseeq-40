
import * as React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Switch
        id="theme-switch"
        checked={theme === "dark"}
        onCheckedChange={toggleTheme}
        className="data-[state=checked]:bg-tanseeq"
      />
      <Label 
        htmlFor="theme-switch" 
        className="cursor-pointer flex items-center gap-1.5 flex-1 text-sm"
      >
        {theme === "dark" ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center"
          >
            <Moon className="h-3.5 w-3.5 mr-1 text-tanseeq" />
            <span>Dark Mode</span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center"
          >
            <Sun className="h-3.5 w-3.5 mr-1 text-tanseeq" />
            <span>Light Mode</span>
          </motion.div>
        )}
      </Label>
    </div>
  );
}
