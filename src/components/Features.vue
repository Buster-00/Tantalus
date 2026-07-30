<template>
  <section class="bg-orange-500 pb-52">
    <div class="container mx-auto px-3 md:px-10">
      <div class="px-5 py-32">
        <p class="font-circular-web text-lg text-blue-50">
          直到地下，命运的列车在此交汇
        </p>
        <p class="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
          没有人知道下一班列车会驶向何处。甜蜜的苹果气味四溢在列车站台。
        </p>
      </div>

      <BentoTilt class="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
        <BentoCard
          src="/videos/feature-1.gif"
        />
      </BentoTilt>

      <div class="grid h-[200vh] w-full grid-cols-2 grid-rows-3 gap-7">
        <BentoTilt class="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
          <BentoCard
            src="/videos/feature-2.gif"
          />
        </BentoTilt>

        <BentoTilt class="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0">
          <BentoCard
            src="/videos/feature-3.gif"
          />
        </BentoTilt>

        <BentoTilt class="bento-tilt_1 me-14 md:col-span-1 md:me-0">
          <BentoCard
            src="/videos/feature-4.gif"
          />
        </BentoTilt>

        <BentoTilt class="bento-tilt_2">
          <div class="flex size-full flex-col justify-between bg-white p-5">
            <h1 class="bento-title special-font max-w-64 text-black">
              暴<b>风</b>雨<b>将</b>至。
            </h1>

            <Icon icon="ti:location-arrow" class="m-5 scale-[5] self-end" />
          </div>
        </BentoTilt>

        <BentoTilt class="bento-tilt_2">
          <img
            src="/videos/feature-5.gif"
            class="size-full object-cover object-center"
          />
        </BentoTilt>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Icon } from '@iconify/vue'
import BentoTilt from './BentoTilt.vue'
import BentoCard from './BentoCard.vue'
</script>
