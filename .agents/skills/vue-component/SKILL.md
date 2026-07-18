---
name: vue-component
description: 创建符合现代 Vue 3 标准的组件，使用 Composition API + `<script setup>` + shadcn-vue 设计系统。
---

# Vue 3 组件开发指南

在创建 Vue 组件时，遵循以下规范：

## 组件结构

```vue
<script setup>
// 1. 外部依赖
import { ref, computed } from 'vue'
import { Icon } from '@iconify/vue'

// 2. 项目内部依赖
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button/index.js'

// 3. Props 定义
const props = defineProps({
  title: { type: String, required: true },
  variant: { type: String, default: 'default' },
  class: { type: [String, Object, Array], default: '' },
})

// 4. Emits
const emit = defineEmits(['click', 'update'])

// 5. 响应式状态
const count = ref(0)
const doubled = computed(() => count.value * 2)

// 6. 方法
function handleClick() {
  emit('click', count.value)
}
</script>

<template>
  <div :class="cn('flex items-center gap-2', props.class)">
    <slot name="icon" />
    <span>{{ title }}</span>
    <Button @click="handleClick">{{ count }}</Button>
    <slot />
  </div>
</template>
```

## 规则

1. **用 `<script setup>` 语法**，不要用 `defineComponent({})`
2. **Props 用运行时声明**（对象形式），不要用 TypeScript 类型标注
3. **Emits 用数组形式** `defineEmits(['event'])`
4. **class 合并用 `cn()`** 工具函数（来自 `@/lib/utils`）
5. **优先使用 shadcn-vue 组件**（`@/components/ui/`），而不是手写样式
6. **图标用 `@iconify/vue`** 的 `<Icon icon="lucide:name" />`
7. **样式用 Tailwind CSS**，不要写 `<style scoped>`
8. **对外暴露的 class prop** 统一用 `{ type: [String, Object, Array], default: '' }`
