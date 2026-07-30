<template>
  <div class="min-h-screen bg-violet-50 px-4 py-24 sm:px-10">
    <div class="mx-auto max-w-3xl">
      <!-- Loading -->
      <div v-if="loading" class="flex items-center justify-center py-32">
        <Icon icon="lucide:loader-circle" class="size-6 animate-spin text-primary" />
      </div>

      <!-- Error -->
      <div
        v-else-if="errorMsg"
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <Icon icon="lucide:file-x" class="mb-4 size-12 text-muted-foreground/40" />
        <p class="text-sm text-destructive">{{ errorMsg }}</p>
        <Button as-child class="mt-4">
          <router-link to="/posts">返回帖子列表</router-link>
        </Button>
      </div>

      <!-- Post detail -->
      <template v-else-if="post">
        <div class="mb-6">
          <router-link
            to="/posts"
            class="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon icon="lucide:arrow-left" class="size-4" />
            返回帖子列表
          </router-link>
        </div>

        <Card class="overflow-hidden">
          <!-- Images -->
          <div v-if="post.images?.length" class="relative aspect-video w-full overflow-hidden bg-white">
            <div
              class="flex h-full transition-transform duration-300"
              :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
            >
              <img
                v-for="(img, i) in post.images"
                :key="i"
                :src="img"
                class="size-full shrink-0 object-contain"
                alt=""
              />
            </div>
            <div
              v-if="post.images.length > 1"
              class="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2"
            >
              <button
                v-for="(_, i) in post.images"
                :key="i"
                class="size-2.5 rounded-full transition-colors"
                :class="currentImageIndex === i ? 'bg-white' : 'bg-white/40'"
                @click="currentImageIndex = i"
              />
            </div>
          </div>

          <CardContent class="p-6 sm:p-8">
            <!-- Author -->
            <div class="flex items-center gap-3">
              <Avatar class="size-10">
                <AvatarFallback class="bg-primary/10 text-sm font-semibold text-primary">
                  {{ getUserInitials(post.userId) }}
                </AvatarFallback>
              </Avatar>
              <div>
                <p class="text-sm font-semibold">{{ post.userId?.name || '未知用户' }}</p>
                <p class="text-xs text-muted-foreground">{{ formatTime(post.createdAt) }}</p>
              </div>
              <button
                v-if="isAuthenticated && user?.id === post.userId?.id"
                class="ml-auto shrink-0 text-xs text-muted-foreground transition-colors hover:text-destructive"
                @click="handleDelete(post.id)"
              >
                <Icon icon="lucide:trash-2" class="size-4" />
              </button>
            </div>

            <!-- Title -->
            <h1 class="mt-6 font-zentry text-2xl font-bold text-black sm:text-3xl">
              {{ post.title }}
            </h1>

            <!-- Content -->
            <div class="mt-6 whitespace-pre-wrap break-words text-base leading-relaxed text-foreground/80">
              {{ post.content }}
            </div>
          </CardContent>
        </Card>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import { useAuth } from '@/composables/useAuth.js'
import axios from 'axios'

import {
  Card,
  CardContent,
} from '@/components/ui/card/index.js'
import { Avatar, AvatarFallback } from '@/components/ui/avatar/index.js'
import { Button } from '@/components/ui/button/index.js'

const route = useRoute()
const router = useRouter()
const { user, isAuthenticated } = useAuth()

const post = ref(null)
const loading = ref(true)
const errorMsg = ref('')
const currentImageIndex = ref(0)

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('tantalus_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (!error.response) throw new Error('无法连接到服务器')
    throw new Error(error.response.data?.message || `请求失败 (${error.response.status})`)
  }
)

function getUserInitials(userId) {
  if (!userId || !userId.name) return '?'
  return userId.name.slice(0, 2).toUpperCase()
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const now = new Date()
  const diff = now - d
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes} 分钟前`
  const hours = Math.floor(diff / 3600000)
  if (hours < 24) return `${hours} 小时前`
  const days = Math.floor(diff / 86400000)
  if (days < 7) return `${days} 天前`
  return d.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  })
}

async function fetchPost() {
  loading.value = true
  errorMsg.value = ''
  try {
    const data = await apiClient.get(`/posts/${route.params.id}`)
    post.value = data.post
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  try {
    await apiClient.delete(`/posts/${id}`)
    router.push('/posts')
  } catch (e) {
    errorMsg.value = e.message
  }
}

onMounted(() => {
  fetchPost()
})
</script>
