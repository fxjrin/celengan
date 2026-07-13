// wallet kit rejects with plain { code, message } objects, not Error instances
export function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message
  if (typeof e === 'object' && e !== null && 'message' in e) {
    const message = (e as { message: unknown }).message
    if (typeof message === 'string') return message
  }
  return 'Something went wrong'
}
