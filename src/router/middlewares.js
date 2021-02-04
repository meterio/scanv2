import $store from "../store";
import { AuthService } from "@/services/auth.service";

/**
 * Current user state initialization
 * @WARN Must be always first in middleware chain
 */
export async function initCurrentUserStateMiddleware(to, from, next) {
  const currentUserId = $store.state.user.currentUser.id;

  if (AuthService.hasRefreshToken() && !currentUserId) {
    try {
      await AuthService.debounceRefreshTokens();
      await $store.dispatch("user/getCurrent");
      next();
    } catch (e) {
      console.log(e);
    }
  } else {
    next();
  }
}

/**
 * Check access permission to auth routes
 */
export function checkAccessMiddleware(to, from, next) {
  const currentUserId = $store.state.user.currentUser.id;
  const isAuthRoute = to.matched.some((item) => item.meta.isAuth);

  if (isAuthRoute && currentUserId) return next();
  if (isAuthRoute) return next({ name: "login" });
  next();
}

export function setPageTitleMiddleware(to, from, next) {
  const pageTitle = to.matched.find((item) => item.meta.title);

  if (pageTitle) window.document.title = pageTitle.meta.title;
  next();
}

export function redirectNetwork(to, from, next) {
  const { network } = to.params;
  console.log($store.state);
  const curNetwork = $store.state.dom.network;
  console.log("CUR NETWORK:", curNetwork);
  const tgtNetwork = curNetwork || from.params.network || "main";

  if (!network) {
    $store.dispatch("dom/changeNetwork", tgtNetwork);
    next({ path: `/${tgtNetwork}${to.fullPath}` });
  } else {
    if (network !== "main" && network !== "test") {
      $store.dispatch("dom/changeNetwork", tgtNetwork);
      next({ path: `/${tgtNetwork}${to.fullPath}` });
    }

    $store.dispatch("dom/changeNetwork", network);
    next();
  }
}
