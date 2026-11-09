import { useState } from 'react';

/** Foto mit Ersatz: Fehlt die Bilddatei in /public/img, erscheinen Initialen. */
export default function Photo({ src, initials, size, ring = false }: { src: string; initials: string; size: number; ring?: boolean }) {
  const [failed, setFailed] = useState(false);
  const style = {
    width: size,
    height: size,
    borderRadius: '50%',
    flex: 'none' as const,
    boxShadow: ring ? '0 0 0 4px #fff' : undefined,
  };
  if (failed) {
    return (
      <div aria-hidden="true" style={{ ...style, display: 'grid', placeItems: 'center', background: 'var(--secondary-light)', color: 'var(--primary)', fontWeight: 700, fontSize: size * 0.32 }}>
        {initials}
      </div>
    );
  }
  return <img src={src} alt="" width={size} height={size} onError={() => setFailed(true)} style={{ ...style, objectFit: 'cover' }} />;
}
