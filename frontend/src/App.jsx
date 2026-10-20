import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import CertificateForm from './pages/CertificateForm'
import CertificateList from './pages/CertificateList'

function Placeholder({ title }) {
  return <h2 className="text-xl font-semibold">{title}</h2>
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Placeholder title="Dashboard" />} />
        <Route path="/certificados" element={<CertificateList />} />
        <Route path="/certificados/novo" element={<CertificateForm key="new" />} />
        <Route path="/certificados/:id/editar" element={<CertificateForm key="edit" />} />
        <Route path="/usuarios" element={<Placeholder title="Usuários" />} />
      </Route>
    </Routes>
  )
}
