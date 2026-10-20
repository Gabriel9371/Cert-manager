import { maskCnpj, normalizeCnpj } from './cnpj'

// O backend manda LocalDate como "2026-10-18". Usar new Date("2026-10-18")
// interpreta como UTC e, no Brasil (UTC-3), mostra o dia anterior.
// Por isso montamos a data manualmente, em horário local.
export function parseLocalDate(value) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatDate(value) {
  const date = parseLocalDate(value)
  return date ? date.toLocaleDateString('pt-BR') : '—'
}

// Dias até a data (negativo = já passou).
export function daysUntil(value) {
  const date = parseLocalDate(value)
  if (!date) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((date - today) / 86_400_000)
}

export function formatCurrency(value) {
  if (value === null || value === undefined) return '—'
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatCnpj(value) {
  return normalizeCnpj(value).length === 14 ? maskCnpj(value) : value || '—'
}

export function formatPhone(value) {
  const digits = (value ?? '').replace(/\D/g, '')
  if (digits.length === 11)
    return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  if (digits.length === 10)
    return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
  return value || '—'
}

export function maskPhone(value) {
  const d = (value ?? '').replace(/\D/g, '').slice(0, 11)
  if (d.length <= 2) return d
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}
