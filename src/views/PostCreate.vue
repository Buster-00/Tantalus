<template>
  <div class="min-h-screen bg-violet-50 px-4 py-24 sm:px-10">
    <div class="mx-auto max-w-2xl">
      <div class="mb-8">
        <h1 class="special-font font-zentry text-4xl font-black uppercase text-black">
          发布新内容
        </h1>
        <p class="mt-1 font-robert-regular text-sm text-muted-foreground">
          分享你的想法
        </p>
      </div>

      <Card>
        <CardContent class="p-6">
          <div
            v-if="errorMsg"
            class="mb-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
          >
            {{ errorMsg }}
          </div>

          <form class="space-y-5" @submit.prevent="handleSubmit">
            <div class="space-y-2">
              <Label for="title">标题</Label>
              <Input
                id="title"
                v-model="title"
                placeholder="给帖子起个标题"
                maxlength="100"
                required
              />
              <p class="text-xs text-muted-foreground">{{ title.length }} / 100</p>
            </div>

            <div class="space-y-2">
              <Label for="content">内容</Label>
              <textarea
                id="content"
                v-model="content"
                placeholder="写点什么..."
                class="w-full resize-none rounded-lg border border-input bg-background p-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                rows="6"
                maxlength="5000"
                required
              />
              <p class="text-xs text-muted-foreground">{{ content.length }} / 5000</p>
            </div>

            <div class="space-y-2">
              <Label>图片（最多 9 张）</Label>
              <div
                class="flex flex-wrap gap-3"
                @drop="handleDrop"
                @dragover.prevent
              >
                <!-- Preview -->
                <div
                  v-for="(file, index) in imageFiles"
                  :key="index"
                  class="relative size-24 overflow-hidden rounded-lg border"
                >
                  <img
                    :src="getPreviewUrl(file)"
                    class="size-full object-cover"
                    alt=""
                  />
                  <button
                    type="button"
                    class="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                    @click="removeImage(index)"
                  >
                    <Icon icon="lucide:x" class="size-3" />
                  </button>
                </div>

                <!-- Upload button -->
                <label
                  v-if="imageFiles.length < 9"
                  class="flex size-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  <Icon icon="lucide:plus" class="size-6" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    class="hidden"
                    @change="handleFileSelect"
                  />
                </label>
              </div>
              <p v-if="imageFiles.length > 0" class="text-xs text-muted-foreground">
                已选择 {{ imageFiles.length }} 张图片，每张最大 5MB
              </p>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <Button type="submit" :disabled="submitting || !title.trim() || !content.trim()">
                <Icon
                  v-if="submitting"
                  icon="lucide:loader-circle"
                  class="mr-1.5 size-4 animate-spin"
                />
                <Icon v-else icon="lucide:send" class="mr-1.5 size-4" />
                {{ submitting ? '发布中...' : '发布' }}
              </Button>
              <Button variant="ghost" as-child>
                <router-link to="/posts">取消</router-link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Icon } from '@iconify/vue'
import axios from 'axios'

import {
  Card,
  CardContent,
} from '@/components/ui/card/index.js'
import { Button } from '@/components/ui/button/index.js'
import { Input } from '@/components/ui/input/index.js'
import { Label } from '@/components/ui/label/index.js'

const router = useRouter()

const title = ref('')
const content = ref('')
const imageFiles = ref([])
const errorMsg = ref('')
const submitting = ref(false)

function getPreviewUrl(file) {
  return URL.createObjectURL(file)
}

function handleFileSelect(e) {
  const files = Array.from(e.target.files || [])
  const remaining = 9 - imageFiles.value.length
  imageFiles.value.push(...files.slice(0, remaining))
  e.target.value = ''
}

function handleDrop(e) {
  const files = Array.from(e.dataTransfer.files || []).filter((f) =>
    f.type.startsWith('image/')
  )
  const remaining = 9 - imageFiles.value.length
  imageFiles.value.push(...files.slice(0, remaining))
}

function removeImage(index) {
  imageFiles.value.splice(index, 1)
}

async function handleSubmit() {
  if (submitting.value) return
  submitting.value = true
  errorMsg.value = ''

  try {
    const formData = new FormData()
    formData.append('title', title.value.trim())
    formData.append('content', content.value.trim())
    imageFiles.value.forEach((file) => {
      formData.append('images', file)
    })

    const token = localStorage.getItem('tantalus_token')

    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) {
      throw new Error(data.message || '发布失败')
    }

    router.push('/posts')
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    submitting.value = false
  }
}
</script>
