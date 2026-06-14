import { createContext, useContext, useRef, type ReactNode } from "react";

type CelebrationContextType = {
  triggerBurst: () => void;
  onBurst: (fn: () => void) => () => void;
};

const CelebrationContext = createContext<CelebrationContextType | null>(null);

export function CelebrationProvider({ children }: { children: ReactNode }) {
  const listeners = useRef<Set<() => void>>(new Set());

  const triggerBurst = () => {
    listeners.current.forEach((fn) => fn());
  };

  const onBurst = (fn: () => void) => {
    listeners.current.add(fn);
    return () => listeners.current.delete(fn);
  };

  return (
    <CelebrationContext.Provider value={{ triggerBurst, onBurst }}>
      {children}
    </CelebrationContext.Provider>
  );
}

export function useCelebration() {
  const ctx = useContext(CelebrationContext);
  if (!ctx) throw new Error("useCelebration must be inside CelebrationProvider");
  return ctx;
}
