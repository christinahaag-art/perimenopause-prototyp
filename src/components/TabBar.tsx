import { useLocation, useNavigate } from 'react-router-dom';
import Icon, { IconName } from './Icon';
import { useApp } from '../state/AppState';

const TABS: { label: string; icon: IconName; path: string; match: (p: string) => boolean }[] = [
  { label: 'Start', icon: 'home', path: '/start', match: (p) => p === '/start' },
  { label: 'Eintragen', icon: 'plusCircle', path: '/eintragen', match: (p) => p === '/eintragen' || p === '/gespeichert' },
  { label: 'Muster', icon: 'chart', path: '/muster', match: (p) => p.startsWith('/muster') },
  { label: 'Fachpraxen', icon: 'stethoscope', path: '/fachpraxen', match: (p) => p.startsWith('/fachpraxen') || p.startsWith('/fachpraxis') },
];

export default function TabBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { resetDraft } = useApp();
  return (
    <>
      <div className="tabbar-fade" />
      <nav className="tabbar" aria-label="Hauptnavigation">
        {TABS.map((t) => {
          const active = t.match(pathname);
          return (
            <button
              key={t.label}
              className={`tab${active ? ' tab--active' : ''}`}
              aria-current={active ? 'page' : undefined}
              onClick={() => {
                if (t.path === '/eintragen') resetDraft();
                navigate(t.path);
              }}
            >
              <Icon name={t.icon} />
              {t.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
