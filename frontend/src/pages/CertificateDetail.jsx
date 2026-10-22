import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Field from '../components/Field'
import StatusBadge from '../components/StatusBadge'
import { certificateService } from '../services/certificateService'
import { userService } from '../services/userService'
import { readSavedUser, saveUser } from '../utils/currentUser'
import { addYearsISO, todayISO } from '../utils/dates'
import { deadlineLabel } from '../utils/deadline'
import { extractError } from '../utils/errors'
import {
  formatCnpj,
  formatCurrency,
  formatDate,
  formatPhone,
} from '../utils/format'

const inputClass = (hasError) =>
  `w-full rounded-md border bg-surface px-3 py-2 text-sm text-fg focus:outline-none ${
    hasError
      ? 'border-danger focus:border-danger'
      : 'border-line focus:border-accent'
  }`

const secondaryButton =
  'rounded-lg border border-line px-4 py-2.5 text-sm transition-colors hover:bg-elevated disabled:opacity-50'
const primaryButton =
  'rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg transition-opacity hover:bg-accent-soft disabled:opacity-50'

// O backend manda LocalDateTime com nanossegundos (9 dígitos). Cortamos nos
// segundos para o Date interpretar com segurança em qualquer navegador.
function formatDateTime(value) {
  if (!value) return '—'
  return new Date(value.slice(0, 19)).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })
}

function Card({ title, children }) {
  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        {title}
      </h3>
      <dl className="space-y-2 text-sm">{children}</dl>
    </section>
  )
}

function Item({ label, children }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right">{children}</dd>
    </div>
  )
}

export default function CertificateDetail() {
  const { id } = useParams()

  const [certificate, setCertificate] = useState(null)
  const [users, setUsers] = useState([])
  const [actorId, setActorId] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState(null)
  const [actionError, setActionError] = useState(null)

  const [showRenew, setShowRenew] = useState(false)
  const [renewValues, setRenewValues] = useState(null)
  const [renewErrors, setRenewErrors] = useState({})

  // O "ignore" descarta respostas de uma requisição que já ficou para trás.
  useEffect(() => {
    let ignore = false

    Promise.all([certificateService.getById(id), userService.list()])
      .then(([cert, userList]) => {
        if (ignore) return
        setCertificate(cert)
        setUsers(userList)

        const preferred =
          userList.find((user) => String(user.id) === readSavedUser()) ??
          userList[0]
        if (preferred) setActorId(String(preferred.id))
      })
      .catch((err) => {
        if (!ignore) setLoadError(extractError(err).message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [id])

  async function changeStatus(status) {
    if (!actorId) {
      setActionError('Selecione quem está fazendo a ação.')
      return
    }

    setBusy(true)
    setActionError(null)
    setNotice(null)

    try {
      const updated = await certificateService.updateStatus(id, {
        status,
        changedByUserId: Number(actorId),
      })
      saveUser(actorId)
      setCertificate(updated)
      setNotice(
        status === 'RENEWING' ? 'Renovação iniciada.' : 'Renovação cancelada.',
      )
    } catch (err) {
      setActionError(extractError(err).message)
    } finally {
      setBusy(false)
    }
  }

  function openRenew() {
    const today = todayISO()
    setRenewValues({
      validFrom: today,
      validUntil: addYearsISO(today, 1),
      renewalValue:
        certificate.renewalValue === null || certificate.renewalValue === undefined
          ? ''
          : String(certificate.renewalValue),
    })
    setRenewErrors({})
    setActionError(null)
    setShowRenew(true)
  }

  function setRenewField(name, value) {
    setRenewValues((prev) => ({ ...prev, [name]: value }))
    setRenewErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
  }

  async function handleRenew(event) {
    event.preventDefault()

    const found = {}
    if (!renewValues.validFrom) found.validFrom = 'Informe a data de início.'
    if (!renewValues.validUntil) found.validUntil = 'Informe o novo vencimento.'
    else if (
      renewValues.validFrom &&
      renewValues.validUntil <= renewValues.validFrom
    )
      found.validUntil = 'O vencimento deve ser posterior ao início.'
    if (
      renewValues.renewalValue !== '' &&
      !(Number(renewValues.renewalValue) >= 0)
    )
      found.renewalValue = 'Informe um valor válido (zero ou maior).'
    if (!actorId) found.actor = 'Selecione quem está renovando.'

    setRenewErrors(found)
    if (Object.keys(found).length > 0) return

    setBusy(true)
    setActionError(null)
    setNotice(null)

    try {
      const updated = await certificateService.renew(id, {
        validFrom: renewValues.validFrom,
        validUntil: renewValues.validUntil,
        renewalValue:
          renewValues.renewalValue === '' ? null : Number(renewValues.renewalValue),
        renewedByUserId: Number(actorId),
      })
      saveUser(actorId)
      setCertificate(updated)
      setShowRenew(false)
      setNotice(`Certificado renovado. Novo vencimento: ${formatDate(updated.validUntil)}.`)
    } catch (err) {
      const { message, fields } = extractError(err)
      setActionError(message)
      if (fields) setRenewErrors(fields)
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">Carregando…</p>
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-4xl rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm">
        <p className="text-danger">{loadError}</p>
        <Link
          to="/certificados"
          className="mt-3 inline-block text-accent hover:underline"
        >
          Voltar para a lista
        </Link>
      </div>
    )
  }

  const isRenewing = certificate.status === 'RENEWING'

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/certificados" className="text-sm text-muted hover:text-fg">
            ← Certificados
          </Link>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            {certificate.companyName}
          </h2>
          <p className="mt-1 font-mono text-xs text-muted">
            {formatCnpj(certificate.cnpj)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={certificate.status} />
          <Link to={`/certificados/${id}/editar`} className={secondaryButton}>
            Editar
          </Link>
        </div>
      </div>

      {notice && (
        <div className="mb-4 rounded-md border border-ok/30 bg-ok/10 px-4 py-3 text-sm text-ok">
          {notice}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Validade">
          <Item label="Início">{formatDate(certificate.validFrom)}</Item>
          <Item label="Vencimento">{formatDate(certificate.validUntil)}</Item>
          <Item label="Situação">{deadlineLabel(certificate.validUntil)}</Item>
        </Card>

        <Card title="Contato">
          <Item label="Nome">{certificate.contactName}</Item>
          <Item label="Telefone">{formatPhone(certificate.contactPhone)}</Item>
        </Card>

        <Card title="Emissão">
          <Item label="Emissor">{certificate.issuer}</Item>
          <Item label="Emitido por nós">
            {certificate.issuedByUs ? 'Sim' : 'Não'}
          </Item>
          <Item label="Valor da renovação">
            {formatCurrency(certificate.renewalValue)}
          </Item>
        </Card>

        <Card title="Registro">
          <Item label="Cadastrado por">{certificate.createdBy?.name ?? '—'}</Item>
          <Item label="Cadastrado em">{formatDateTime(certificate.createdAt)}</Item>
          <Item label="Renovado por">{certificate.renewedBy?.name ?? '—'}</Item>
          <Item label="Última alteração">{formatDateTime(certificate.updatedAt)}</Item>
        </Card>
      </div>

      <section className="mt-5 rounded-xl border border-line bg-surface p-5">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          Renovação
        </h3>

        {users.length === 0 ? (
          <p className="text-sm text-muted">
            Cadastre um usuário para registrar ações de renovação.
          </p>
        ) : (
          <div className="mb-4 max-w-xs">
            <Field label="Ação feita por" htmlFor="actor" error={renewErrors.actor}>
              <select
                id="actor"
                value={actorId}
                onChange={(event) => setActorId(event.target.value)}
                className={inputClass(renewErrors.actor)}
              >
                <option value="">Selecione…</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        )}

        {actionError && (
          <div className="mb-4 rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
            {actionError}
          </div>
        )}

        {!showRenew && (
          <div className="flex flex-wrap gap-2">
            {isRenewing ? (
              <button
                type="button"
                onClick={() => changeStatus('ACTIVE')}
                disabled={busy || !actorId}
                className={secondaryButton}
              >
                Cancelar renovação
              </button>
            ) : (
              <button
                type="button"
                onClick={() => changeStatus('RENEWING')}
                disabled={busy || !actorId}
                className={secondaryButton}
              >
                Iniciar renovação
              </button>
            )}
            <button
              type="button"
              onClick={openRenew}
              disabled={busy || !actorId}
              className={primaryButton}
            >
              Registrar renovação
            </button>
          </div>
        )}

        {!showRenew && (
          <p className="mt-3 text-xs text-muted">
            “Iniciar renovação” marca o certificado como em renovação e o sistema
            não altera esse status sozinho. “Registrar renovação” grava as novas
            datas e devolve o certificado ao cálculo automático pela data.
          </p>
        )}

        {showRenew && renewValues && (
          <form onSubmit={handleRenew} noValidate>
            <div className="grid gap-4 md:grid-cols-3">
              <Field
                label="Novo início"
                htmlFor="renewFrom"
                error={renewErrors.validFrom}
              >
                <input
                  id="renewFrom"
                  type="date"
                  value={renewValues.validFrom}
                  onChange={(e) => setRenewField('validFrom', e.target.value)}
                  className={inputClass(renewErrors.validFrom)}
                />
              </Field>

              <Field
                label="Novo vencimento"
                htmlFor="renewUntil"
                error={renewErrors.validUntil}
              >
                <input
                  id="renewUntil"
                  type="date"
                  value={renewValues.validUntil}
                  onChange={(e) => setRenewField('validUntil', e.target.value)}
                  className={inputClass(renewErrors.validUntil)}
                />
              </Field>

              <Field
                label="Valor (opcional)"
                htmlFor="renewValue"
                error={renewErrors.renewalValue}
                hint="Em reais."
              >
                <input
                  id="renewValue"
                  type="number"
                  min="0"
                  step="0.01"
                  inputMode="decimal"
                  value={renewValues.renewalValue}
                  onChange={(e) => setRenewField('renewalValue', e.target.value)}
                  className={inputClass(renewErrors.renewalValue)}
                />
              </Field>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowRenew(false)}
                disabled={busy}
                className={secondaryButton}
              >
                Cancelar
              </button>
              <button type="submit" disabled={busy} className={primaryButton}>
                {busy ? 'Salvando…' : 'Confirmar renovação'}
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  )
}
