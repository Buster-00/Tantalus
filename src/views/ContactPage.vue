<template>
  <div class="min-h-screen bg-violet-50">
    <!-- Hero 区 -->
    <div class="relative overflow-hidden bg-black px-6 py-32 sm:py-40 lg:px-8">
      <div class="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl" />
      <div class="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl" />

      <div class="relative mx-auto max-w-3xl text-center">
        <h1 class="special-font font-zentry text-5xl font-black uppercase text-blue-100 md:text-7xl">
          联系我们
        </h1>
        <p class="mt-6 font-robert-regular text-lg leading-relaxed text-blue-100/70">
          无论你是想聊聊想法、提出建议，<br />
          还是只是想打个招呼，我们都在这里。
        </p>
      </div>
    </div>

    <!-- 联系卡片 -->
    <div class="mx-auto max-w-5xl px-6 py-24 sm:px-10">
      <div class="grid gap-8 md:grid-cols-3">
        <div
          v-for="item in contacts"
          :key="item.title"
          class="rounded-2xl border border-white/10 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
        >
          <div class="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10">
            <Icon :icon="item.icon" class="size-6 text-primary" />
          </div>
          <h3 class="font-zentry text-lg font-semibold text-black">{{ item.title }}</h3>
          <p class="mt-2 font-robert-regular text-sm text-gray-500">{{ item.desc }}</p>
          <p class="mt-3 font-robert-medium text-sm text-black">{{ item.value }}</p>
        </div>
      </div>

      <!-- 留言引导 -->
      <div class="mt-16 text-center">
        <p class="font-robert-regular text-base text-gray-500">
          也可以在留言板给我留言
        </p>
        <Button as-child class="mt-4">
          <router-link to="/board">去留言板</router-link>
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button/index.js'

const contacts = [
  {
    icon: 'lucide:mail',
    title: '邮箱',
    desc: '随时给我发邮件',
    value: 'hello@tantalus.dev',
  },
  {
    icon: 'lucide:github',
    title: 'GitHub',
    desc: '看看我的开源项目',
    value: '@tantalus',
  },
  {
    icon: 'lucide:message-circle',
    title: '留言板',
    desc: '在网站上给我留言',
    value: '随时留言',
  },
]
</script>
