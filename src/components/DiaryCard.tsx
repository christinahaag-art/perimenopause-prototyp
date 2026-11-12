import { DiaryThumb } from './Diary';

/** Symptomtagebuch-Karte (hell), Figma-Komponente „Symptomtagebuch-Karte“. */
export default function DiaryCard({ link, title = 'Symptomtagebuch', sub = 'PDF für deinen Arzttermin · A4 · letzte 30 Tage', onClick }: { link: string; title?: string; sub?: string; onClick: () => void }) {
  return (
    <button className="diary-card" onClick={onClick}>
      <DiaryThumb width={120} />
      <span>
        <span className="t-strong" style={{ display: 'block', fontSize: 17 }}>{title}</span>
        <span className="t-caption c-2" style={{ display: 'block' }}>{sub}</span>
        <span className="link">{link}</span>
      </span>
    </button>
  );
}
