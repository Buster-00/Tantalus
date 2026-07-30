<template>
  <div class="relative h-dvh w-screen overflow-x-hidden">
    <div
      v-if="loading"
      class="flex-center absolute z-[100] h-dvw w-screen overflow-hidden bg-violet-50"
    >
      <div class="three-body">
        <div class="three-body__dot"></div>
        <div class="three-body__dot"></div>
        <div class="three-body__dot"></div>
      </div>
    </div>

    <div
      id="video-frame"
      class="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75"
    >
      <div>
        <video
          ref="nextVdRef"
          src="/videos/hero-1.mp4"
          loop
          muted
          autoplay
          id="next-video"
          class="absolute-center absolute z-20 size-128 object-cover object-center"
          @loadeddata="handleVideoLoad"
        />
      </div>

      <div class="absolute left-0 top-0 z-40 size-full">
        <div
          class="flex flex-col items-start justify-between h-full px-5 sm:px-10 py-10"
        >
          <div class="mt-24 max-w-lg">
            <h1 class="special-font hero-heading text-blue-100">
              你好，<br />骑士团长
            </h1>

            <p
              class="mb-5 mt-10 font-robert-regular text-blue-100 text-left max-w-128 px-3"
            >
              每个人都有属于自己的一片森林，<br />迷失的人迷失了，相逢的人会再相逢。
            </p>
          </div>

          <div class="mb-10">
            <Button
              id="watch-trailer"
              title="窥视内心"
              container-class="flex justify-center items-center"
              @click="handleHeartClick"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import Button from "./Button.vue";

gsap.registerPlugin(ScrollTrigger);

const hasClicked = ref(false);
const loading = ref(true);
const nextVdRef = ref(null);
const isRotated = ref(false);
const rotateAmount = ref(0);

function handleVideoLoad() {
  loading.value = false;
}

const handleHeartClick = () => {
  isRotated.value = !isRotated.value;
  // 每次累加正向角度，确保始终顺时针旋转
  rotateAmount.value += isRotated.value ? 300 : 60;
  gsap.to("#next-video", {
    rotate: rotateAmount.value,
    duration: 1,
    ease: "power1.inOut",
  });
};

watch(hasClicked, (val) => {
  if (!val) return;

  gsap.set("#next-video", { visibility: "visible" });
  gsap.to("#next-video", {
    transformOrigin: "center center",
    scale: 1,
    width: "100%",
    height: "100%",
    duration: 1,
    ease: "power1.inOut",
    onStart: () => nextVdRef.value?.play(),
  });
  gsap.from("#current-video", {
    transformOrigin: "center center",
    scale: 0,
    duration: 1.5,
    ease: "power1.inOut",
  });
});

onMounted(() => {
  // 初始化视频帧
  gsap.set("#video-frame", {
    clipPath: "polygon(14% 50%, 72% 0, 88% 90%, 0 65%)",
    borderRadius: "0% 0% 40% 10%",
  });

  // 动画视频帧
  gsap.from("#video-frame", {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    borderRadius: "0% 0% 0% 0%",
    ease: "power1.inOut",
    scrollTrigger: {
      trigger: "#video-frame",
      start: "center center",
      end: "bottom center",
      scrub: true,
    },
  });
});
</script>
