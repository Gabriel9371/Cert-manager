import { daysUntil } from './format'

// Texto relativo ao vencimento, para exibir ao lado da data.
export function deadlineLabel(value) {
  const days = daysUntil(value)

  if (days === null) return ''
  if (days < -1) return `venceu há ${-days} dias`
  if (days === -1) return 'venceu ontem'
  if (days === 0) return 'vence hoje'
  if (days === 1) return 'vence amanhã'
  return `vence em ${days} dias`
}
