import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Visão geral', end: true, icon: 'grid' },
  { to: '/certificados', label: 'Certificados', icon: 'certificate' },
  { to: '/usuarios', label: 'Usuários', icon: 'users' },
]

const linkClass = ({ isActive }) =>
  `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
    isActive
      ? 'bg-elevated text-fg shadow-sm'
      : 'text-muted hover:bg-elevated/60 hover:text-fg'
  }`

function Icon({ name }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    certificate: <><path d="M12 3 5 6v5c0 4.2 2.9 7.7 7 9 4.1-1.3 7-4.8 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c.5-3.1 2.5-5 6-5s5.5 1.9 6 5" /><path d="M16 5.2a3 3 0 0 1 0 5.6M18 15c1.7.8 2.7 2.1 3 4" /></>,
  }
  return <svg aria-hidden="true" className="h-[18px] w-[18px] shrink-0" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">{paths[name]}</svg>
}

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-line bg-surface px-4 py-4 md:flex md:w-64 md:shrink-0 md:flex-col md:border-b-0 md:border-r md:px-5 md:py-6">
        <div className="mb-6 flex items-center gap-3 px-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-sm font-bold text-bg shadow-lg shadow-accent/15">C</div>
          <div>
            <h1 className="text-[15px] font-semibold tracking-tight">Cert<span className="text-accent">Manager</span></h1>
            <p className="mt-0.5 text-[11px] text-muted">Gestão de certificados</p>
          </div>
        </div>
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted/70">Workspace</p>
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {links.map(({ to, label, end, icon }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon name={icon} />
              <span className="whitespace-nowrap">{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto hidden rounded-xl border border-line bg-bg/50 p-3 md:block">
          <p className="text-xs font-medium text-fg">Controle simples.</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">Acompanhe seus certificados e nunca perca um vencimento.</p>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 md:px-10 md:py-8">
        <Outlet />
      </main>
    </div>
  )
}
