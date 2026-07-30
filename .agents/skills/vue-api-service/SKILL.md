---
name: vue-api-service
description: 创建 API 服务层，封装 fetch 请求，统一错误处理，配合 JWT 认证。
---

# Vue API 服务层指南

## 基础 API 封装

项目使用原生 `fetch` + JWT 认证，统一封装模式如下：

```js
// src/services/xxx.js
import { useAuth } from '@/composables/useAuth'

const BASE = '/api'

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json' }

  // 自动附加 token
  const token = localStorage.getItem('awwwards_token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  })

  const data = await res.json()

  if (!res.ok) {
    // 401 自动清除登录状态
    if (res.status === 401) {
      localStorage.removeItem('tantalus_token')
      localStorage.removeItem('tantalus_user')
      window.location.href = '/login'
    }
    throw new Error(data.message || '请求失败')
  }

  return data
}

// 导出具体 API
export function getUsers(params) {
  return request('/users?' + new URLSearchParams(params))
}

export function createUser(data) {
  return request('/users', { method: 'POST', body: JSON.stringify(data) })
}
```

## 规则

1. **服务文件放在 `src/services/`** 目录下
2. **统一用 `request()` 封装**，不要直接调用 `fetch`
3. **路径以 `/api` 为前缀**（Vite 代理自动转发到后端 3001 端口）
4. **错误统一 throw Error**，交给调用方 try/catch
5. **搜索/列表接口**用 URLSearchParams 传参
6. **每个 service 文件按业务模块划分**（如 `auth.js`、`users.js`）

## 已有 API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | /api/auth/register | 注册 |
| POST | /api/auth/login | 登录 |
| GET | /api/auth/me | 获取用户信息 |
| PUT | /api/auth/profile | 更新资料 |
| PUT | /api/auth/password | 修改密码 |
