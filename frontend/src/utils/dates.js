const pad = (n) => String(n).padStart(2, '0')

// Hoje no formato do <input type="date"> (YYYY-MM-DD), em horário local.
export function todayISO() {
  const d = new Date()
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

// Soma anos a uma data ISO (YYYY-MM-DD), também em horário local.
export function addYearsISO(iso, years) {
  const [year, month, day] = iso.split('-').map(Number)
  const next = new Date(year + years, month - 1, day)
  return `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`
}
