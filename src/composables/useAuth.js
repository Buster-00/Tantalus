import { reactive, computed, watch } from 'vue'
import { router } from '@/router/index.js'
import axios from 'axios'

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

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// 请求拦截器：自动附加 JWT token
apiClient.interceptors.request.use((config) => {
  if (state.token) {
    config.headers.Authorization = `Bearer ${state.token}`
  }
  return config
})

// 响应拦截器：统一错误处理 & 401 自动登出
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      state.user = null
      state.token = null
    }

    if (!error.response) {
      // 网络错误（无法连接服务器）
      throw new Error('无法连接到服务器，请确认后端已启动 (cd server && npm run dev)')
    }

    throw new Error(error.response.data?.message || `请求失败 (${error.response.status})`)
  }
)

export function useAuth() {
  const user = computed(() => state.user)
  const isAuthenticated = computed(() => !!state.token && !!state.user)

  async function restoreSession() {
    if (!state.token) return
    try {
      // 对应 eros: POST /auth/profile (JwtAuthGuard)
      const profile = await apiClient.post('/auth/profile')
      state.user = profile
    } catch {
      state.user = null
      state.token = null
    }
  }

  async function login(email, password) {
    // 对应 eros: POST /auth/login → { access_token, user }
    const { access_token, user: userData } = await apiClient.post('/auth/login', { email, password })
    state.user = userData
    state.token = access_token
    return userData
  }

  async function register(name, email, password) {
    // 对应 eros: POST /auth/register → { message, user }
    // eros 注册后不返回 token，所以注册成功后调用 login 自动登录
    const { user: userData } = await apiClient.post('/auth/register', { name, email, password })
    // 注册成功后自动登录，获取 token
    const { access_token } = await apiClient.post('/auth/login', { email, password })
    state.user = userData
    state.token = access_token
    return userData
  }

  async function logout() {
    state.user = null
    state.token = null
    router.push('/')
  }

  async function updateProfile(updates) {
    // TODO: eros 暂无 PUT /auth/profile 接口，待后端补充
    const { user: userData } = await apiClient.put('/auth/profile', updates)
    state.user = userData
    return userData
  }

  async function changePassword(currentPassword, newPassword) {
    // TODO: eros 暂无 PUT /auth/password 接口，待后端补充
    const data = await apiClient.put('/auth/password', { currentPassword, newPassword })
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
