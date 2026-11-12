import { useState } from 'react';

export type Illustration = 'start' | 'muster' | 'fachpraxen';

/** Kopfbereich mit Illustration (Figma-Komponente „Kopfbereich · Illustration“, kompakt 224 hoch). */
export default function Kopf({ overline, title, illustration, profile }: { overline: string; title: string; illustration: Illustration; profile?: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <header className="kopf">
      {profile && (
        <span className="kopf__profile" aria-label="Profil">
          S
        </span>
      )}
      <div className="kopf__text">
        <p className="t-body-l">{overline}</p>
        <h1 className="t-h2">{title}</h1>
      </div>
      {!failed && (
        <div className={`kopf__ill kopf__ill--${illustration}`} aria-hidden="true">
          <img src={`/img/illu-${illustration}.png`} alt="" onError={() => setFailed(true)} />
          <span className="kopf__hue" />
        </div>
      )}
      <div className="kopf__edge" />
    </header>
  );
}
