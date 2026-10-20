// Como não há login(ainda), guardamos o último usuário escolhido nas ações
// (conveniência: se o storage falhar, o app segue funcionando sem isso).
const STORAGE_KEY = 'certmanager:userId'

export function readSavedUser() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function saveUser(id) {
  try {
    localStorage.setItem(STORAGE_KEY, String(id))
  } catch {
    // no problem ;) : só perde a conveniência
  }
}
