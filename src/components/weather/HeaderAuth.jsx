import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function HeaderAuth() {
  const { user, isAuthenticated, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleLogout() {
    logout();
    setOpen(false);
  }

  if (!isAuthenticated) {
    return (
      <Link
        to="/login"
        className="flex items-center gap-1.5 h-9 px-3 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-sm hover:bg-white/25 transition"
      >
        <LogIn className="w-4 h-4" />
        <span className="hidden sm:inline">Log in</span>
      </Link>
    );
  }

  const initial = (user?.full_name || user?.email || "U").charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 h-9 pl-1.5 pr-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-sm hover:bg-white/25 transition"
      >
        <span className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center text-xs font-semibold">
          {initial}
        </span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/40 overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-slate-800">
              <UserIcon className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium truncate">
                {user?.full_name || "Account"}
              </span>
            </div>
            {user?.email && (
              <p className="text-xs text-slate-500 truncate mt-1 ml-6">{user.email}</p>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}