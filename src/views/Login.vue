<template>
  <div class="flex min-h-screen items-center justify-center bg-violet-50 px-4 py-20 sm:px-10">
    <Card class="w-full max-w-md">
      <CardHeader class="text-center">
        <CardTitle class="special-font font-zentry text-3xl uppercase">登录</CardTitle>
        <CardDescription>欢迎回来，骑士</CardDescription>
      </CardHeader>

      <CardContent>
        <div v-if="errorMsg" class="mb-6 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {{ errorMsg }}
        </div>

        <form class="space-y-4" @submit.prevent="handleLogin">
          <div class="space-y-2">
            <Label for="email">邮箱</Label>
            <Input id="email" v-model="email" type="email" placeholder="your@email.com" required />
          </div>
          <div class="space-y-2">
            <Label for="password">密码</Label>
            <Input id="password" v-model="password" type="password" placeholder="••••••••" required />
          </div>
          <Button type="submit" :disabled="loading" class="w-full cursor-pointer select-none">
            {{ loading ? '登录中...' : '登录' }}
          </Button>
        </form>
      </CardContent>

      <CardFooter class="justify-center">
        <p class="text-sm text-muted-foreground">
          还没有账号？
          <router-link to="/register" class="font-medium text-primary underline-offset-4 hover:underline">
            立即注册
          </router-link>
        </p>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth.js'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card/index.js'
import { Input } from '@/components/ui/input/index.js'
import { Label } from '@/components/ui/label/index.js'
import { Button } from '@/components/ui/button/index.js'

const { login } = useAuth()
const router = useRouter()
const email = ref('')
const password = ref('')
const errorMsg = ref('')
const loading = ref(false)

async function handleLogin() {
  errorMsg.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    router.push('/')
  } catch (e) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('asd')
})
</script>
