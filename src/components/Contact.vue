<template>
  <div id="contact" class="my-20 min-h-96 w-screen px-10">
    <div class="relative rounded-lg bg-black py-24 text-blue-50 sm:overflow-hidden">
      <div class="absolute -left-20 top-0 hidden h-full w-72 overflow-hidden sm:block lg:left-20 lg:w-96">
        <ImageClipBox src="/img/kfc.png" clip-class="contact-clip-path-1" />
        <ImageClipBox
          src="/img/nhk.jpg"
          clip-class="contact-clip-path-2 ©lg:translate-y-40 translate-y-60"
        />
      </div>

      <div class="absolute -top-40 left-20 w-60 sm:top-1/2 md:left-auto md:right-10 lg:top-20 lg:w-80">
        <ImageClipBox src="/img/johnwalker.png" clip-class="absolute md:scale-125" />
      </div>

      <div class="flex flex-col items-center text-center">
        <p class="mb-10 font-general text-[10px] uppercase">
          让我们在海边相见吧
        </p>

        <AnimatedTitle
          title="让我们<br/>在没有黑暗的</br>地方</br>相见"
          container-class="special-font !md:text-[6.2rem] w-full font-zentry !text-5xl !font-black !leading-[.9]"
        />

        <Button title="再见" container-class="mt-10 cursor-pointer" />
      </div>
    </div>

    <div class="mx-auto mt-16 max-w-2xl text-center">
      <div class="grid gap-6 sm:grid-cols-3">
        <div class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <Icon icon="lucide:mail" class="mx-auto mb-3 size-6 text-blue-300" />
          <p class="font-robert-medium text-sm font-semibold text-white">
            邮箱
          </p>
          <p class="mt-1 font-robert-regular text-xs text-white/60">
            hello@tantalus.dev
          </p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <Icon icon="lucide:github" class="mx-auto mb-3 size-6 text-blue-300" />
          <p class="font-robert-medium text-sm font-semibold text-white">
            GitHub
          </p>
          <p class="mt-1 font-robert-regular text-xs text-white/60">
            @tantalus
          </p>
        </div>
        <div class="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
          <Icon icon="lucide:message-circle" class="mx-auto mb-3 size-6 text-blue-300" />
          <p class="font-robert-medium text-sm font-semibold text-white">
            留言板
          </p>
          <p class="mt-1 font-robert-regular text-xs text-white/60">
            随时给我留言
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import AnimatedTitle from './AnimatedTitle.vue'
import Button from './Button.vue'
import ImageClipBox from './ImageClipBox.vue'
</script>
