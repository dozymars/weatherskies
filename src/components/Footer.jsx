import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/60 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <img
            src="https://media.base44.com/images/public/6a866866b2a189c37aa2f3d0/9fc2fbc5e_image.png"
            alt="Weatherskies"
            className="w-5 h-5 rounded object-cover"
          />
          <span className="font-medium text-slate-700">Weatherskies</span>
        </div>
        <nav className="flex items-center gap-5">
          <Link to="/" className="hover:text-slate-900 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-slate-900 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-slate-900 transition">
            Contact
          </Link>
        </nav>
        <p className="text-xs">© {new Date().getFullYear()} Weatherskies</p>
      </div>
    </footer>
  );
}