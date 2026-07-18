<template>
  <div class="min-h-screen bg-violet-50 px-4 py-24 sm:px-10">
    <div class="mx-auto max-w-4xl">
      <div class="mb-8">
        <h1
          class="special-font font-zentry text-4xl font-black uppercase text-black"
        >
          个人中心
        </h1>
        <p class="mt-1 font-robert-regular text-sm text-muted-foreground">
          管理你的个人信息和账号设置
        </p>
      </div>

      <div class="grid gap-8 lg:grid-cols-[280px_1fr]">
        <!-- 左侧 -->
        <div class="space-y-6">
          <Card>
            <CardContent class="flex flex-col items-center pt-6">
              <Avatar class="mb-4 size-20" size="lg">
                <AvatarFallback
                  class="bg-primary text-3xl font-bold text-primary-foreground"
                >
                  {{ userInitials }}
                </AvatarFallback>
              </Avatar>
              <h2 class="font-zentry text-xl font-semibold">
                {{ user?.name }}
              </h2>
              <p class="text-sm text-muted-foreground">{{ user?.email }}</p>
              <Separator class="my-4" />
              <div class="flex w-full items-center justify-between text-sm">
                <span class="text-muted-foreground">注册时间</span>
                <span class="font-medium">{{
                  formatDate(user?.createdAt)
                }}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent class="p-4">
              <Button
                variant="destructive"
                class="w-full justify-start gap-2"
                @click="handleLogout"
              >
                <Icon icon="lucide:log-out" class="h-4 w-4" />退出登录
              </Button>
            </CardContent>
          </Card>
        </div>

        <!-- 右侧 -->
        <div class="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>编辑资料</CardTitle>
              <CardDescription>修改你的昵称和邮箱地址</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                v-if="profileMsg"
                class="mb-6 rounded-lg px-4 py-3 text-sm"
                :class="
                  profileMsgType === 'success'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-destructive/10 text-destructive'
                "
              >
                {{ profileMsg }}
              </div>
              <form class="space-y-4" @submit.prevent="handleUpdateProfile">
                <div class="space-y-2">
                  <Label for="display-name">昵称</Label>
                  <Input id="display-name" v-model="displayName" required />
                </div>
                <div class="space-y-2">
                  <Label for="display-email">邮箱</Label>
                  <Input
                    id="display-email"
                    v-model="displayEmail"
                    type="email"
                    required
                  />
                </div>
                <Button type="submit" :disabled="profileLoading">
                  {{ profileLoading ? "保存中..." : "保存修改" }}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>修改密码</CardTitle>
              <CardDescription>设置一个新密码</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                v-if="passwordMsg"
                class="mb-6 rounded-lg px-4 py-3 text-sm"
                :class="
                  passwordMsgType === 'success'
                    ? 'bg-primary/10 text-primary'
                    : 'bg-destructive/10 text-destructive'
                "
              >
                {{ passwordMsg }}
              </div>
              <form class="space-y-4" @submit.prevent="handleChangePassword">
                <div class="space-y-2">
                  <Label for="current-password">当前密码</Label>
                  <Input
                    id="current-password"
                    v-model="currentPassword"
                    type="password"
                    required
                    placeholder="••••••••"
                  />
                </div>
                <div class="space-y-2">
                  <Label for="new-password">新密码</Label>
                  <Input
                    id="new-password"
                    v-model="newPassword"
                    type="password"
                    required
                    minlength="6"
                    placeholder="至少 6 位"
                  />
                </div>
                <Button type="submit" :disabled="passwordLoading">
                  {{ passwordLoading ? "更新中..." : "更新密码" }}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Icon } from "@iconify/vue";
import { useAuth } from "@/composables/useAuth.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card/index.js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar/index.js";
import { Button } from "@/components/ui/button/index.js";
import { Input } from "@/components/ui/input/index.js";
import { Label } from "@/components/ui/label/index.js";
import { Separator } from "@/components/ui/separator/index.js";

const { user, isAuthenticated, logout, updateProfile, changePassword } =
  useAuth();
const router = useRouter();

if (!isAuthenticated.value) {
  router.replace("/login");
}

const userInitials = computed(() => {
  if (!user.value) return "?";
  return user.value.name.slice(0, 2).toUpperCase();
});

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const displayName = ref(user.value?.name || "");
const displayEmail = ref(user.value?.email || "");
const profileMsg = ref("");
const profileMsgType = ref("success");
const profileLoading = ref(false);

async function handleUpdateProfile() {
  profileMsg.value = "";
  profileLoading.value = true;
  try {
    await updateProfile({ name: displayName.value, email: displayEmail.value });
    profileMsgType.value = "success";
    profileMsg.value = "资料更新成功！";
  } catch (e) {
    profileMsgType.value = "error";
    profileMsg.value = e.message;
  } finally {
    profileLoading.value = false;
  }
}

const currentPassword = ref("");
const newPassword = ref("");
const passwordMsg = ref("");
const passwordMsgType = ref("success");
const passwordLoading = ref(false);

async function handleChangePassword() {
  passwordMsg.value = "";
  passwordLoading.value = true;
  try {
    await changePassword(currentPassword.value, newPassword.value);
    passwordMsgType.value = "success";
    passwordMsg.value = "密码修改成功！";
    currentPassword.value = "";
    newPassword.value = "";
  } catch (e) {
    passwordMsgType.value = "error";
    passwordMsg.value = e.message;
  } finally {
    passwordLoading.value = false;
  }
}

function handleLogout() {
  logout();
}
</script>
