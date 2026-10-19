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

// Só exibição: 12345678000199 -> 12.345.678/0001-99
export function formatCnpj(value) {
  const digits = (value ?? '').replace(/\D/g, '')
  if (digits.length !== 14) return value ?? '—'
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5',
  )
}

export function formatPhone(value) {
  const digits = (value ?? '').replace(/\D/g, '')
  if (digits.length === 11)
    return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
  if (digits.length === 10)
    return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
  return value ?? '—'
}
