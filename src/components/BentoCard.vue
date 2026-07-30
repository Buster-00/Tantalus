<template>
  <div class="relative size-full">
    <img
      :src="src"
      class="absolute left-0 top-0 size-full object-cover object-center"
    />
    <div class="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
      <div>
        <h1 class="bento-title special-font" v-html="title"></h1>
        <p v-if="description" class="mt-3 max-w-64 text-xs md:text-base">{{ description }}</p>
      </div>

      <div
        v-if="isComingSoon"
        ref="hoverButtonRef"
        class="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20"
        @mousemove="handleMouseMove"
        @mouseenter="hoverOpacity = 1"
        @mouseleave="hoverOpacity = 0"
      >
        <div
          class="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
          :style="{
            opacity: hoverOpacity,
            background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
          }"
        />
        <Icon icon="ti:location-arrow" class="relative z-20" />
        <p class="relative z-20">coming soon</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Icon } from '@iconify/vue'

defineProps({
  src: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  isComingSoon: Boolean,
})

const cursorPosition = ref({ x: 0, y: 0 })
const hoverOpacity = ref(0)
const hoverButtonRef = ref(null)

const handleMouseMove = (event) => {
  if (!hoverButtonRef.value) return
  const rect = hoverButtonRef.value.getBoundingClientRect()
  cursorPosition.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  }
}
</script>
