import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

export default function About() {
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
        className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16 flex-1 w-full"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-6">
          About Weatherskies
        </h1>
        <div className="space-y-5 text-slate-700 leading-relaxed">
          <p>
            Weatherskies is a clean, fast, and reliable weather application designed to
            give you an accurate picture of conditions wherever you are. From a single
            dashboard you get the current temperature, real-feel, humidity, wind,
            pressure, and precipitation, alongside an hourly outlook for the next 24
            hours and a detailed 10-day forecast. Each day expands to reveal the UV
            index, sunrise and sunset times, precipitation chance, and wind direction,
            so you can plan with confidence.
          </p>
          <p>
            Weatherskies also keeps an eye on the bigger picture. An Environment panel
            surfaces local air quality, atmospheric pollutants, and nearby weather
            alerts, while an interactive map lets you visualize your selected location
            at a glance. Save your favorite cities, switch between metric and imperial
            units, and choose a background theme that suits your mood — your
            preferences are remembered between visits.
          </p>
          <p>
            Weatherskies is built for everyone who needs dependable weather
            information: commuters timing their morning, travelers exploring new
            cities, parents planning outdoor activities, and outdoor enthusiasts
            tracking conditions for hiking, running, or cycling.
          </p>
          <p>
            Weatherskies is built and maintained on the Base44 platform, combining
            trusted public weather data sources with a focus on clarity, speed, and a
            distraction-free experience.
          </p>
        </div>
      </motion.main>

      <Footer />
    </div>
  );
}