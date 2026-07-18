import { createRouter, createWebHistory } from "vue-router";
import field from "@/views/field.vue";
import home from "@/views/home.vue";
import About from "@/views/About.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Profile from "@/views/Profile.vue";

const routes = [
  { path: "/", component: home },
  { path: "/test", component: field },
  { path: "/about", component: About },
  { path: "/login", component: Login, meta: { guestOnly: true } },
  { path: "/register", component: Register, meta: { guestOnly: true } },
  { path: "/profile", component: Profile, meta: { requiresAuth: true } },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("awwwards_token");

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else if (to.meta.guestOnly && token) {
    next("/");
  } else {
    next();
  }
});
