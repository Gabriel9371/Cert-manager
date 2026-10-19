import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/certificados', label: 'Certificados' },
  { to: '/usuarios', label: 'Usuários' },
]

// NavLink passa { isActive } para a função de className.
const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm transition-colors ${
    isActive
      ? 'bg-elevated text-fg'
      : 'text-muted hover:bg-elevated/60 hover:text-fg'
  }`

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-line bg-surface p-4 md:w-56 md:shrink-0 md:border-b-0 md:border-r">
        <h1 className="mb-4 text-base font-semibold tracking-tight">
          Cert<span className="text-accent">Manager</span>
        </h1>
        <nav className="flex gap-1 md:flex-col">
          {links.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Outlet é onde a rota filha (a página) é renderizada */}
      <main className="flex-1 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}
