// Aceita CNPJ numérico (antigo) e alfanumérico (desde julho de 2026):
// 12 primeiros caracteres em 0-9 ou A-Z, e 2 dígitos verificadores numéricos.
const CNPJ_PATTERN = /^[0-9A-Z]{12}[0-9]{2}$/

// "12.abc.345/01de-35" -> "12ABC34501DE35"
export function normalizeCnpj(value) {
  return (value ?? '').toUpperCase().replace(/[^0-9A-Z]/g, '')
}

// Máscara progressiva, para usar enquanto a pessoa digita.
export function maskCnpj(value) {
  const c = normalizeCnpj(value).slice(0, 14)
  let out = c.slice(0, 2)
  if (c.length > 2) out += '.' + c.slice(2, 5)
  if (c.length > 5) out += '.' + c.slice(5, 8)
  if (c.length > 8) out += '/' + c.slice(8, 12)
  if (c.length > 12) out += '-' + c.slice(12, 14)
  return out
}
// Módulo 11: da direita para a esquerda os pesos são 2,3,4,...,9 e voltam ao 2.
// Cada caractere vale (código ASCII - 48): o "0" vale 0 e o "A" vale 17.
function checkDigit(chars) {
  let sum = 0
  let weight = 2

  for (let i = chars.length - 1; i >= 0; i--) {
    sum += (chars.charCodeAt(i) - 48) * weight
    weight = weight === 9 ? 2 : weight + 1
  }

  const rest = sum % 11
  return rest < 2 ? 0 : 11 - rest
}

export function isValidCnpj(value) {
  const cnpj = normalizeCnpj(value)

  if (!CNPJ_PATTERN.test(cnpj)) return false
  // 00000000000000, 11111111111111... passam, mas não existem
  if (/^(.)\1+$/.test(cnpj)) return false

  const base = cnpj.slice(0, 12)
  const first = checkDigit(base)
  const second = checkDigit(base + first)

  return cnpj.slice(12) === `${first}${second}`
}
