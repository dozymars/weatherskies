import React, { useState } from "react";
import { motion } from "framer-motion";
import { Wind, Droplets, Flame } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AirAtmosphere from "./AirAtmosphere";
import WaterFlood from "./WaterFlood";
import FireSmoke from "./FireSmoke";

export default function EnvironmentPanel({ airData, waterData, fireData, envLoading }) {
  const [tab, setTab] = useState("air");
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="rounded-3xl bg-slate-100 border border-slate-200 p-5 sm:p-6"
    >
      <h3 className="text-slate-700 text-sm font-semibold uppercase tracking-wider mb-4">
        Environment
      </h3>
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full bg-white border border-slate-200 h-auto">
          <TabsTrigger value="air" className="flex items-center gap-1.5 text-xs py-1.5">
            <Wind className="w-3.5 h-3.5 text-sky-600" /> Air
          </TabsTrigger>
          <TabsTrigger value="water" className="flex items-center gap-1.5 text-xs py-1.5">
            <Droplets className="w-3.5 h-3.5 text-blue-600" /> Water
          </TabsTrigger>
          <TabsTrigger value="fire" className="flex items-center gap-1.5 text-xs py-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-600" /> Fire
          </TabsTrigger>
        </TabsList>
        <TabsContent value="air" className="mt-4">
          <AirAtmosphere airData={airData} />
        </TabsContent>
        <TabsContent value="water" className="mt-4">
          <WaterFlood waterData={waterData} loading={envLoading} />
        </TabsContent>
        <TabsContent value="fire" className="mt-4">
          <FireSmoke fireData={fireData} loading={envLoading} />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}