---
name: vue-composable
description: 创建可复用的 Vue 3 Composition API composable，遵循模块化、单一职责原则。
---

# Vue 3 Composable 开发指南

## 基本模式

```js
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 模块级状态（跨实例共享）
const sharedState = ref(null)

export function useMyFeature(param) {
  // 实例级状态
  const data = ref([])
  const loading = ref(false)
  const error = ref(null)

  // 计算属性
  const isEmpty = computed(() => data.value.length === 0)

  // 方法
  async function fetch() {
    loading.value = true
    error.value = null
    try {
      const res = await fetch(`/api/data?param=${param.value}`)
      data.value = await res.json()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  // 生命周期
  onMounted(() => { fetch() })
  onUnmounted(() => { /* 清理 */ })

  // 返回值
  return {
    data,
    loading,
    error,
    isEmpty,
    refresh: fetch,
  }
}
```

## 规则

1. **文件名用 `useXxx.js`** 格式（驼峰）
2. **模块级状态**放在函数外部，用 `reactive` 或 `ref` 包裹
3. **实例级状态**放在函数内部，每次调用独立
4. **返回值用对象解构**，对外暴露状态和方法
5. **异步操作统一 try/catch**，暴露 `loading` + `error` 状态
6. **使用 `fetch`** 做 API 请求，配合 `@/composables/useAuth.js` 的 token
7. **清理工作**在 `onUnmounted` 中处理（取消请求、定时器等）
8. **文档注释**说明 composable 的用途和返回值
