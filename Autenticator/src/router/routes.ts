import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  // Layout de inicio de sesión
  {
    path: '/auth/login',
    component: () => import('layouts/LoginLayout.vue'),
    meta: { requiresAuth: false },
  },

  // Layout de registro de cuenta
  {
    path: '/signup',
    component: () => import('layouts/SignUpLayout.vue'),
    meta: { requiresAuth: false },
  },
  // Página de inicio después de iniciar sesión
  {
    path: '/home',
    component: () => import('layouts/HomeLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
    meta: { requiresAuth: true },
  },

  {
    path: '/dashboard/admin',
    component: () => import('layouts/HomeLayout.vue'),
    children: [{ path: '', component: () => import('pages/AdminDashboard.vue') }],
    meta: { requiresAuth: true },
  },


  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },

];

export default routes;
