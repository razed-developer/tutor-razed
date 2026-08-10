import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type AgeBand = "k4" | "5-8" | "9-12";
export const AGE_BANDS: AgeBand[] = ["k4", "5-8", "9-12"];
export const AGE_LABELS: Record<AgeBand, string> = { k4: "K–4", "5-8": "5–8", "9-12": "9–12" };

interface AudienceValue { ageBand: AgeBand; setAgeBand: (band: AgeBand) => void; label: string; }
const AudienceContext = createContext<AudienceValue | null>(null);

export function AudienceProvider({ children }: { children: React.ReactNode }) {
  const [ageBand, setAgeBand] = useState<AgeBand>(() => {
    const saved = localStorage.getItem("tutor-portal-age-band");
    return saved === "k4" || saved === "5-8" || saved === "9-12" ? saved : "5-8";
  });
  useEffect(() => {
    localStorage.setItem("tutor-portal-age-band", ageBand);
    document.documentElement.dataset.ageBand = ageBand;
  }, [ageBand]);
  const value = useMemo(() => ({ ageBand, setAgeBand, label: AGE_LABELS[ageBand] }), [ageBand]);
  return <AudienceContext.Provider value={value}>{children}</AudienceContext.Provider>;
}

export function useAudience() {
  const value = useContext(AudienceContext);
  if (!value) throw new Error("useAudience must be used inside AudienceProvider");
  return value;
}
