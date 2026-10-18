// Fonte única dos status: rótulo em português e classes do badge.
// As cores vêm dos tokens definidos no index.css (@theme).
export const CERTIFICATE_STATUS = {
  ACTIVE: {
    label: 'Ativo',
    badge: 'bg-ok/15 text-ok border-ok/30',
  },
  TO_RENEW: {
    label: 'A renovar',
    badge: 'bg-warn/15 text-warn border-warn/30',
  },
  RENEWING: {
    label: 'Em renovação',
    badge: 'bg-info/15 text-info border-info/30',
  },
  EXPIRED: {
    label: 'Vencido',
    badge: 'bg-danger/15 text-danger border-danger/30',
  },
  RENEWED: {
    label: 'Renovado',
    badge: 'bg-accent/15 text-accent border-accent/30',
  },
}

export const USER_ROLES = {
  ADMIN: 'Administrador',
  USER: 'Usuário',
}

export const statusLabel = (status) =>
  CERTIFICATE_STATUS[status]?.label ?? status

export const statusBadge = (status) =>
  CERTIFICATE_STATUS[status]?.badge ?? 'bg-line text-muted border-line'
