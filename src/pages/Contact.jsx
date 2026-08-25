import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import Footer from "@/components/Footer";

const CONTACT_EMAIL = "hello@weatherskies.app";

export default function Contact() {
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
      const subject = `Weatherskies contact from ${name || "a visitor"}`;
      const body = `Name: ${name || "—"}\nEmail: ${email || "—"}\n\n${message}`;
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
    } catch {
      setError("Something went wrong. Please email us directly.");
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
          <Link
            to="/"
            className="ml-auto flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to app
          </Link>
        </div>
      </header>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex-1 w-full"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-4">
          Contact Us
        </h1>
        <p className="text-slate-600 leading-relaxed mb-8">
          Have a question, feedback, or found an issue with Weatherskies? We'd love to
          hear from you. Fill out the form below or reach us directly by email.
        </p>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 mb-6">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition"
          >
            <Mail className="w-5 h-5 text-sky-500" />
            <span className="font-medium">{CONTACT_EMAIL}</span>
          </a>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
              placeholder="How can we help?"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {status === "sent" ? (
            <p className="text-sm text-green-600">
              Your email app should have opened — thanks for reaching out!
            </p>
          ) : (
            <button
              type="submit"
              disabled={status === "sending"}
              className="px-5 py-2.5 rounded-full bg-slate-900 hover:bg-slate-700 disabled:opacity-50 text-white text-sm font-medium transition"
            >
              {status === "sending" ? "Opening…" : "Send Message"}
            </button>
          )}
        </form>
      </motion.main>

      <Footer />
    </div>
  );
}