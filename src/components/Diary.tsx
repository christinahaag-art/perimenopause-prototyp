import { DAYS, fmtDate, LAST_PERIOD, SEV_LABEL, SYMPTOMS, WEEKDAYS_LONG, countSymptom } from '../data';

const SHORT: Record<string, string> = {
  Hitzewallungen: 'Hitze-\nwallungen',
  Schlafprobleme: 'Schlaf-\nprobleme',
  Stimmungsschwankungen: 'Stimmungs-\nschwankungen',
  Erschöpfung: 'Erschöp-\nfung',
  Herzklopfen: 'Herz-\nklopfen',
  Gelenkschmerzen: 'Gelenk-\nschmerzen',
  Konzentrationsprobleme: 'Konzentrations-\nprobleme',
};
const ORDER = ['Hitzewallungen', 'Schlafprobleme', 'Erschöpfung', 'Stimmungsschwankungen', 'Herzklopfen', 'Gelenkschmerzen', 'Konzentrationsprobleme'] as const;

/** Symptom- und Zyklustagebuch als A4-Seite (842 × 595), wie in Figma „10 Symptomtagebuch · A4 (PDF)“. */
export function DiaryPage() {
  const cycleDay = (x: Date) => {
    const diff = Math.round((x.getTime() - LAST_PERIOD.getTime()) / 86400000);
    return diff >= 0 ? diff + 1 : '';
  };
  return (
    <div className="diary" role="img" aria-label="Symptom- und Zyklustagebuch, 06.09. bis 05.10.2026">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <div style={{ color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.08em', fontSize: 7 }}>PERINO · SYMPTOMTAGEBUCH</div>
          <div style={{ fontSize: 15, lineHeight: '20px', fontWeight: 700 }}>Symptom- und Zyklustagebuch</div>
          <div style={{ color: 'var(--text-2)' }}>Zeitraum: 06.09.2026 – 05.10.2026 (30 Tage) · automatisch aus deinen Einträgen erstellt</div>
        </div>
        <div style={{ width: 170, color: 'var(--text-2)', lineHeight: '14px' }}>
          <div>Name: ____________________</div>
          <div>Geburtsdatum: ______________</div>
          <div>Termin am / bei: ____________</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, background: 'var(--tint)', borderRadius: 4, padding: '5px 8px', marginBottom: 6 }}>
        <div><b style={{ color: 'var(--primary)' }}>ÜBERBLICK</b><br />Beschwerden an 12 von 30 Tagen, meist mittel bis stark</div>
        <div><b style={{ color: 'var(--primary)' }}>AM HÄUFIGSTEN</b><br />Schlafprobleme 9× · Hitzewallungen 7× · Erschöpfung 5×</div>
        <div><b style={{ color: 'var(--primary)' }}>PERIODE</b><br />Letzte Periode begonnen: 14.09.2026 (3 Tage)</div>
      </div>
      <table>
        <colgroup>
          <col style={{ width: 22 }} /><col style={{ width: 34 }} /><col style={{ width: 30 }} /><col style={{ width: 30 }} />
          {ORDER.map((s) => <col key={s} />)}
          <col style={{ width: 34 }} /><col style={{ width: 150 }} />
        </colgroup>
        <thead>
          <tr>
            <th className="l" colSpan={2}>Datum</th><th>Zyklus-<br />tag</th><th>Periode</th>
            {ORDER.map((s) => (
              <th key={s} style={{ whiteSpace: 'pre-line' }}>{SHORT[s]}<br /><span style={{ color: 'var(--text)' }}>{countSymptom(s)}×</span></th>
            ))}
            <th>Andere<br /><span style={{ color: 'var(--text)' }}>0×</span></th>
            <th className="l">Notizen</th>
          </tr>
        </thead>
        <tbody>
          {DAYS.map((day) => (
            <tr key={day.date.toISOString()} className={day.date.getDay() === 1 ? 'week' : undefined}>
              <td className="l">{WEEKDAYS_LONG[day.date.getDay()]}</td>
              <td className="l">{fmtDate(day.date)}</td>
              <td>{cycleDay(day.date)}</td>
              <td>{day.period ? <span className="per" /> : ''}</td>
              {ORDER.map((s) => {
                const v = day.symptoms[s];
                return <td key={s}>{v ? <span className={`sev sev--${v}`}>{SEV_LABEL[v]}</span> : ''}</td>;
              })}
              <td />
              <td className="l" style={{ color: 'var(--text-2)' }}>{day.note ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', gap: 12, marginTop: 6, color: 'var(--text-2)', alignItems: 'center' }}>
        <b style={{ color: 'var(--text)' }}>Stärke:</b>
        <span><span className="sev-key sev--L" />leicht – kaum spürbar, Alltag wie gewohnt</span>
        <span><span className="sev-key sev--M" />mittel – deutlich spürbar, aber machbar</span>
        <span><span className="sev-key sev--S" />stark – schränkt im Alltag ein</span>
        <span><span className="per" /> Periode · Zyklustag 1 = erster Tag der Periode</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, color: 'var(--text-2)' }}>
        <span>Selbst erfasste Angaben aus der App Perino. Das ist keine Diagnose, sondern eine Grundlage für das Gespräch mit deiner Ärztin oder deinem Arzt.</span>
        <span>Erstellt am 05.10.2026 · Seite 1 von 1</span>
      </div>
    </div>
  );
}

/** Verkleinerte Vorschau der A4-Seite */
export function DiaryThumb({ width }: { width: number }) {
  const scale = width / 842;
  return (
    <div className="diary-thumb" style={{ width, height: Math.round(595 * scale) }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left' }}>
        <DiaryPage />
      </div>
    </div>
  );
}

export { SYMPTOMS };
