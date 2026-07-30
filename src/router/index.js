import { createRouter, createWebHistory } from "vue-router";
import field from "@/views/field.vue";
import home from "@/views/homePage.vue";
import About from "@/views/About.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Profile from "@/views/Profile.vue";
import MessageBoard from "@/views/MessageBoard.vue";
import ContactPage from "@/views/ContactPage.vue";
import Posts from "@/views/Posts.vue";
import PostCreate from "@/views/PostCreate.vue";
import PostDetail from "@/views/PostDetail.vue";

const routes = [
  { path: "/", component: home },
  { path: "/test", component: field },
  { path: "/about", component: About },
  { path: "/login", component: Login, meta: { guestOnly: true } },
  { path: "/register", component: Register, meta: { guestOnly: true } },
  { path: "/profile", component: Profile, meta: { requiresAuth: true } },
  { path: "/board", component: MessageBoard },
  { path: "/contact", component: ContactPage },
  { path: "/posts", component: Posts },
  { path: "/posts/new", component: PostCreate, meta: { requiresAuth: true } },
  { path: "/posts/:id", component: PostDetail }
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("tantalus_token");

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else if (to.meta.guestOnly && token) {
    next("/");
  } else {
    next();
  }
});
