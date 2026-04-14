import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuthStore } from 'src/stores/auth';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach((to) => {
    const authStore = useAuthStore();

    // Ruta pública → siempre dejar pasar
    if (!to.meta.requiresAuth) return true;

    // Ruta protegida y autenticado → dejar pasar
    if (authStore.isAuthenticated) return true;

    // Ruta protegida y sin sesión → login
    // Guardamos la ruta a la que intentaba ir para redirigir tras login
    return {
      path: '/auth/login',
      query: { redirect: to.fullPath },
    };
  });

  return Router;
});
