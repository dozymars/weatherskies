import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";
import LanguageSwitcher from "@/components/weather/LanguageSwitcher";
import { useLanguage } from "@/lib/LanguageContext";
import { base44 } from "@/api/base44Client";

export default function Contact() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await base44.functions.invoke("sendContactMessage", {
        name,
        email,
        message,
      });
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError(t("contact.error"));
      setStatus("error");
    }
  }

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
        className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex-1 w-full"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
          {t("contact.title")}
        </h1>
        <p className="text-slate-600 leading-relaxed mb-8">{t("contact.intro")}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("contact.name")}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder={t("contact.namePh")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("contact.email")}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder={t("contact.emailPh")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {t("contact.message")}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
              placeholder={t("contact.messagePh")}
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {status === "sent" ? (
            <p className="text-sm text-green-600">{t("contact.sent")}</p>
          ) : (
            <button
              type="submit"
              disabled={status === "sending"}
              className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-700 disabled:opacity-50 text-white text-sm font-medium transition"
            >
              {status === "sending" ? t("contact.opening") : t("contact.send")}
            </button>
          )}
        </form>
      </motion.main>

      <Footer />
    </div>
  );
}