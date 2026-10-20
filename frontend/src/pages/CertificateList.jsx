import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import StatusBadge from '../components/StatusBadge'
import { certificateService } from '../services/certificateService'
import { normalizeCnpj } from '../utils/cnpj'
import { deadlineLabel } from '../utils/deadline'
import { formatCnpj, formatDate, formatPhone } from '../utils/format'
import { CERTIFICATE_STATUS } from '../utils/status'

const controlClass =
  'rounded-md border border-line bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:border-accent focus:outline-none'

// Datas no formato ISO (2026-10-18) ordenam corretamente como texto,
// então localeCompare resolve sem precisar converter para Date.
const SORTERS = {
  'due-asc': (a, b) => (a.validUntil ?? '').localeCompare(b.validUntil ?? ''),
  'due-desc': (a, b) => (b.validUntil ?? '').localeCompare(a.validUntil ?? ''),
  name: (a, b) => a.companyName.localeCompare(b.companyName, 'pt-BR'),
}

// RENEWED não é mais atribuído pelo backend, então fica fora do filtro.
const FILTERABLE_STATUS = Object.entries(CERTIFICATE_STATUS).filter(
  ([key]) => key !== 'RENEWED',
)

export default function CertificateList() {
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('due-asc')

  const [toDelete, setToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [actionError, setActionError] = useState(null)

  // "ignore" evita atualizar o estado de uma resposta antiga: o StrictMode
  // executa o efeito duas vezes em desenvolvimento, e o usuário pode sair da
  // página antes da resposta chegar.
  useEffect(() => {
    let ignore = false

    certificateService
      .list()
      .then((data) => {
        if (!ignore) setCertificates(data)
      })
      .catch(() => {
        if (!ignore) setError('Não foi possível carregar os certificados.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [reloadKey])

  function retry() {
    setError(null)
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase()
    // Para casar CNPJ ignorando pontuação (e aceitando letras: CNPJ alfanumérico).
    const cnpjTerm = normalizeCnpj(search)

    return certificates
      .filter((c) => statusFilter === 'ALL' || c.status === statusFilter)
      .filter((c) => {
        if (!term) return true
        const byName = c.companyName.toLowerCase().includes(term)
        const byCnpj = cnpjTerm !== '' && normalizeCnpj(c.cnpj).includes(cnpjTerm)
        return byName || byCnpj
      })
      .sort(SORTERS[sortBy])
  }, [certificates, search, statusFilter, sortBy])

  async function handleDelete() {
    setDeleting(true)
    setActionError(null)

    try {
      await certificateService.remove(toDelete.id)
      setCertificates((prev) => prev.filter((c) => c.id !== toDelete.id))
    } catch {
      setActionError('Não foi possível excluir o certificado.')
    } finally {
      setDeleting(false)
      setToDelete(null)
    }
  }

  let content

  if (loading) {
    content = <p className="text-sm text-muted">Carregando certificados…</p>
  } else if (error) {
    content = (
      <div className="rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm">
        <p className="text-danger">{error}</p>
        <button
          type="button"
          onClick={retry}
          className="mt-3 rounded-md border border-line px-3 py-1.5 text-fg transition-colors hover:bg-elevated"
        >
          Tentar de novo
        </button>
      </div>
    )
  } else if (certificates.length === 0) {
    content = (
      <p className="text-sm text-muted">
        Nenhum certificado cadastrado ainda. Use “Novo certificado” para começar.
      </p>
    )
  } else if (visible.length === 0) {
    content = (
      <p className="text-sm text-muted">
        Nenhum certificado encontrado com esses filtros.
      </p>
    )
  } else {
    content = (
      <div className="overflow-x-auto rounded-lg border border-line">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Empresa</th>
              <th className="px-4 py-3 font-medium">CNPJ</th>
              <th className="px-4 py-3 font-medium">Vencimento</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {visible.map((c) => (
              <tr key={c.id} className="transition-colors hover:bg-surface/60">
                <td className="px-4 py-3">
                  <div className="font-medium">{c.companyName}</div>
                  <div className="text-xs text-muted">
                    {c.contactName} · {formatPhone(c.contactPhone)}
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted">
                  {formatCnpj(c.cnpj)}
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  <div>{formatDate(c.validUntil)}</div>
                  <div className="text-xs text-muted">
                    {deadlineLabel(c.validUntil)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={c.status} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-right">
                  <Link
                    to={`/certificados/${c.id}/editar`}
                    className="rounded-md px-2 py-1 text-accent transition-colors hover:bg-elevated"
                  >
                    Editar
                  </Link>
                  <button
                    type="button"
                    onClick={() => setToDelete(c)}
                    className="rounded-md px-2 py-1 text-danger transition-colors hover:bg-elevated"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Certificados</h2>
          <p className="text-sm text-muted">
            {loading ? 'Carregando…' : `${visible.length} de ${certificates.length}`}
          </p>
        </div>
        <Link
          to="/certificados/novo"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
        >
          Novo certificado
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar por empresa ou CNPJ"
          className={`${controlClass} min-w-56 flex-1`}
        />
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className={controlClass}
        >
          <option value="ALL">Todos os status</option>
          {FILTERABLE_STATUS.map(([key, { label }]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className={controlClass}
        >
          <option value="due-asc">Vencimento: mais próximos</option>
          <option value="due-desc">Vencimento: mais distantes</option>
          <option value="name">Empresa (A–Z)</option>
        </select>
      </div>

      {actionError && (
        <div className="mb-4 rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {actionError}
        </div>
      )}

      {content}

      {toDelete && (
        <ConfirmDialog
          title="Excluir certificado"
          message={`Excluir o certificado de ${toDelete.companyName}? Essa ação não pode ser desfeita.`}
          confirmLabel="Excluir"
          busyLabel="Excluindo…"
          busy={deleting}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  )
}
