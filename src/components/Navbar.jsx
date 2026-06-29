import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Analyze", path: "/analyze" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full h-16 bg-[#e0e5ec] shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] flex items-center justify-between px-6 transition-all duration-300">
      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer group select-none"
        onClick={() => navigate("/")}
      >
        <span className="text-lg font-extrabold text-[#2d3748] tracking-tight group-hover:text-[#7C3AED] transition-colors duration-200">
          ResumeRoast
        </span>
        <span className="text-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
          🔥
        </span>
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={cn(
                "text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer rounded-xl py-2 px-4 select-none",
                isActive
                  ? "text-[#7C3AED] bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff]"
                  : "text-[#2d3748] hover:text-[#7C3AED] hover:shadow-[4px_4px_8px_#b8bec7,-4px_-4px_8px_#ffffff]"
              )}
            >
              {item.name}
            </button>
          );
        })}
      </div>
    </nav>
  );
}