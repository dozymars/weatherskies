import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/weather/LanguageSwitcher";
import { useLanguage } from "@/lib/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-slate-100 flex flex-col">
      <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-2">
          <img
            src="https://media.base44.com/images/public/6a866866b2a189c37aa2f3d0/9fc2fbc5e_image.png"
            alt="Weatherskies"
            className="w-7 h-7 rounded-lg object-cover"
          />
          <span className="font-semibold tracking-tight text-slate-900">Weatherskies</span>
          <div className="ml-auto flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              to="/"
              className="flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition"
            >
              <ArrowLeft className="w-4 h-4" /> {t("nav.backToApp")}
            </Link>
          </div>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex-1 w-full"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-6">
          {t("about.title")}
        </h1>
        <div className="space-y-5 text-slate-700 leading-relaxed">
          <p>{t("about.p1")}</p>
          <p>{t("about.p2")}</p>
          <p>{t("about.p3")}</p>
          <p>{t("about.p4")}</p>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}