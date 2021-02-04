import Vue from "vue";
import Router from "vue-router";

// import NProgress from 'nprogress'

import {
  initCurrentUserStateMiddleware,
  checkAccessMiddleware,
  setPageTitleMiddleware,
  redirectNetwork,
} from "./middlewares";
import { routes } from "./routes";

Vue.use(Router);

const router = new Router({
  linkActiveClass: "is-active",
  mode: "history",
  routes,
});

router.beforeEach((to, from, next) => {
  let { network } = to.params;
  if (!network) {
    network = "main";
  }
  next();
});

// router.beforeEach(initCurrentUserStateMiddleware)
// router.beforeEach(checkAccessMiddleware)
router.beforeEach(setPageTitleMiddleware);
// router.beforeEach(redirectNetwork)

// router.beforeEach((to, from, next) => {
//   NProgress.start()
//   next()
// })

// router.afterEach(transition => {
//   NProgress.done()
// })

export default router;
