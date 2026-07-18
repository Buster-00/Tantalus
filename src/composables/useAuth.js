import { reactive, computed, watch } from 'vue'
import { router } from '@/router/index.js'

const TOKEN_KEY = 'awwwards_token'
const USER_KEY = 'awwwards_user'

const state = reactive({
  user: JSON.parse(localStorage.getItem(USER_KEY) || 'null'),
  token: localStorage.getItem(TOKEN_KEY) || null,
})

// 持久化 token 和 user
watch(
  () => [state.token, state.user],
  ([token, user]) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  },
  { deep: true }
)

// 通用 API 请求
async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (state.token) {
    headers['Authorization'] = `Bearer ${state.token}`
  }

  let res
  try {
    res = await fetch(path, {
      ...options,
      headers: { ...headers, ...options.headers },
    })
  } catch {
    throw new Error('无法连接到服务器，请确认后端已启动 (cd server && npm run dev)')
  }

  let data = {}
  try {
    data = await res.json()
  } catch {
    if (!res.ok) {
      throw new Error(`请求失败 (${res.status})`)
    }
  }

  if (!res.ok) {
    if (res.status === 401) {
      state.user = null
      state.token = null
    }
    throw new Error(data.message || `请求失败 (${res.status})`)
  }

  return data
}

export function useAuth() {
  const user = computed(() => state.user)
  const isAuthenticated = computed(() => !!state.token && !!state.user)

  async function restoreSession() {
    if (!state.token) return
    try {
      const { user: freshUser } = await api('/api/auth/me')
      state.user = freshUser
    } catch {
      state.user = null
      state.token = null
    }
  }

  async function login(email, password) {
    const { user: userData, token } = await api('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    state.user = userData
    state.token = token
    return userData
  }

  async function register(name, email, password) {
    const { user: userData, token } = await api('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    })
    state.user = userData
    state.token = token
    return userData
  }

  async function logout() {
    state.user = null
    state.token = null
    router.push('/')
  }

  async function updateProfile(updates) {
    const { user: userData } = await api('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    state.user = userData
    return userData
  }

  async function changePassword(currentPassword, newPassword) {
    const data = await api('/api/auth/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    })
    return data
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    restoreSession,
  }
}
