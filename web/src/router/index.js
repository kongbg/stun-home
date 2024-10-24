import { createWebHistory, createRouter } from "vue-router";

const baseRoute = import.meta.env.VITE_APP_BASE_URL || "";

const constantRoutes = [];

const router = createVueRouter();

function createVueRouter() {
  return createRouter({
    history: createWebHistory(baseRoute),
    routes: constantRoutes,
    scrollBehavior(to, from) {
      const mainEle = document.querySelector(".main");
      if (mainEle) {
        mainEle.scrollTop = 0;
      }
    },
  });
}

export const resetRouter = () => {
  const newRouter = createVueRouter();
  router.matcher = newRouter.matcher; //替换成新的空路由
};

export default router;
