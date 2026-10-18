import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'

// Provisório: cada página real substitui um destes nas próximas etapas.
function Placeholder({ title }) {
  return <h2 className="text-xl font-semibold">{title}</h2>
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Placeholder title="Dashboard" />} />
        <Route path="/certificados" element={<Placeholder title="Certificados" />} />
        <Route path="/certificados/novo" element={<Placeholder title="Novo certificado" />} />
        <Route path="/certificados/:id/editar" element={<Placeholder title="Editar certificado" />} />
        <Route path="/usuarios" element={<Placeholder title="Usuários" />} />
      </Route>
    </Routes>
  )
}
