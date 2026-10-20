import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Field from '../components/Field'
import StatusBadge from '../components/StatusBadge'
import { certificateService } from '../services/certificateService'
import { userService } from '../services/userService'
import { isValidCnpj, maskCnpj, normalizeCnpj } from '../utils/cnpj'
import { extractError } from '../utils/errors'
import { maskPhone } from '../utils/format'

const STORAGE_KEY = 'certmanager:userId'

const EMPTY = {
  companyName: '',
  cnpj: '',
  issuer: '',
  issuedByUs: false,
  validFrom: '',
  validUntil: '',
  contactName: '',
  contactPhone: '',
  renewalValue: '',
  createdByUserId: '',
}

const inputClass = (hasError) =>
  `w-full rounded-md border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted focus:outline-none ${
    hasError
      ? 'border-danger focus:border-danger'
      : 'border-line focus:border-accent'
  }`

// Lembra o último usuário escolhido (conveniência; se o storage falhar, segue sem).
function readSavedUser() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function saveUser(id) {
  try {
    localStorage.setItem(STORAGE_KEY, String(id))
  } catch {
    // sem problema: só perde a conveniência
  }
}

// Resposta do backend -> valores do formulário (tudo como string).
function toFormValues(certificate) {
  return {
    companyName: certificate.companyName ?? '',
    cnpj: maskCnpj(certificate.cnpj),
    issuer: certificate.issuer ?? '',
    issuedByUs: Boolean(certificate.issuedByUs),
    validFrom: certificate.validFrom ?? '',
    validUntil: certificate.validUntil ?? '',
    contactName: certificate.contactName ?? '',
    contactPhone: maskPhone(certificate.contactPhone),
    renewalValue:
      certificate.renewalValue === null || certificate.renewalValue === undefined
        ? ''
        : String(certificate.renewalValue),
    createdByUserId: '',
  }
}

// Valores do formulário -> corpo da requisição.
function toPayload(values) {
  return {
    companyName: values.companyName.trim(),
    cnpj: normalizeCnpj(values.cnpj),
    issuer: values.issuer.trim(),
    issuedByUs: values.issuedByUs,
    validFrom: values.validFrom,
    validUntil: values.validUntil,
    contactName: values.contactName.trim(),
    contactPhone: values.contactPhone.replace(/\D/g, ''),
    renewalValue: values.renewalValue === '' ? null : Number(values.renewalValue),
  }
}

function validate(values, isEdit) {
  const errors = {}

  if (!values.companyName.trim()) errors.companyName = 'Informe o nome da empresa.'

  if (!values.cnpj.trim()) errors.cnpj = 'Informe o CNPJ.'
  else if (!isValidCnpj(values.cnpj)) errors.cnpj = 'CNPJ inválido: confira os caracteres e os dígitos.'

  if (!values.issuer.trim()) errors.issuer = 'Informe quem emitiu o certificado.'

  if (!values.validFrom) errors.validFrom = 'Informe a data de início.'
  if (!values.validUntil) errors.validUntil = 'Informe a data de vencimento.'
  else if (values.validFrom && values.validUntil <= values.validFrom)
    errors.validUntil = 'O vencimento deve ser posterior ao início.'

  if (!values.contactName.trim()) errors.contactName = 'Informe o nome do contato.'

  const phoneDigits = values.contactPhone.replace(/\D/g, '')
  if (phoneDigits.length < 10 || phoneDigits.length > 11)
    errors.contactPhone = 'Telefone com DDD: 10 ou 11 dígitos.'

  if (values.renewalValue !== '' && !(Number(values.renewalValue) >= 0))
    errors.renewalValue = 'Informe um valor válido (zero ou maior).'

  if (!isEdit && !values.createdByUserId)
    errors.createdByUserId = 'Selecione quem está cadastrando.'

  return errors
}

export default function CertificateForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [values, setValues] = useState(EMPTY)
  const [users, setUsers] = useState([])
  const [meta, setMeta] = useState(null) // só na edição: status e criador
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState(null)
  const [saving, setSaving] = useState(false)

  // Na criação carrega os usuários (para o select); na edição, o certificado.
  // O "ignore" descarta respostas de uma requisição que já ficou para trás.
  useEffect(() => {
    let ignore = false
    const request = isEdit ? certificateService.getById(id) : userService.list()

    request
      .then((data) => {
        if (ignore) return

        if (isEdit) {
          setValues(toFormValues(data))
          setMeta({ status: data.status, createdBy: data.createdBy?.name })
        } else {
          setUsers(data)
          const preferred =
            data.find((user) => String(user.id) === readSavedUser()) ?? data[0]
          if (preferred) {
            setValues((prev) => ({
              ...prev,
              createdByUserId: String(preferred.id),
            }))
          }
        }
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
  }, [id, isEdit])

  function setField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }))
    // Ao editar um campo, some o erro dele.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const found = validate(values, isEdit)
    setErrors(found)
    if (Object.keys(found).length > 0) return

    setSaving(true)
    setSubmitError(null)

    try {
      const payload = toPayload(values)

      if (isEdit) {
        await certificateService.update(id, payload)
      } else {
        await certificateService.create({
          ...payload,
          createdByUserId: Number(values.createdByUserId),
        })
        saveUser(values.createdByUserId)
      }

      navigate('/certificados')
    } catch (err) {
      const { message, fields } = extractError(err)
      setSubmitError(message)
      if (fields) setErrors(fields)
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-muted">Carregando…</p>
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl rounded-lg border border-danger/30 bg-danger/10 p-4 text-sm">
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

  if (!isEdit && users.length === 0) {
    return (
      <div className="mx-auto max-w-3xl rounded-lg border border-line bg-surface p-4 text-sm">
        <p>Nenhum usuário cadastrado. Cadastre um usuário antes de criar certificados.</p>
        <Link to="/usuarios" className="mt-3 inline-block text-accent hover:underline">
          Ir para Usuários
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">
          {isEdit ? 'Editar certificado' : 'Novo certificado'}
        </h2>
        {isEdit && meta && (
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted">
            <StatusBadge status={meta.status} />
            <span>
              O status é calculado pela data de vencimento.
              {meta.createdBy ? ` Cadastrado por ${meta.createdBy}.` : ''}
            </span>
          </div>
        )}
      </div>

      {submitError && (
        <div className="mb-4 rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {submitError}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Empresa" htmlFor="companyName" error={errors.companyName}>
          <input
            id="companyName"
            type="text"
            value={values.companyName}
            onChange={(e) => setField('companyName', e.target.value)}
            className={inputClass(errors.companyName)}
          />
        </Field>

        <Field label="CNPJ" htmlFor="cnpj" error={errors.cnpj}>
          <input
            id="cnpj"
            type="text"
            value={values.cnpj}
            onChange={(e) => setField('cnpj', maskCnpj(e.target.value))}
            placeholder="00.000.000/0000-00"
            autoComplete="off"
            className={`${inputClass(errors.cnpj)} font-mono`}
          />
        </Field>

        <Field label="Emissor" htmlFor="issuer" error={errors.issuer}>
          <input
            id="issuer"
            type="text"
            value={values.issuer}
            onChange={(e) => setField('issuer', e.target.value)}
            className={inputClass(errors.issuer)}
          />
        </Field>

        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={values.issuedByUs}
              onChange={(e) => setField('issuedByUs', e.target.checked)}
              className="h-4 w-4 accent-accent"
            />
            Emitido por nós
          </label>
        </div>

        <Field label="Início da validade" htmlFor="validFrom" error={errors.validFrom}>
          <input
            id="validFrom"
            type="date"
            value={values.validFrom}
            onChange={(e) => setField('validFrom', e.target.value)}
            className={inputClass(errors.validFrom)}
          />
        </Field>

        <Field label="Vencimento" htmlFor="validUntil" error={errors.validUntil}>
          <input
            id="validUntil"
            type="date"
            value={values.validUntil}
            onChange={(e) => setField('validUntil', e.target.value)}
            className={inputClass(errors.validUntil)}
          />
        </Field>

        <Field label="Contato" htmlFor="contactName" error={errors.contactName}>
          <input
            id="contactName"
            type="text"
            value={values.contactName}
            onChange={(e) => setField('contactName', e.target.value)}
            className={inputClass(errors.contactName)}
          />
        </Field>

        <Field label="Telefone" htmlFor="contactPhone" error={errors.contactPhone}>
          <input
            id="contactPhone"
            type="tel"
            value={values.contactPhone}
            onChange={(e) => setField('contactPhone', maskPhone(e.target.value))}
            placeholder="(61) 99999-9999"
            autoComplete="off"
            className={inputClass(errors.contactPhone)}
          />
        </Field>

        <Field
          label="Valor da renovação (opcional)"
          htmlFor="renewalValue"
          error={errors.renewalValue}
          hint="Em reais."
        >
          <input
            id="renewalValue"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={values.renewalValue}
            onChange={(e) => setField('renewalValue', e.target.value)}
            className={inputClass(errors.renewalValue)}
          />
        </Field>

        {!isEdit && (
          <Field
            label="Cadastrado por"
            htmlFor="createdByUserId"
            error={errors.createdByUserId}
          >
            <select
              id="createdByUserId"
              value={values.createdByUserId}
              onChange={(e) => setField('createdByUserId', e.target.value)}
              className={inputClass(errors.createdByUserId)}
            >
              <option value="">Selecione…</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </Field>
        )}
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <Link
          to="/certificados"
          className="rounded-md border border-line px-4 py-2 text-sm transition-colors hover:bg-elevated"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {saving ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Cadastrar'}
        </button>
      </div>
    </form>
  )
}
