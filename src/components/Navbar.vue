<template>
  <div
    ref="navContainerRef"
    class="fixed inset-x-0 top-0 z-50 border-b bg-background/80 backdrop-blur-md transition-all duration-300"
  >
    <div
      class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
    >
      <!-- Left section -->
      <div class="flex items-center gap-4">
        <!-- Home button -->
        <router-link
          to="/"
          class="flex h-9 w-9 items-center justify-center rounded-full bg-foreground/10 text-foreground transition-colors hover:bg-foreground/20"
          aria-label="homepage"
        >
          <Icon icon="lucide:home" class="h-4 w-4" />
        </router-link>

        <!-- Desktop Nav -->
        <div class="hidden md:flex items-center gap-6">
          <router-link
            v-for="(item, index) in navItems"
            :key="index"
            :to="item.to"
            class="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            {{ item.label }}
          </router-link>
        </div>
      </div>

      <!-- Right section -->
      <div class="flex items-center gap-2">
        <!-- Auth: Desktop -->
        <template v-if="isAuthenticated">
          <!-- 发布新内容 -->
          <Button
            size="icon"
            as-child
            class="hidden md:inline-flex rounded-full bg-black text-white hover:bg-black/80"
          >
            <router-link to="/posts/new" aria-label="发布新内容">
              <Icon icon="lucide:plus" class="size-5" />
            </router-link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                variant="ghost"
                class="hidden md:inline-flex items-center gap-2 rounded-full text-foreground"
              >
                <Avatar class="size-7">
                  <AvatarFallback
                    class="bg-primary text-xs text-primary-foreground"
                  >
                    {{ userInitials }}
                  </AvatarFallback>
                </Avatar>
                <span class="max-w-24 truncate text-sm">{{ user.name }}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent class="w-56" align="end">
              <DropdownMenuLabel class="font-normal">
                <div class="flex flex-col space-y-1">
                  <p class="text-sm font-medium leading-none">
                    {{ user.name }}
                  </p>
                  <p class="text-xs leading-none text-muted-foreground">
                    {{ user.email }}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem as-child>
                <router-link
                  to="/profile"
                  class="flex w-full cursor-pointer items-center gap-2"
                >
                  <Icon icon="lucide:user" class="h-4 w-4" />
                  个人中心
                </router-link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                class="cursor-pointer text-destructive focus:text-destructive"
                @click="handleLogout"
              >
                <Icon icon="lucide:log-out" class="h-4 w-4" />
                退出登录
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </template>
        <template v-else>
          <div class="hidden md:flex items-center gap-2">
            <Button variant="ghost" as-child class="text-foreground">
              <router-link to="/login">登录</router-link>
            </Button>
            <Button as-child>
              <router-link to="/register">注册</router-link>
            </Button>
          </div>
        </template>

        <!-- Audio indicator -->
        <Button
          variant="ghost"
          size="icon"
          class="relative text-foreground"
          @click="toggleAudioIndicator"
        >
          <audio
            ref="audioElementRef"
            class="hidden"
            src="/audio/loop.mp3"
            loop
          />
          <div v-if="isIndicatorActive">
            <div class="flex items-end gap-[2px] h-4">
              <div
                v-for="bar in 4"
                :key="bar"
                class="w-[2px] rounded-full transition-all"
                :class="isIndicatorActive ? 'bg-current animate-pulse' : 'bg-current/40'"
                :style="{ height: `${3 + bar * 3}px`,animationDelay: `${bar * 0.15}s`,animationDuration: '0.6s',}"
              />
            </div>
          </div>
          <div v-else>
            <span>播放</span>
          </div>
        </Button>

        <!-- Mobile: Sheet -->
        <Sheet>
          <SheetTrigger as-child>
            <Button
              variant="ghost"
              size="icon"
              class="md:hidden text-foreground"
            >
              <Icon icon="lucide:menu" class="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader class="mb-6">
              <SheetTitle class="special-font font-zentry text-xl">
                  骑士团长
              </SheetTitle>
              <SheetDescription>选择你想去的页面</SheetDescription>
            </SheetHeader>

            <div class="flex flex-col gap-4">
              <!-- Mobile nav links -->
              <div class="space-y-1">
                <p class="px-2 text-xs font-medium text-muted-foreground">
                  导航
                </p>
                <router-link
                  v-for="(item, index) in navItems"
                  :key="index"
                  :to="item.to"
                  class="flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <Icon :icon="item.icon" class="h-4 w-4" />
                  {{ item.label }}
                </router-link>
              </div>

              <Separator />

              <!-- Mobile auth -->
              <div class="space-y-1">
                <p class="px-2 text-xs font-medium text-muted-foreground">
                  账号
                </p>
                <template v-if="isAuthenticated">
                  <router-link
                    to="/posts/new"
                    class="flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    <Icon icon="lucide:plus" class="h-4 w-4" />
                    发布新内容
                  </router-link>
                  <router-link
                    to="/profile"
                    class="flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    <Icon icon="lucide:user" class="h-4 w-4" />
                    个人中心
                  </router-link>
                  <button
                    class="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-destructive transition-colors hover:bg-accent"
                    @click="handleLogout"
                  >
                    <Icon icon="lucide:log-out" class="h-4 w-4" />
                    退出登录
                  </button>
                </template>
                <template v-else>
                  <router-link
                    to="/login"
                    class="flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    <Icon icon="lucide:log-in" class="h-4 w-4" />
                    登录
                  </router-link>
                  <router-link
                    to="/register"
                    class="flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent"
                  >
                    <Icon icon="lucide:user-plus" class="h-4 w-4" />
                    注册
                  </router-link>
                </template>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useWindowScroll } from "@vueuse/core";
import { Icon } from "@iconify/vue";
import { useAuth } from "@/composables/useAuth.js";

import { Button } from "@/components/ui/button/index.js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar/index.js";
import { Separator } from "@/components/ui/separator/index.js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu/index.js";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet/index.js";

const { user, isAuthenticated, logout } = useAuth();

const navItems = [
  { label: "帖子", icon: "lucide:file-text", to: "/posts" },
  { label: "留言板", icon: "lucide:message-square", to: "/board" },
  { label: "关于", icon: "lucide:info", to: "/about" },
  { label: "联系", icon: "lucide:mail", to: "/contact" },
];

const userInitials = computed(() => {
  if (!user.value) return "?";
  return user.value.name.slice(0, 2).toUpperCase();
});

const audioElementRef = ref(null);
const navContainerRef = ref(null);
const { y: currentScrollY } = useWindowScroll();
const isNavVisible = ref(true);
const lastScrollY = ref(0);
const isAudioPlaying = ref(false);
const isIndicatorActive = ref(false);

const toggleAudioIndicator = () => {
  isAudioPlaying.value = !isAudioPlaying.value;
  isIndicatorActive.value = !isIndicatorActive.value;
};

const handleLogout = () => {
  logout();
};

watch(isAudioPlaying, (val) => {
  if (!audioElementRef.value) return;
  val ? audioElementRef.value.play() : audioElementRef.value.pause();
});

watch(
  currentScrollY,
  (y, oldY) => {
    if (y === 0) {
      isNavVisible.value = true;
    } else if (y > lastScrollY.value) {
      isNavVisible.value = false;
    } else if (y < lastScrollY.value) {
      isNavVisible.value = true;
    }
    lastScrollY.value = y;
  },
  { immediate: true },
);

watch(isNavVisible, (val) => {
  if (navContainerRef.value) {
    navContainerRef.value.style.transform = val
      ? "translateY(0)"
      : "translateY(-100%)";
    navContainerRef.value.style.opacity = val ? "1" : "0";
  }
});
</script>
