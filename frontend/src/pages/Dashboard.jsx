import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge'
import { certificateService } from '../services/certificateService'
import { deadlineLabel } from '../utils/deadline'
import { formatDate } from '../utils/format'
import { CERTIFICATE_STATUS } from '../utils/status'

const statOrder = ['ACTIVE', 'TO_RENEW', 'RENEWING', 'EXPIRED']

export default function Dashboard() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    certificateService.list().then(setCertificates).catch(() => setError('Não foi possível carregar o resumo.')).finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => statOrder.map((status) => ({
    status,
    count: certificates.filter((certificate) => certificate.status === status).length,
  })), [certificates])

  const upcoming = useMemo(() => [...certificates].sort((a, b) => (a.validUntil ?? '').localeCompare(b.validUntil ?? '')).slice(0, 5), [certificates])

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">Visão geral</p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Bom trabalho, vamos acompanhar tudo.</h2>
          <p className="mt-2 max-w-xl text-sm text-muted">Um resumo rápido da situação dos seus certificados.</p>
        </div>
        <Link to="/certificados/novo" className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg shadow-lg shadow-accent/10 transition hover:bg-accent-soft">Novo certificado</Link>
      </div>

      {error ? <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div> : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ status, count }) => (
          <div key={status} className="rounded-xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted">{CERTIFICATE_STATUS[status].label}</span>
              <StatusBadge status={status} />
            </div>
            <p className="mt-5 text-3xl font-semibold tracking-tight">{loading ? '—' : count}</p>
            <p className="mt-1 text-xs text-muted">certificado{count === 1 ? '' : 's'}</p>
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-line bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div><h3 className="font-semibold">Próximos vencimentos</h3><p className="mt-1 text-xs text-muted">Certificados ordenados pela data de vencimento.</p></div>
          <Link to="/certificados" className="text-sm font-medium text-accent hover:text-accent-soft">Ver todos</Link>
        </div>
        {loading ? <p className="px-5 py-8 text-sm text-muted">Carregando certificados…</p> : upcoming.length === 0 ? <p className="px-5 py-8 text-sm text-muted">Nenhum certificado cadastrado ainda.</p> : (
          <div className="divide-y divide-line">
            {upcoming.map((certificate) => (
              <Link key={certificate.id} to={`/certificados/${certificate.id}`} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition hover:bg-elevated/40">
                <div className="min-w-0"><p className="truncate text-sm font-medium">{certificate.companyName}</p><p className="mt-1 text-xs text-muted">{formatDate(certificate.validUntil)} · {deadlineLabel(certificate.validUntil)}</p></div>
                <StatusBadge status={certificate.status} />
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
