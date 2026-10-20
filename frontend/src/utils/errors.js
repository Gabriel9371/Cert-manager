// Converte um erro do axios em { message, fields }.
export function extractError(err) {
  if (!err.response) {
    return {
      message: 'Não foi possível conectar ao servidor. O backend está rodando?',
      fields: null,
    }
  }

  const data = err.response.data ?? {}

  return {
    message:
      typeof data.error === 'string' ? data.error : 'Erro inesperado no servidor.',
    fields: data.fields ?? null,
  }
}
