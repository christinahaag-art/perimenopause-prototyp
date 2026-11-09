import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { LAST_PERIOD, Severity, Symptom } from '../data';

export type When = 'Heute' | 'Gestern' | 'Datum wählen';

export interface SavedEntry {
  when: When;
  symptoms: { name: Symptom; severity: Severity }[];
  note: string;
  time: string;
}

export type Overlay =
  | { kind: 'severity'; symptom: Symptom }
  | { kind: 'period' }
  | { kind: 'diary'; practiceId: string }
  | { kind: 'pdf' }
  | { kind: 'send'; practiceId: string }
  | { kind: 'info'; text: string; title?: string };

interface State {
  // Entwurf im Eintrag
  when: When;
  setWhen: (w: When) => void;
  draft: Partial<Record<Symptom, Severity>>;
  setSeverity: (s: Symptom, v: Severity | null) => void;
  note: string;
  setNote: (n: string) => void;
  resetDraft: () => void;
  // gespeicherter Eintrag von heute
  saved: SavedEntry | null;
  save: () => void;
  // Periode
  lastPeriod: Date;
  setLastPeriod: (d: Date) => void;
  periodSetInEntry: boolean;
  // Overlays
  overlays: Overlay[];
  open: (o: Overlay) => void;
  close: () => void;
  closeAll: () => void;
  info: (text: string, title?: string) => void;
  resetAll: () => void;
}

const Ctx = createContext<State | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [when, setWhen] = useState<When>('Heute');
  const [draft, setDraft] = useState<Partial<Record<Symptom, Severity>>>({});
  const [note, setNote] = useState('');
  const [saved, setSaved] = useState<SavedEntry | null>(null);
  const [lastPeriod, setLastPeriodRaw] = useState<Date>(LAST_PERIOD);
  const [periodSetInEntry, setPeriodSetInEntry] = useState(false);
  const [overlays, setOverlays] = useState<Overlay[]>([]);

  const setSeverity = useCallback((s: Symptom, v: Severity | null) => {
    setDraft((prev) => {
      const next = { ...prev };
      if (v) next[s] = v;
      else delete next[s];
      return next;
    });
  }, []);

  const resetDraft = useCallback(() => {
    setWhen('Heute');
    setDraft({});
    setNote('');
    setPeriodSetInEntry(false);
  }, []);

  const save = useCallback(() => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setSaved((prev) => {
      // Ergänzen: bestehende Symptome behalten, neue Stärke überschreibt
      const merged = new Map<Symptom, Severity>();
      prev?.symptoms.forEach((x) => merged.set(x.name, x.severity));
      (Object.entries(draft) as [Symptom, Severity][]).forEach(([k, v]) => merged.set(k, v));
      return {
        when,
        symptoms: [...merged.entries()].map(([name, severity]) => ({ name, severity })),
        note: note || prev?.note || '',
        time,
      };
    });
  }, [draft, note, when]);

  const setLastPeriod = useCallback((d: Date) => {
    setLastPeriodRaw(d);
    setPeriodSetInEntry(true);
  }, []);

  const open = useCallback((o: Overlay) => setOverlays((p) => [...p, o]), []);
  const close = useCallback(() => setOverlays((p) => p.slice(0, -1)), []);
  const closeAll = useCallback(() => setOverlays([]), []);
  const info = useCallback((text: string, title?: string) => setOverlays((p) => [...p, { kind: 'info', text, title }]), []);

  const resetAll = useCallback(() => {
    resetDraft();
    setSaved(null);
    setLastPeriodRaw(LAST_PERIOD);
    setOverlays([]);
  }, [resetDraft]);

  const value = useMemo(
    () => ({ when, setWhen, draft, setSeverity, note, setNote, resetDraft, saved, save, lastPeriod, setLastPeriod, periodSetInEntry, overlays, open, close, closeAll, info, resetAll }),
    [when, draft, setSeverity, note, resetDraft, saved, save, lastPeriod, setLastPeriod, periodSetInEntry, overlays, open, close, closeAll, info, resetAll],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp außerhalb des Providers');
  return v;
}
