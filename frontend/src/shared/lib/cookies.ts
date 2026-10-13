import Cookies from 'js-cookie'

interface CookieOptions {
  expires: number | Date
  sameSite: 'strict' | 'lax'
}

export const cookies = {
  get(name: string): string | null {
    return Cookies.get(name) ?? null
  },

  set(name: string, value: string, { expires, sameSite }: CookieOptions): void {
    Cookies.set(name, value, {
      expires,
      sameSite,
      path: '/',
      secure: window.location.protocol === 'https:',
    })
  },

  remove(name: string): void {
    Cookies.remove(name, { path: '/' })
  },
}
