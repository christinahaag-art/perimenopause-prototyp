// Beispieldaten des Prototyps (Story-Datum: Mo, 5. Oktober 2026)

export type Severity = 'L' | 'M' | 'S';
export const SEV_LABEL: Record<Severity, string> = { L: 'leicht', M: 'mittel', S: 'stark' };
export const SEV_TITLE: Record<Severity, string> = { L: 'Leicht', M: 'Mittel', S: 'Stark' };
export const SEV_HINT: Record<Severity, string> = {
  L: 'Kaum spürbar, Alltag wie gewohnt',
  M: 'Deutlich spürbar, aber machbar',
  S: 'Schränkt mich im Alltag ein',
};
export const SEV_RANK: Record<Severity, number> = { L: 1, M: 2, S: 3 };

export const SYMPTOMS = [
  'Hitzewallungen',
  'Schlafprobleme',
  'Stimmungsschwankungen',
  'Erschöpfung',
  'Herzklopfen',
  'Gelenkschmerzen',
  'Konzentrationsprobleme',
] as const;
export type Symptom = (typeof SYMPTOMS)[number];

export const TODAY_LABEL = 'Mo, 5. Oktober';
export const TODAY_SHORT = '05.10.';

export interface Day {
  date: Date;
  symptoms: Partial<Record<Symptom, Severity>>;
  period?: boolean;
  note?: string;
}

const d = (m: number, day: number) => new Date(2026, m - 1, day);

// 30 Tage: 06.09.–05.10.2026 (aus dem Symptomtagebuch in Figma)
const ENTRIES: Record<string, Omit<Day, 'date'>> = {
  '9-8': { symptoms: { Schlafprobleme: 'L' } },
  '9-11': { symptoms: { Schlafprobleme: 'M', Erschöpfung: 'L' } },
  '9-14': { symptoms: {}, period: true },
  '9-15': { symptoms: {}, period: true },
  '9-16': { symptoms: { Hitzewallungen: 'M', Stimmungsschwankungen: 'L' }, period: true },
  '9-19': { symptoms: { Hitzewallungen: 'M', Schlafprobleme: 'S', Erschöpfung: 'M' }, note: 'kaum geschlafen, 3× wach' },
  '9-21': { symptoms: { Schlafprobleme: 'M' } },
  '9-24': { symptoms: { Hitzewallungen: 'S', Schlafprobleme: 'M', Stimmungsschwankungen: 'M' }, note: 'Hitzewallung im Meeting' },
  '9-25': { symptoms: { Schlafprobleme: 'M', Erschöpfung: 'M' } },
  '9-27': { symptoms: { Erschöpfung: 'L' } },
  '9-29': { symptoms: { Hitzewallungen: 'S', Schlafprobleme: 'M' } },
  '9-30': { symptoms: { Hitzewallungen: 'M', Stimmungsschwankungen: 'L' } },
  '10-2': { symptoms: {}, note: 'nachts zweimal aufgewacht' },
  '10-3': { symptoms: { Hitzewallungen: 'M', Schlafprobleme: 'S', Erschöpfung: 'M' } },
  '10-4': { symptoms: { Hitzewallungen: 'M', Schlafprobleme: 'M' } },
};

export const DAYS: Day[] = (() => {
  const out: Day[] = [];
  for (let t = d(9, 6).getTime(); t <= d(10, 5).getTime(); t += 86400000) {
    const date = new Date(t);
    const e = ENTRIES[`${date.getMonth() + 1}-${date.getDate()}`];
    out.push({ date, symptoms: e?.symptoms ?? {}, period: e?.period, note: e?.note });
  }
  return out;
})();

// Kalender „Deine letzten 4 Wochen“: Mo 7.9. – So 4.10.
export const CAL_DAYS = DAYS.filter((x) => x.date >= d(9, 7) && x.date <= d(10, 4));

export const WEEKDAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
export const WEEKDAYS_LONG = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

export function maxSeverity(day: Day, filter: Symptom | 'Alle'): Severity | undefined {
  const values = filter === 'Alle' ? Object.values(day.symptoms) : [day.symptoms[filter]];
  let best: Severity | undefined;
  for (const v of values) if (v && (!best || SEV_RANK[v] > SEV_RANK[best])) best = v;
  return best;
}

export const PATTERN_FILTERS: (Symptom | 'Alle')[] = ['Alle', 'Schlafprobleme', 'Hitzewallungen', 'Erschöpfung', 'Stimmungsschwankungen'];

export function countSymptom(s: Symptom, days = DAYS) {
  return days.filter((x) => x.symptoms[s]).length;
}

export const LAST_PERIOD = d(9, 14);

// Fachpraxen
export interface Practice {
  id: string;
  name: string;
  practice: string;
  role: string;
  distance: string;
  walk: string;
  address: string;
  insurance: string;
  insuranceKind: 'beide' | 'privat';
  focus: string[];
  photo: string;
  initials: string;
  newPatients: boolean;
}

export const MATCHING = ['Schlafprobleme', 'Hitzewallungen'];

export const PRACTICES: Practice[] = [
  {
    id: 'berger',
    name: 'Dr. Anna Berger',
    practice: 'Praxis am Helmholtzplatz',
    role: 'Frauenärztin',
    distance: '1,2 km',
    walk: 'ca. 15 Min. zu Fuß',
    address: 'Lychener Straße 40, 10437 Berlin',
    insurance: 'Gesetzlich & privat',
    insuranceKind: 'beide',
    focus: ['Schlafprobleme', 'Hitzewallungen', 'Hormontherapie'],
    photo: '/img/arzt-berger.jpg',
    initials: 'AB',
    newPatients: true,
  },
  {
    id: 'kaya',
    name: 'Dr. Selin Kaya',
    practice: 'Frauenarztpraxis Schönhauser Allee',
    role: 'Frauenärztin',
    distance: '2,0 km',
    walk: 'ca. 25 Min. zu Fuß',
    address: 'Schönhauser Allee 112, 10439 Berlin',
    insurance: 'Gesetzlich & privat · auch online',
    insuranceKind: 'beide',
    focus: ['Stimmung', 'Zyklusstörungen'],
    photo: '/img/arzt-kaya.jpg',
    initials: 'SK',
    newPatients: true,
  },
  {
    id: 'hoffmann',
    name: 'Dr. Maria Hoffmann',
    practice: 'Gynäkologie Greifswalder Straße',
    role: 'Frauenärztin',
    distance: '3,4 km',
    walk: 'ca. 40 Min. zu Fuß',
    address: 'Greifswalder Straße 80, 10405 Berlin',
    insurance: 'Gesetzlich & privat',
    insuranceKind: 'beide',
    focus: ['Hitzewallungen', 'Osteoporose'],
    photo: '/img/arzt-hoffmann.jpg',
    initials: 'MH',
    newPatients: false,
  },
  {
    id: 'neumann',
    name: 'Dr. Julia Neumann',
    practice: 'Praxis an der Bernauer Straße',
    role: 'Frauenärztin',
    distance: '4,1 km',
    walk: 'ca. 50 Min. zu Fuß',
    address: 'Bernauer Straße 62, 13355 Berlin',
    insurance: 'Nur privat',
    insuranceKind: 'privat',
    focus: ['Schlafprobleme', 'Erschöpfung'],
    photo: '/img/arzt-neumann.jpg',
    initials: 'JN',
    newPatients: true,
  },
];

export const fmtDate = (x: Date) => `${String(x.getDate()).padStart(2, '0')}.${String(x.getMonth() + 1).padStart(2, '0')}.`;
const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
export const fmtLong = (x: Date) => `${x.getDate()}. ${MONTHS[x.getMonth()]}`;
export const fmtDay = (x: Date) => `${WEEKDAYS_LONG[x.getDay()]}, ${fmtLong(x)}`;

/** Symptome mit Einträgen im Zeitraum, nach Häufigkeit sortiert (für den Muster-Filter). */
export function symptomsByFrequency(days = DAYS): { s: Symptom; n: number }[] {
  return SYMPTOMS.map((s) => ({ s, n: countSymptom(s, days) })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n);
}
export const SHORT_NAME: Partial<Record<Symptom, string>> = { Schlafprobleme: 'Schlaf', Hitzewallungen: 'Hitze', Stimmungsschwankungen: 'Stimmung' };
