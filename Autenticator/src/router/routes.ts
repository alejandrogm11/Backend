import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: {requiresAuth: true},
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },



  // Layout de inicio de sesión
  {
    path: '/auth/login',
    component: () => import('layouts/LoginLayout.vue')
  },


    // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },

];

export default routes;
