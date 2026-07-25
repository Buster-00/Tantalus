<template>
  <div id="about" class="min-h-screen w-screen">
    <div class="relative mb-8 mt-36 flex flex-col items-center gap-5">
      <p class="font-general text-sm uppercase md:text-[14px]">
        从地下的世界
      </p>

      <AnimatedTitle
        title="开始<br />生存战略<br /> 和 <b>海边</b>卡夫卡"
        container-class="mt-5 !text-black text-center"
      />

      <div class="about-subtext">
        <p class="text-gray-500">
          名叫乌鸦的少年消逝在东京塔下
        </p>
      </div>
    </div>

    <div class="h-dvh w-screen" id="clip">
      <div class="mask-clip-path about-image">
        <img
          src="/img/tokyoTower.jpg"
          alt="Background"
          class="absolute left-0 top-0 size-full object-cover"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'
import AnimatedTitle from './AnimatedTitle.vue'

gsap.registerPlugin(ScrollTrigger)

onMounted(() => {
  const clipAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: '#clip',
      start: 'center center',
      end: '+=800 center',
      scrub: 0.5,
      pin: true,
      pinSpacing: true,
    },
  })

  clipAnimation.to('.mask-clip-path', {
    width: '100vw',
    height: '100vh',
    borderRadius: 0,
  })
})
</script>
