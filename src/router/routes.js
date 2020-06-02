// profile
import profilePage from "../pages/profile/ProfilePage.vue";
import profilePostsPage from "../pages/profile/ProfilePostsPage.vue";

// single pages
import homePage from "../pages/Home.vue";
import auctionPage from "../pages/Auction.vue";
import newsPage from "../pages/news/NewsPage.vue";
import loginPage from "../pages/Login.vue";
import notFoundPage from "../pages/NotFound.vue";

import { routePropResolver } from "./util";
import { DOMAIN_TITLE } from "../.env";

export const routes = [
  {
    path: "/",
    name: "index",
    component: homePage,
    meta: { title: `${DOMAIN_TITLE} | home` }
  },
  {
    path: "/auction",
    name: "action",
    component: auctionPage,
    meta: { title: `${DOMAIN_TITLE} | auction` }
  },
  {
    path: "/news",
    name: "news",
    component: newsPage,
    meta: { title: `${DOMAIN_TITLE} | news` },
    props: routePropResolver
  },
  {
    path: "/profile",
    component: profilePage,
    meta: { isAuth: true, title: `${DOMAIN_TITLE} | profile` },
    children: [
      {
        path: "",
        name: "profile",
        component: profilePostsPage
      }
    ]
  },
  {
    path: "/login",
    name: "login",
    component: loginPage,
    meta: { title: `${DOMAIN_TITLE} | login` }
  },
  {
    path: "*",
    component: notFoundPage,
    meta: { title: `${DOMAIN_TITLE} | not found` }
  }
];
