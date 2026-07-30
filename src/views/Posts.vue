<template>
  <div class="min-h-screen bg-violet-50 px-4 py-24 sm:px-10">
    <div class="mx-auto max-w-4xl">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="special-font font-zentry text-4xl font-black uppercase text-black">
            帖子
          </h1>
          <p class="mt-1 font-robert-regular text-sm text-muted-foreground">
            看看大家在说什么
          </p>
        </div>
        <Button v-if="isAuthenticated" as-child>
          <router-link to="/posts/new" class="flex items-center gap-1">
            <Icon icon="lucide:plus" class="size-4" />
            发布新内容
          </router-link>
        </Button>
      </div>

      <div
        v-if="errorMsg"
        class="mb-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
      >
        {{ errorMsg }}
      </div>

      <!-- Post list -->
      <div class="space-y-6">
        <TransitionGroup name="list">
          <Card v-for="post in posts" :key="post.id" class="overflow-hidden transition-all duration-300">
            <!-- Images carousel -->
            <div v-if="post.images?.length" class="relative aspect-video w-full overflow-hidden bg-white">
              <div
                class="flex h-full transition-transform duration-300"
                :style="{ transform: `translateX(-${currentImageIndex(post.id) * 100}%)` }"
              >
                <img
                  v-for="(img, i) in post.images"
                  :key="i"
                  :src="img"
                  class="size-full shrink-0 object-contain"
                  alt=""
                />
              </div>
              <!-- Dots -->
              <div
                v-if="post.images.length > 1"
                class="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5"
              >
                <button
                  v-for="(_, i) in post.images"
                  :key="i"
                  class="size-2 rounded-full transition-colors"
                  :class="currentImageIndex(post.id) === i ? 'bg-white' : 'bg-white/40'"
                  @click="setImageIndex(post.id, i)"
                />
              </div>
            </div>

            <CardContent class="p-5">
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <Avatar class="size-9">
                    <AvatarFallback class="bg-primary/10 text-xs font-semibold text-primary">
                      {{ getUserInitials(post.userId) }}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p class="text-sm font-semibold">{{ post.userId?.name || '未知用户' }}</p>
                    <p class="text-xs text-muted-foreground">{{ formatTime(post.createdAt) }}</p>
                  </div>
                </div>

                <button
                  v-if="isAuthenticated && user?.id === post.userId?.id"
                  class="shrink-0 text-xs text-muted-foreground transition-colors hover:text-destructive"
                  @click="handleDelete(post.id)"
                >
                  <Icon icon="lucide:trash-2" class="size-3.5" />
                </button>
              </div>

              <router-link
                :to="`/posts/${post.id}`"
                class="mt-4 block font-zentry text-lg font-semibold text-black transition-colors hover:text-primary"
              >
                {{ post.title }}
              </router-link>
              <p class="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed text-foreground/80">
                {{ post.content }}
              </p>
            </CardContent>
          </Card>
        </TransitionGroup>

        <div
          v-if="!loading && posts.length === 0"
          class="flex flex-col items-center justify-center py-20 text-center"
        >
          <Icon icon="lucide:file-text" class="mb-4 size-12 text-muted-foreground/40" />
          <p class="text-sm text-muted-foreground">
            还没有帖子
          </p>
        </div>

        <div v-if="loading" class="flex items-center justify-center py-20">
          <Icon icon="lucide:loader-circle" class="size-6 animate-spin text-primary" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
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

const posts = ref([])
const loading = ref(true)
const errorMsg = ref('')
const imageIndices = reactive({})

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
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

function currentImageIndex(postId) {
  return imageIndices[postId] || 0
}

function setImageIndex(postId, index) {
  imageIndices[postId] = index
}

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

async function fetchPosts() {
  loading.value = true
  errorMsg.value = ''
  try {
    const data = await apiClient.get('/posts')
    posts.value = data.posts
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}

async function handleDelete(id) {
  errorMsg.value = ''
  try {
    await apiClient.delete(`/posts/${id}`)
    posts.value = posts.value.filter((p) => p.id !== id)
  } catch (e) {
    errorMsg.value = e.message
  }
}

onMounted(() => {
  fetchPosts()
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
