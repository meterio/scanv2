// single pages
import homePage from "../pages/Home.vue";
import auctionPage from "../pages/Auction.vue";
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
    path: "*",
    component: notFoundPage,
    meta: { title: `${DOMAIN_TITLE} | not found` }
  }
];
