import { cookies } from './cookies'

const TOKEN_COOKIE = 'access_token'
const MS_PER_SECOND = 1000

export const tokenStorage = {
  get(): string | null {
    return cookies.get(TOKEN_COOKIE)
  },

  set(token: string, expiresInSeconds: number): void {
    cookies.set(TOKEN_COOKIE, token, {
      expires: new Date(Date.now() + expiresInSeconds * MS_PER_SECOND),
      sameSite: 'strict',
    })
  },

  clear(): void {
    cookies.remove(TOKEN_COOKIE)
  },
}
