// single pages
import homePage from "@/pages/Home.vue";
import auctionPage from "@/pages/Auction.vue";
import MiningPage from "@/pages/Mining.vue";
import ValidatorPage from "@/pages/Validator.vue";
import ValidatorDetailpage from "@/pages/ValidatorDetail.vue";
import BlockDetailpage from "@/pages/BlockDetail.vue";

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
    path: "/mining",
    name: "mining",
    component: MiningPage,
    meta: { title: `${DOMAIN_TITLE} | mining` }
  },
  {
    path: "/validator",
    name: "validator",
    component: ValidatorPage,
    meta: { title: `${DOMAIN_TITLE} | validator` }
  },
  {
    path: "/validator-detail",
    name: "validatorDetail",
    component: ValidatorDetailpage,
    meta: { title: `${DOMAIN_TITLE} | validator detail` }
  },
  {
    path: "/block-detail",
    name: "BlockDetail",
    component: BlockDetailpage,
    meta: { title: `${DOMAIN_TITLE} | block detail` }
  },
  {
    path: "*",
    component: notFoundPage,
    meta: { title: `${DOMAIN_TITLE} | not found` }
  }
];
