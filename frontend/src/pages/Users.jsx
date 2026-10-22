import { useEffect, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog'
import Field from '../components/Field'
import { userService } from '../services/userService'
import { extractError } from '../utils/errors'
import { USER_ROLES } from '../utils/status'

const EMPTY = { name: '', email: '', password: '', role: 'USER' }
const inputClass = 'w-full rounded-lg border border-line bg-bg px-3 py-2.5 text-sm text-fg outline-none transition focus:border-accent'

export default function Users() {
  const [users, setUsers] = useState([])
  const [values, setValues] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [formError, setFormError] = useState(null)

  useEffect(() => {
    userService.list()
      .then(setUsers)
      .catch((err) => setError(extractError(err).message))
      .finally(() => setLoading(false))
  }, [])
  function startCreate() { setEditing('new'); setValues(EMPTY); setFormError(null) }
  function startEdit(user) { setEditing(user.id); setValues({ name: user.name, email: user.email, password: '', role: user.role }); setFormError(null) }
  function setField(name, value) { setValues((current) => ({ ...current, [name]: value })) }
  async function submit(event) {
    event.preventDefault(); setSaving(true); setFormError(null)
    try {
      const payload = { ...values, ...(values.password ? {} : { password: undefined }) }
      const saved = editing === 'new' ? await userService.create(payload) : await userService.update(editing, payload)
      setUsers((current) => editing === 'new' ? [...current, saved] : current.map((user) => user.id === saved.id ? saved : user))
      setEditing(null)
    } catch (err) { setFormError(extractError(err).message) } finally { setSaving(false) }
  }
  async function remove() { try { await userService.remove(toDelete.id); setUsers((current) => current.filter((user) => user.id !== toDelete.id)); setToDelete(null) } catch (err) { setError(extractError(err).message); setToDelete(null) } }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">Administração</p><h2 className="text-2xl font-semibold tracking-tight">Usuários</h2><p className="mt-2 text-sm text-muted">Gerencie quem pode registrar e acompanhar certificados.</p></div>
        <button type="button" onClick={startCreate} className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-bg shadow-lg shadow-accent/10 transition hover:bg-accent-soft">Adicionar usuário</button>
      </div>
      {error && <div className="mb-5 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>}
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        {loading ? <p className="p-5 text-sm text-muted">Carregando usuários…</p> : users.length === 0 ? <p className="p-5 text-sm text-muted">Nenhum usuário cadastrado.</p> : <div className="divide-y divide-line">{users.map((user) => <div key={user.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"><div className="flex min-w-0 items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-elevated text-sm font-semibold text-accent">{user.name?.charAt(0).toUpperCase()}</div><div className="min-w-0"><p className="truncate text-sm font-medium">{user.name}</p><p className="truncate text-xs text-muted">{user.email}</p></div></div><div className="flex items-center gap-3"><span className="rounded-full border border-line px-2.5 py-1 text-xs text-muted">{USER_ROLES[user.role] ?? user.role}</span><button type="button" onClick={() => startEdit(user)} className="text-sm text-accent hover:text-accent-soft">Editar</button><button type="button" onClick={() => setToDelete(user)} className="text-sm text-danger hover:underline">Excluir</button></div></div>)}</div>}
      </div>
      {editing && <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4" onClick={() => !saving && setEditing(null)}><form onSubmit={submit} onClick={(event) => event.stopPropagation()} className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-2xl"><h3 className="text-lg font-semibold">{editing === 'new' ? 'Adicionar usuário' : 'Editar usuário'}</h3><p className="mt-1 text-sm text-muted">Os dados serão usados para registrar ações no sistema.</p>{formError && <div className="mt-4 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">{formError}</div>}<div className="mt-5 space-y-4"><Field label="Nome" htmlFor="userName"><input id="userName" required value={values.name} onChange={(event) => setField('name', event.target.value)} className={inputClass} /></Field><Field label="E-mail" htmlFor="userEmail"><input id="userEmail" required type="email" value={values.email} onChange={(event) => setField('email', event.target.value)} className={inputClass} /></Field><Field label={editing === 'new' ? 'Senha' : 'Nova senha (opcional)'} htmlFor="userPassword"><input id="userPassword" required={editing === 'new'} type="password" value={values.password} onChange={(event) => setField('password', event.target.value)} className={inputClass} /></Field><Field label="Perfil" htmlFor="userRole"><select id="userRole" value={values.role} onChange={(event) => setField('role', event.target.value)} className={inputClass}>{Object.entries(USER_ROLES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></Field></div><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-line px-4 py-2 text-sm hover:bg-elevated">Cancelar</button><button type="submit" disabled={saving} className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-bg disabled:opacity-50">{saving ? 'Salvando…' : 'Salvar usuário'}</button></div></form></div>}
      {toDelete && <ConfirmDialog title="Excluir usuário" message={`Excluir ${toDelete.name}? Essa ação não pode ser desfeita.`} confirmLabel="Excluir" busyLabel="Excluindo…" onConfirm={remove} onCancel={() => setToDelete(null)} />}
    </div>
  )
}
