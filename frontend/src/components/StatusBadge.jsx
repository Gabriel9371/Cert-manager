import { statusBadge, statusLabel } from '../utils/status'

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusBadge(status)}`}
    >
      {statusLabel(status)}
    </span>
  )
}
