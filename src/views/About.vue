<template>
  <div class="min-h-screen bg-violet-50">
    <!-- Hero 区 -->
    <div class="relative overflow-hidden bg-black px-6 py-32 sm:py-40 lg:px-8">
      <div class="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl" />
      <div class="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl" />

      <div class="relative mx-auto max-w-3xl text-center">
        <h1 class="special-font font-zentry text-5xl font-black uppercase text-blue-100 md:text-7xl">
          关于骑士团
        </h1>
        <p class="mt-6 font-robert-regular text-lg leading-relaxed text-blue-100/70">
          每个人心中都有一片森林，也许我们从未去过，<br />
          但它一直在那里，总会在那里。
        </p>
      </div>
    </div>

    <!-- 介绍区 -->
    <div class="mx-auto max-w-5xl px-6 py-24 sm:px-10">
      <div class="grid gap-16 lg:grid-cols-2">
        <div>
          <h2 class="special-font font-zentry text-3xl font-black uppercase text-black">
            我们的故事
          </h2>
          <div class="mt-6 space-y-4 font-robert-regular text-base leading-relaxed text-gray-600">
            <p>
              迷失的人迷失了，相逢的人会再相逢。这个网站诞生于一个简单的想法：
              在数字世界的深处，为每一个迷失的灵魂点亮一盏灯。
            </p>
            <p>
              这里没有喧嚣，没有算法推送。只有精心编织的文字、声音和影像，
              像森林中的小径一样，等你来探索。
            </p>
            <p>
              无论你是在寻找答案，还是只是想找一个安静的角落，
              骑士团的大门永远为你敞开。
            </p>
          </div>
        </div>

        <div class="relative">
          <div class="rounded-2xl border border-white/20 bg-black/5 p-8 backdrop-blur-sm">
            <h3 class="font-zentry text-xl font-semibold text-black">骑士信条</h3>
            <ul class="mt-6 space-y-4">
              <li v-for="item in creeds" :key="item.title" class="flex gap-3">
                <Icon :icon="item.icon" class="mt-0.5 h-5 w-5 shrink-0 text-blue-300" />
                <div>
                  <p class="font-robert-medium text-sm font-semibold text-black">{{ item.title }}</p>
                  <p class="font-robert-regular text-sm text-gray-500">{{ item.desc }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 统计区 -->
      <div class="mt-24 grid grid-cols-2 gap-8 md:grid-cols-4">
        <div v-for="stat in stats" :key="stat.label" class="text-center">
          <p class="special-font font-zentry text-4xl font-black text-black md:text-5xl">
            {{ stat.value }}
          </p>
          <p class="mt-1 font-robert-regular text-sm text-gray-500">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'

const creeds = [
  {
    icon: 'lucide:compass',
    title: '探索',
    desc: '永远保持好奇心，在未知中寻找美好',
  },
  {
    icon: 'lucide:heart',
    title: '真诚',
    desc: '用真实的声音传递有价值的内容',
  },
  {
    icon: 'lucide:tree-pine',
    title: '宁静',
    desc: '在喧嚣的世界中守护一片安静之地',
  },
  {
    icon: 'lucide:users',
    title: '相逢',
    desc: '让每一个迷失的人都能找到归属',
  },
]

const stats = [
  { value: '99%', label: '好评率' },
  { value: '24/7', label: '温暖在线' },
  { value: '∞', label: '探索无限' },
  { value: '1', label: '颗真心' },
]
</script>
