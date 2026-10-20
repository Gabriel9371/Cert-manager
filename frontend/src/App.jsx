import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import CertificateDetail from './pages/CertificateDetail'
import CertificateForm from './pages/CertificateForm'
import CertificateList from './pages/CertificateList'

// Provisório: cada página real substitui um destes nas próximas etapas.
function Placeholder({ title }) {
  return <h2 className="text-xl font-semibold">{title}</h2>
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Placeholder title="Dashboard" />} />
        <Route path="/certificados" element={<CertificateList />} />
        {/* O React Router dá prioridade a segmentos fixos: "novo" vence ":id". */}
        <Route path="/certificados/novo" element={<CertificateForm key="new" />} />
        <Route path="/certificados/:id" element={<CertificateDetail />} />
        {/* "key" força o React a desmontar/montar o formulário ao trocar de rota,
            em vez de reaproveitar o estado de "novo" na tela de "editar". */}
        <Route path="/certificados/:id/editar" element={<CertificateForm key="edit" />} />
        <Route path="/usuarios" element={<Placeholder title="Usuários" />} />
      </Route>
    </Routes>
  )
}
