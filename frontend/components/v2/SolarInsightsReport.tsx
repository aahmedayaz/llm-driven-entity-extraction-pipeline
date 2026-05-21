"use client";

import type { LucideIcon } from "lucide-react";
import {
  Battery,
  Home,
  Leaf,
  PoundSterling,
  Sun,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

import type { PropertyInsights } from "@/lib/property-api";

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.03)] p-4">
      <div className="mb-2 flex items-center gap-2 text-[#9fca72]">
        <Icon className="h-4 w-4" />
        <span className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
          {label}
        </span>
      </div>
      <p className="text-lg font-semibold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

interface SolarInsightsReportProps {
  insights: PropertyInsights;
  address: string;
}

export function SolarInsightsReport({ insights, address }: SolarInsightsReportProps) {
  const { epc, solar } = insights;
  const property = (solar.property ?? {}) as Record<string, unknown>;
  const roof = (solar.roof ?? {}) as Record<string, unknown>;
  const potential = (solar.solar_potential ?? {}) as Record<string, unknown>;
  const battery = (solar.with_battery ?? {}) as Record<string, unknown>;
  const quality = (solar.data_quality ?? {}) as Record<string, unknown>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="rounded-2xl border border-[#9fca72]/25 bg-gradient-to-br from-[#6f8f4e]/15 to-transparent p-5 sm:p-6">
        <p className="text-xs uppercase tracking-wider text-[#9fca72]">Your property</p>
        <h2 className="mt-1 text-lg font-semibold text-[var(--text-primary)] sm:text-xl">
          {(property.address as string) ?? address}
        </h2>
        <p className="mt-1 text-sm text-[var(--text-secondary)]">
          UPRN {insights.uprn}
          {property.property_type ? ` · ${String(property.property_type)}` : ""}
        </p>
      </div>

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <Zap className="h-4 w-4 text-[#9fca72]" />
          EPC & energy
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="Current efficiency"
            value={
              epc.current_energy_efficiency != null
                ? `${epc.current_energy_efficiency}`
                : "—"
            }
            icon={TrendingUp}
          />
          <StatCard
            label="Potential efficiency"
            value={
              epc.potential_energy_efficiency != null
                ? `${epc.potential_energy_efficiency}`
                : "—"
            }
            icon={TrendingUp}
          />
          <StatCard
            label="Last EPC date"
            value={epc.last_epc_date ?? "—"}
            icon={Home}
          />
          <StatCard
            label="Floor area"
            value={
              epc.epc_floor_area != null ? `${epc.epc_floor_area} m²` : "—"
            }
            icon={Home}
          />
          <StatCard
            label="Construction age"
            value={epc.construction_age_band ?? "—"}
            icon={Home}
          />
        </div>
      </section>

      <section>
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <Sun className="h-4 w-4 text-[#9fca72]" />
          Solar potential
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            label="System size"
            value={
              potential.system_size_kwp != null
                ? `${potential.system_size_kwp} kWp`
                : "—"
            }
            icon={Sun}
          />
          <StatCard
            label="Annual generation"
            value={
              potential.annual_generation_kwh != null
                ? `${potential.annual_generation_kwh} kWh`
                : "—"
            }
            icon={Zap}
          />
          <StatCard
            label="Annual savings"
            value={
              potential.annual_savings_gbp != null
                ? `£${potential.annual_savings_gbp}`
                : "—"
            }
            icon={PoundSterling}
          />
          <StatCard
            label="Payback"
            value={
              potential.payback_years != null
                ? `${potential.payback_years} years`
                : "—"
            }
            icon={TrendingUp}
          />
          <StatCard
            label="CO₂ saved / year"
            value={
              potential.co2_saved_kg_per_year != null
                ? `${potential.co2_saved_kg_per_year} kg`
                : "—"
            }
            icon={Leaf}
          />
          <StatCard
            label="Trees equivalent"
            value={
              potential.trees_equivalent_per_year != null
                ? `${potential.trees_equivalent_per_year}`
                : "—"
            }
            icon={Leaf}
          />
        </div>
      </section>

      {Object.keys(battery).length > 0 && (
        <section className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Battery className="h-4 w-4 text-[#9fca72]" />
            With battery storage
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <StatCard
              label="Annual savings"
              value={
                battery.annual_savings_gbp != null
                  ? `£${battery.annual_savings_gbp}`
                  : "—"
              }
              icon={PoundSterling}
            />
            <StatCard
              label="Self consumption"
              value={
                battery.self_consumption_pct != null
                  ? `${battery.self_consumption_pct}%`
                  : "—"
              }
              icon={Battery}
            />
            <StatCard
              label="Total system cost"
              value={
                battery.total_system_cost_gbp != null
                  ? `£${battery.total_system_cost_gbp}`
                  : "—"
              }
              icon={PoundSterling}
            />
            <StatCard
              label="Payback"
              value={
                battery.payback_years != null ? `${battery.payback_years} years` : "—"
              }
              icon={TrendingUp}
            />
          </div>
        </section>
      )}

      {roof.usable_area_m2 != null && (
        <p className="text-xs text-[var(--text-secondary)]">
          Roof usable area ~{String(roof.usable_area_m2)} m² · confidence:{" "}
          {String(quality.confidence ?? "—")}
        </p>
      )}
    </motion.div>
  );
}
