"use client";
import { useTheme } from "next-themes";


export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();


  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };


  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      title={`${theme}`}
      className="sm:text-2xl text-xl cursor-pointer"
    >
      {theme === "dark" ? (
        <span>🌕</span>
      ) : theme === "light" ? (
        <span>☀️</span>
      ) : (
        <span>💻</span>
      )}
    </button>
  );
}
