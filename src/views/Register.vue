<template>
  <div class="flex min-h-screen items-center justify-center bg-violet-50 px-4 py-20 sm:px-10">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <CardTitle class="special-font font-zentry text-3xl uppercase">注册</CardTitle>
        <CardDescription>开启你的骑士之旅</CardDescription>
      </CardHeader>

      <CardContent>
        <div v-if="errorMsg" class="mb-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {{ errorMsg }}
        </div>

        <form class="space-y-4" @submit.prevent="handleRegister">
          <div class="space-y-2">
            <Label for="name">昵称</Label>
            <Input id="name" v-model="name" type="text" placeholder="你的名字" required />
          </div>
          <div class="space-y-2">
            <Label for="email">邮箱</Label>
            <Input id="email" v-model="email" type="email" placeholder="your@email.com" required />
          </div>
          <div class="space-y-2">
            <Label for="password">密码</Label>
            <Input id="password" v-model="password" type="password" placeholder="至少 6 位" required minlength="6" />
          </div>
          <Button type="submit" :disabled="loading" class="w-full">
            {{ loading ? '注册中...' : '注册' }}
          </Button>
        </form>
      </CardContent>

      <CardFooter class="justify-center">
        <p class="text-sm text-muted-foreground">
          已有账号？
          <router-link to="/login" class="font-medium text-primary underline-offset-4 hover:underline">
            立即登录
          </router-link>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card/index.js'
import { Input } from '@/components/ui/input/index.js'
import { Label } from '@/components/ui/label/index.js'
import { Button } from '@/components/ui/button/index.js'

const { register } = useAuth()
const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

async function handleRegister() {
  errorMsg.value = ''
  loading.value = true
  try {
    await register(name.value, email.value, password.value)
    router.push('/')
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}
</script>
