export const ACCESS_TOKEN = 'access_token'
export const REFRESH_TOKEN = 'refresh_token'

/**
 * 存储tokens
 * @param {string} accessToken
 * @param {string} refreshToken
 */
export function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN, `Bearer ${accessToken}`)
  localStorage.setItem(REFRESH_TOKEN, `Bearer ${refreshToken}`)
}

/**
 * 存储access_token
 * @param {string} accessToken
 */
export function saveAccessToken(accessToken: string) {
  localStorage.setItem(ACCESS_TOKEN, `Bearer ${accessToken}`)
}

/**
 * 获得某个token
 * @param {string} tokenKey
 */
export function getToken(tokenKey: typeof ACCESS_TOKEN | typeof REFRESH_TOKEN) {
  return localStorage.getItem(tokenKey)
}

/**
 * 获得access token
 */
export function getAccessToken() {
  return getToken(ACCESS_TOKEN)
}

/**
 * 获得refresh token
 */
export function getRefreshToken() {
  return getToken(ACCESS_TOKEN)
}

/**
 * 移除token
 */
export function removeToken() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
}
