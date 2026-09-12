import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wind, CloudSun } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AirAtmosphere from "./AirAtmosphere";
import WeatherNews from "./WeatherNews";
import WeatherNewsRefresh from "./WeatherNewsRefresh";
import { useLanguage } from "@/lib/LanguageContext";

export default function EnvironmentPanel({ airData, newsData, newsLoading, onRefreshed }) {
  const { t } = useLanguage();
  const [tab, setTab] = useState("weather");
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-3xl bg-slate-100 border border-slate-200 p-5 sm:p-6"
    >
      <h3 className="text-slate-700 text-sm font-semibold uppercase tracking-wider mb-4">
        {t("env.environment")}
      </h3>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full bg-white border border-slate-200 h-auto">
          <TabsTrigger value="weather" className="flex items-center gap-1.5 text-xs py-1.5">
            <CloudSun className="w-3.5 h-3.5 text-indigo-500" /> {t("env.weatherNews")}
          </TabsTrigger>
          <TabsTrigger value="air" className="flex items-center gap-1.5 text-xs py-1.5">
            <Wind className="w-3.5 h-3.5 text-sky-600" /> {t("env.air")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="weather" className="mt-4">
          <WeatherNewsRefresh onRefreshed={onRefreshed} />
          <WeatherNews newsData={newsData} loading={newsLoading} />
        </TabsContent>
        <TabsContent value="air" className="mt-4">
          <AirAtmosphere airData={airData} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}