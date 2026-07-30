<template>
  <div class="min-h-screen bg-violet-50 px-4 py-24 sm:px-10">
    <div class="mx-auto max-w-3xl">
      <!-- Header -->
      <div class="mb-8">
        <h1
          class="special-font font-zentry text-4xl font-black uppercase text-black"
        >
          留言板
        </h1>
        <p class="mt-1 font-robert-regular text-sm text-muted-foreground">
          留下你想说的话，与大家分享
        </p>
      </div>

      <!-- Error message -->
      <div
        v-if="errorMsg"
        class="mb-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
      >
        {{ errorMsg }}
      </div>

      <!-- Message list -->
      <div class="mb-6 space-y-4">
        <TransitionGroup name="list">
          <Card
            v-for="msg in messages"
            :key="msg.id"
            class="transition-all duration-300"
          >
            <CardContent class="flex items-start gap-4 pt-6">
              <Avatar class="size-10 shrink-0">
                <AvatarFallback
                  class="bg-primary/10 text-sm font-semibold text-primary"
                >
                  {{ getUserInitials(msg.user) }}
                </AvatarFallback>
              </Avatar>

              <div class="min-w-0 flex-1">
                <div class="flex items-baseline justify-between gap-2">
                  <span class="text-sm font-semibold">
                    {{ msg.user?.name || '未知用户' }}
                  </span>
                  <span class="shrink-0 text-xs text-muted-foreground">
                    {{ formatTime(msg.createdAt) }}
                  </span>
                </div>
                <p class="mt-1.5 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/80">
                  {{ msg.content }}
                </p>

                <!-- Delete button (own messages only) -->
                <button
                  v-if="isAuthenticated && user?.id === msg.user?.id"
                  class="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-destructive"
                  @click="handleDelete(msg.id)"
                >
                  <Icon
                    icon="lucide:trash-2"
                    class="size-3"
                  />
                  删除
                </button>
              </div>
            </CardContent>
          </Card>
        </TransitionGroup>

        <!-- Empty state -->
        <div
          v-if="!loading && messages.length === 0"
          class="flex flex-col items-center justify-center py-16 text-center"
        >
          <Icon
            icon="lucide:message-square"
            class="mb-4 size-12 text-muted-foreground/40"
          />
          <p class="text-sm text-muted-foreground">
            还没有留言，快来写下第一条吧
          </p>
        </div>

        <!-- Loading -->
        <div
          v-if="loading"
          class="flex items-center justify-center py-16"
        >
          <Icon
            icon="lucide:loader-circle"
            class="size-6 animate-spin text-primary"
          />
        </div>
      </div>

      <!-- Editor -->
      <Card class="border-primary/20">
        <CardContent class="p-4">
          <template v-if="isAuthenticated">
            <textarea
              v-model="newContent"
              placeholder="写下你的留言..."
              class="w-full resize-none rounded-lg border border-input bg-background p-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              :maxlength="500"
              rows="3"
              @keydown.ctrl.enter="handleSubmit"
            />
            <div class="mt-3 flex items-center justify-between">
              <span class="text-xs text-muted-foreground">
                {{ newContent.length }} / 500
                <span class="ml-2 hidden sm:inline">Ctrl+Enter 发送</span>
              </span>
              <Button
                :disabled="!newContent.trim() || submitting"
                @click="handleSubmit"
              >
                <Icon
                  v-if="submitting"
                  icon="lucide:loader-circle"
                  class="mr-1.5 size-4 animate-spin"
                />
                <Icon
                  v-else
                  icon="lucide:send"
                  class="mr-1.5 size-4"
                />
                {{ submitting ? '发送中...' : '发布留言' }}
              </Button>
            </div>
          </template>
          <template v-else>
            <div class="flex flex-col items-center gap-3 py-4 text-center">
              <p class="text-sm text-muted-foreground">
                登录后即可参与留言
              </p>
              <Button as-child>
                <router-link to="/login">
                  去登录
                </router-link>
              </Button>
            </div>
          </template>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'
import { useAuth } from '@/composables/useAuth.js'
import axios from 'axios'

import {
  Card,
  CardContent,
} from '@/components/ui/card/index.js'
import { Avatar, AvatarFallback } from '@/components/ui/avatar/index.js'
import { Button } from '@/components/ui/button/index.js'

const { user, isAuthenticated } = useAuth()

const messages = ref([])
const loading = ref(true)
const errorMsg = ref('')
const newContent = ref('')
const submitting = ref(false)

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
})

// 请求拦截器
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('tantalus_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) {
      throw new Error('无法连接到服务器')
    }
    throw new Error(error.response.data?.message || `请求失败 (${error.response.status})`)
  }
)

function getUserInitials(user) {
  if (!user || !user.name) return '?'
  return user.name.slice(0, 2).toUpperCase()
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  if (hours < 24) return `${hours} 小时前`
  if (days < 7) return `${days} 天前`
  return d.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

async function fetchMessages() {
  loading.value = true
  errorMsg.value = ''
  try {
    const data = await apiClient.get('/messages')
    messages.value = data.messages
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}

async function handleSubmit() {
  const content = newContent.value.trim()
  if (!content || submitting.value) return

  submitting.value = true
  errorMsg.value = ''
  try {
    const data = await apiClient.post('/messages', { content })
    messages.value.unshift(data.message)
    newContent.value = ''
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    submitting.value = false
  }
}

async function handleDelete(id) {
  errorMsg.value = ''
  try {
    await apiClient.delete(`/messages/${id}`)
    messages.value = messages.value.filter((m) => m.id !== id)
  } catch (e) {
    errorMsg.value = e.message
  }
}

onMounted(() => {
  fetchMessages()
})
</script>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
