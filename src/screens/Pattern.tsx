import { ReactNode, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DiaryCard from '../components/DiaryCard';
import Kopf from '../components/Kopf';
import Icon from '../components/Icon';
import TabBar from '../components/TabBar';
import { CAL_DAYS, countSymptom, Day, fmtDay, fmtLong, maxSeverity, SEV_LABEL, SEV_RANK, Severity, SHORT_NAME, Symptom, symptomsByFrequency, WEEKDAYS } from '../data';
import { useApp } from '../state/AppState';

type Filter = Symptom | 'Alle';

const EXPLAIN: Record<Filter, { title: string; text: string }> = {
  Alle: {
    title: 'Schlaf und Hitze hängen oft zusammen',
    text: 'Schlafprobleme und Hitzewallungen treten in der Perimenopause häufig gemeinsam auf – zum Beispiel, wenn nächtliche Hitzewallungen dich aufwachen lassen.',
  },
  Schlafprobleme: {
    title: 'Schlafprobleme in der Perimenopause',
    text: 'Durchschlafprobleme gehören zu den häufigsten Beschwerden in der Perimenopause. Oft stecken nächtliche Hitzewallungen oder hormonelle Schwankungen dahinter.',
  },
  Hitzewallungen: {
    title: 'Hitzewallungen in der Perimenopause',
    text: 'Hitzewallungen entstehen, wenn schwankende Hormone die Temperaturregelung des Körpers beeinflussen. Sie kommen oft in Wellen und auch nachts.',
  },
  Erschöpfung: {
    title: 'Erschöpfung hat oft mehrere Gründe',
    text: 'Erschöpfung in der Perimenopause hängt häufig mit unruhigem Schlaf zusammen. Sie kann aber auch andere Ursachen haben – sprich sie in der Praxis an.',
  },
  Stimmungsschwankungen: {
    title: 'Stimmung und Hormone',
    text: 'Schwankende Hormone können die Stimmung beeinflussen. Viele Frauen erleben das in der Perimenopause – du bist damit nicht allein.',
  },
  Herzklopfen: { title: '', text: '' },
  Gelenkschmerzen: { title: '', text: '' },
  Konzentrationsprobleme: { title: '', text: '' },
};

const SLEEP_TIPS = ['Schlafzimmer kühl halten, etwa 16–18 °C', 'Leichte, atmungsaktive Bettdecke und Kleidung', 'Abends wenig Alkohol und Koffein', 'Feste Zeiten zum Schlafengehen und Aufstehen'];

function dominant(days: Day[], f: Filter): string {
  const counts: Record<Severity, number> = { L: 0, M: 0, S: 0 };
  days.forEach((d) => {
    const s = maxSeverity(d, f);
    if (s) counts[s]++;
  });
  const sorted = (Object.keys(counts) as Severity[]).sort((a, b) => counts[b] - counts[a] || SEV_RANK[b] - SEV_RANK[a]);
  if (counts[sorted[1]] >= counts[sorted[0]] * 0.6 && counts[sorted[1]] > 0) {
    const pair = [sorted[0], sorted[1]].sort((a, b) => SEV_RANK[a] - SEV_RANK[b]);
    return `${SEV_LABEL[pair[0]]} bis ${SEV_LABEL[pair[1]]}`;
  }
  return SEV_LABEL[sorted[0]];
}

function summary(f: Filter): ReactNode {
  if (f === 'Alle') {
    return (
      <>In den letzten 30 Tagen hast du an <b>12 Tagen</b> Beschwerden eingetragen. Am häufigsten: <b>Schlafprobleme</b> und <b>Hitzewallungen</b>, meist <b>mittel bis stark</b>.</>
    );
  }
  if (f === 'Schlafprobleme') {
    return (
      <>In den letzten 30 Tagen hattest du an <b>9 Tagen</b> Schlafprobleme, meist <b>mittel</b>. An 5 dieser Tage kamen <b>Hitzewallungen</b> dazu.</>
    );
  }
  const n = countSymptom(f);
  const days = CAL_DAYS.filter((d) => d.symptoms[f]);
  return (
    <>In den letzten 30 Tagen hattest du an <b>{n} Tagen</b> {f}, meist <b>{dominant(days, f)}</b>.</>
  );
}

export default function Pattern() {
  const navigate = useNavigate();
  const { open, info, lastPeriod, patternFilter: filter, setPatternFilter: setFilter } = useApp();
  const [range, setRange] = useState('30 Tage');
  // Filter „Häufigste + weitere“: Alle + 2 häufigste (oder der aktive) + „+ N weitere“
  const freq = symptomsByFrequency();
  const top = freq.slice(0, 2).map((x) => x.s);
  const visible: Symptom[] = filter === 'Alle' || top.includes(filter as Symptom) ? top : [filter as Symptom];
  const more = freq.length - visible.length;
  const [selected, setSelected] = useState(() => CAL_DAYS.findIndex((d) => d.date.getMonth() === 8 && d.date.getDate() === 29));

  const daysWith = useMemo(() => CAL_DAYS.filter((d) => maxSeverity(d, filter)), [filter]);
  const sel = CAL_DAYS[selected];
  const selList = (Object.entries(sel.symptoms) as [Symptom, Severity][])
    .filter(([s]) => filter === 'Alle' || s === filter)
    .sort((a, b) => SEV_RANK[b[1]] - SEV_RANK[a[1]]);
  const periodDays = new Set([0, 1, 2].map((i) => new Date(lastPeriod.getTime() + i * 86400000).toDateString()));

  const bars = (['Schlafprobleme', 'Hitzewallungen', 'Erschöpfung', 'Stimmungsschwankungen'] as Symptom[]).map((s) => ({ s, n: countSymptom(s) }));
  const ex = EXPLAIN[filter];

  return (
    <>
      <main className="screen anim-fade" aria-label="Dein Muster">
        <Kopf overline="Was deine Einträge zeigen" title="Dein Muster" illustration="muster" />
        <div className="below-kopf">
        <div className="segment" role="group" aria-label="Zeitraum">
          {['14 Tage', '30 Tage', '3 Monate'].map((r) => (
            <button key={r} aria-pressed={range === r} onClick={() => (r === '30 Tage' ? setRange(r) : (setRange(r), info('Im Prototyp zeigen alle Zeiträume die Daten der letzten 30 Tage.')))}>
              {r}
            </button>
          ))}
        </div>

        <section className="card card--highlight" style={{ marginTop: 24 }} aria-label="Zusammenfassung">
          <p className="t-overline" style={{ marginBottom: 6 }}>Zusammenfassung</p>
          <p className="t-body-l">{summary(filter)}</p>
        </section>

        <h2 className="t-h2" style={{ margin: '24px 0 12px' }}>Deine letzten 4 Wochen</h2>
        <div className="chip-row" style={{ gap: 8, flexWrap: 'nowrap' }} role="radiogroup" aria-label="Symptom-Filter">
          {(['Alle', ...visible] as Filter[]).map((f) => (
            <button key={f} role="radio" aria-checked={filter === f} className={`chip${filter === f ? ' chip--selected' : ''}`} onClick={() => setFilter(f)}>
              {f === 'Alle' ? 'Alle' : SHORT_NAME[f as Symptom] ?? f}
            </button>
          ))}
          {more > 0 && (
            <button className="chip chip--add" style={{ fontWeight: 500 }} onClick={() => open({ kind: 'symptoms' })}>
              + {more} weitere
            </button>
          )}
        </div>
        <p className="t-caption" style={{ margin: '14px 0 12px', fontSize: 15 }}>
          {filter === 'Alle' ? 'Beschwerden' : filter} an <b>{daysWith.length} von 28 Tagen</b>, meist <b>{dominant(daysWith, filter)}</b>.
        </p>

        <p className="t-caption c-2" style={{ textAlign: 'center', marginBottom: 6 }}>September – Oktober 2026</p>
        <div className="cal" role="grid" aria-label="Kalender der letzten 4 Wochen">
          {WEEKDAYS.map((w) => (
            <div key={w} className="cal__head">{w}</div>
          ))}
          {CAL_DAYS.map((d, i) => {
            const s = maxSeverity(d, filter);
            const isSel = i === selected;
            return (
              <button
                key={d.date.toISOString()}
                className={`cal__cell${s ? ` cal__cell--${s.toLowerCase()}` : ''}${isSel ? ' cal__cell--sel' : ''}${d.date.getMonth() === 9 ? ' cal__cell--out' : ''}`}
                onClick={() => setSelected(i)}
                aria-label={`${fmtDay(d.date)}${s ? `, ${SEV_LABEL[s]}` : ', kein Eintrag'}${periodDays.has(d.date.toDateString()) ? ', Periode' : ''}`}
                aria-pressed={isSel}
              >
                {periodDays.has(d.date.toDateString()) && <span className="cal__period" />}
                {s && <span className={`cal__pill cal__pill--${s.toLowerCase()}`} />}
                <span className="cal__num">{d.date.getDate()}</span>
              </button>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 16, margin: '12px 0 8px', fontSize: 14, alignItems: 'center' }}>
          {(['L', 'M', 'S'] as Severity[]).map((v) => (
            <span key={v} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className={`sev-dot sev-dot--${v.toLowerCase()}`} style={{ width: 14, height: 14 }} />
              {SEV_LABEL[v]}
            </span>
          ))}
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 4, height: 12, borderRadius: 2, background: 'var(--periode)' }} /> Periode
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className="t-caption c-2">Letzte Periode begonnen: <b style={{ color: 'var(--text)' }}>{fmtLong(lastPeriod)}</b></p>
          <button className="link link--underline" style={{ minHeight: 44 }} onClick={() => open({ kind: 'period' })}>Ändern</button>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', marginTop: 8, padding: '14px 0 4px', display: 'flex', justifyContent: 'space-between', gap: 12 }} aria-live="polite">
          <p className="t-caption" style={{ fontWeight: 700 }}>{fmtDay(sel.date)}</p>
          <p className="t-caption" style={{ textAlign: 'right' }}>
            {selList.length ? selList.map(([s, v]) => <span key={s} style={{ display: 'block' }}>{s} · {SEV_LABEL[v]}</span>) : <span className="c-2">Kein Eintrag</span>}
            {sel.note && <span className="c-2" style={{ display: 'block' }}>„{sel.note}“</span>}
          </p>
        </div>

        <div style={{ marginTop: 24 }}>
          <DiaryCard link="Ansehen & sichern ›" onClick={() => open({ kind: 'pdf' })} />
        </div>

        {ex.title && (
          <section className="card card--tint" style={{ marginTop: 24 }} aria-label="Was bedeutet das?">
            <p className="t-overline c-2">Was bedeutet das?</p>
            <h3 className="t-h2" style={{ fontSize: 20, lineHeight: '26px', margin: '6px 0 10px' }}>{ex.title}</h3>
            <p className="t-body">{ex.text}</p>
            <p className="t-caption c-2" style={{ marginTop: 12 }}>Quelle: [Fachgesellschaft – Platzhalter] · geprüft 09/2026</p>
            <button className="link link--underline" style={{ marginTop: 10, minHeight: 32 }} onClick={() => info('Hier würde sich der Artikel bzw. weitere Tipps öffnen – mit Quelle und Prüfdatum.')}>
              Mehr erfahren ›
            </button>
          </section>
        )}

        {filter === 'Schlafprobleme' && (
          <section className="card" style={{ marginTop: 24 }} aria-label="Was dir helfen kann">
            <p className="t-overline c-2">Was dir helfen kann</p>
            <h3 className="t-h2" style={{ fontSize: 20, margin: '6px 0 12px' }}>Besser schlafen</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
              {SLEEP_TIPS.map((t) => (
                <li key={t} style={{ display: 'flex', gap: 10 }}>
                  <Icon name="check" size={20} color="var(--primary)" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <p className="t-caption c-2" style={{ marginTop: 12 }}>Wenn dich der Schlafmangel im Alltag stark belastet, sprich mit einer Fachpraxis. Es gibt wirksame Behandlungen.</p>
          </section>
        )}

        {filter === 'Alle' && (
          <section className="card" style={{ marginTop: 24 }} aria-label="Was du am häufigsten bemerkt hast">
            <h3 className="t-h2" style={{ fontSize: 20, lineHeight: '26px', marginBottom: 16 }}>Was du am häufigsten bemerkt hast</h3>
            {bars.map((b) => (
              <div key={b.s} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }} className="t-caption">
                  <span>{b.s}</span>
                  <b>{b.n}×</b>
                </div>
                <div className="bar"><span style={{ width: `${(b.n / 12) * 100}%` }} /></div>
              </div>
            ))}
          </section>
        )}

        <div className="hint" style={{ marginTop: 24 }}>
          <Icon name="info" size={20} />
          <span>Diese Kombination ist in der Perimenopause häufig. Das ist <b>keine Diagnose</b>. Eine Fachpraxis für Perimenopause kann das mit dir einordnen.</span>
        </div>
        </div>
        <div style={{ height: 200 }} />
      </main>

      <div className="fixed-cta" style={{ bottom: 100 }}>
        <button className="btn btn--primary" onClick={() => navigate('/fachpraxen')}>
          Passende Fachpraxis finden <Icon name="arrowRight" size={20} />
        </button>
      </div>
      <TabBar />
    </>
  );
}
