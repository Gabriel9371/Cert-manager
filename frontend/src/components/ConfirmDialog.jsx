import { useEffect } from 'react'

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirmar',
  busyLabel = 'Aguarde…',
  busy = false,
  onConfirm,
  onCancel,
}) {
  // Esc fecha o modal, exceto enquanto uma operação está em andamento.
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape' && !busy) onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [busy, onCancel])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={() => !busy && onCancel()}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-sm rounded-lg border border-line bg-surface p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted">{message}</p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-md border border-line px-3 py-2 text-sm text-fg transition-colors hover:bg-elevated disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-md bg-danger px-3 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {busy ? busyLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
