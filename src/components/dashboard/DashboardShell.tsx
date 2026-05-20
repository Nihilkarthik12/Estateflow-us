"use client";

import { useState, createContext, useContext } from "react";
import Sidebar from "./Sidebar";

interface DashboardContextValue {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  toggleMobile: () => void;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardShell");
  return ctx;
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <DashboardContext.Provider
      value={{
        mobileOpen,
        setMobileOpen,
        toggleMobile: () => setMobileOpen((v) => !v),
      }}
    >
      <div className="min-h-screen bg-[var(--background)]">
        <Sidebar />
        <div className="flex flex-col min-h-screen lg:ml-[240px] transition-[margin] duration-300">
          {children}
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
