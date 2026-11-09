import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import Photo from '../components/Photo';
import TabBar from '../components/TabBar';
import { MATCHING, Practice, PRACTICES } from '../data';
import { useApp } from '../state/AppState';

export function FocusChips({ focus }: { focus: string[] }) {
  return (
    <div className="chip-row" style={{ gap: 6 }}>
      {focus.map((f) => {
        const match = MATCHING.includes(f);
        return (
          <span key={f} className={`chip chip--sm${match ? ' chip--selected' : ''}`} style={match ? { fontWeight: 600 } : { boxShadow: 'inset 0 0 0 1px var(--border-input)' }}>
            {match && <Icon name="check" size={13} stroke={2.4} />}
            {f}
          </span>
        );
      })}
    </div>
  );
}

function PracticeCard({ p, recommended }: { p: Practice; recommended: boolean }) {
  const navigate = useNavigate();
  return (
    <button
      className={`card${recommended ? ' card--highlight' : ''}`}
      onClick={() => navigate(`/fachpraxis/${p.id}`)}
      style={{ width: '100%', padding: 16, display: 'block' }}
      aria-label={`${p.name}, ${p.role}, ${p.distance}${recommended ? ', passt zu deinem Muster' : ''}`}
    >
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <Photo src={p.photo} initials={p.initials} size={56} />
        <div style={{ flex: 1 }}>
          {recommended && (
            <span className="t-overline" style={{ display: 'inline-block', background: 'var(--primary)', color: '#fff', borderRadius: 999, padding: '2px 8px', fontSize: 10, marginBottom: 2 }}>
              Passt zu deinem Muster
            </span>
          )}
          <p className="t-h3" style={{ fontWeight: 700 }}>{p.name}</p>
          <p className="t-caption c-2">{p.role} · {p.distance}</p>
        </div>
        <Icon name="chevronRight" size={20} />
      </div>
      <p className="t-caption" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <Icon name="pin" size={20} /> {p.address}
      </p>
      <p className="t-caption c-2" style={{ margin: '4px 0 8px' }}>{p.insurance}</p>
      <FocusChips focus={p.focus} />
      <p className="t-caption c-2" style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8, fontSize: 13 }}>
        <Icon name="check" size={16} color="var(--primary)" /> Fortbildung geprüft
      </p>
    </button>
  );
}

export default function Practices() {
  const { info } = useApp();
  const [ins, setIns] = useState<'Gesetzlich' | 'Privat / Selbstzahler' | null>(null);
  const list = PRACTICES.filter((p) => (ins === 'Gesetzlich' ? p.insuranceKind === 'beide' : true));

  return (
    <>
      <main className="screen screen--padded anim-fade" aria-labelledby="pr-title">
        <h1 id="pr-title" className="t-h2" style={{ marginTop: 64 }}>Fachpraxen für Perimenopause</h1>
        <div className="chip-row" style={{ margin: '16px 0' }} role="radiogroup" aria-label="Versicherung">
          {(['Gesetzlich', 'Privat / Selbstzahler'] as const).map((c) => (
            <button key={c} role="radio" aria-checked={ins === c} className={`chip${ins === c ? ' chip--selected' : ''}`} onClick={() => setIns(ins === c ? null : c)}>
              {ins === c && <Icon name="check" size={16} stroke={2.2} />}
              {c}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="pin" size={20} />
          <span className="t-strong" style={{ flex: 1, fontWeight: 700 }}>10437 Berlin</span>
          <button className="t-caption" style={{ fontWeight: 700, minHeight: 44 }} onClick={() => info('Hier änderst du deinen Standort oder die Postleitzahl.')}>Ändern</button>
        </div>
        <p className="t-caption c-2" style={{ margin: '6px 0 14px' }}>{list.length} Fachpraxen · passend zu deinem Muster sortiert</p>

        <div className="stack" style={{ gap: 12 }}>
          {list.map((p, i) => (
            <PracticeCard key={p.id} p={p} recommended={i === 0 && p.id === 'berger'} />
          ))}
        </div>

        <button className="t-caption" style={{ display: 'block', margin: '20px auto', fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 3 }} onClick={() => info('Hier würde der Suchradius erweitert, zum Beispiel auf 10 km.')}>
          Keine passende dabei? Umkreis erweitern
        </button>

        <section className="card" aria-label="Passend zu deinem Muster">
          <p className="t-overline c-primary">Passend zu deinem Muster</p>
          <p className="t-body" style={{ margin: '6px 0 14px' }}>
            Deine häufigsten Symptome: <b>Schlafprobleme, Hitzewallungen</b>. Alle Praxen hier sind zur Perimenopause fortgebildet und kennen diese Beschwerden.
          </p>
          <div style={{ display: 'flex', gap: 12, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
            <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--tint)', display: 'grid', placeItems: 'center', flex: 'none' }}>
              <Icon name="upload" size={18} color="var(--primary)" />
            </span>
            <div>
              <p className="t-strong" style={{ fontWeight: 700 }}>Dein Symptomtagebuch geht mit ins Gespräch</p>
              <p className="t-caption c-2">Im Profil jeder Praxis kannst du es als Übersicht öffnen, teilen oder als PDF speichern.</p>
            </div>
          </div>
        </section>

        <div className="hint" style={{ marginTop: 16, flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <Icon name="shield" size={20} />
            <span>Die <b>Fortbildung zur Perimenopause</b> ist bei allen Praxen nachgewiesen. Den Termin vereinbarst du direkt mit der Praxis.</span>
          </div>
          <button className="link link--underline" style={{ color: 'var(--text)', marginLeft: 32 }} onClick={() => info('Wir prüfen bei jeder Praxis den Nachweis einer Fortbildung zur Perimenopause und wiederholen die Prüfung regelmäßig.', 'So prüfen wir')}>
            So prüfen wir
          </button>
        </div>
        <div className="tab-space" />
      </main>
      <TabBar />
    </>
  );
}
