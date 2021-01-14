// single pages
import homePage from "@/pages/Home.vue";
import auctionPage from "@/pages/Auction.vue";
import PowPage from "@/pages/Pow.vue";
import PosPage from "@/pages/Pos.vue";
import ValidatorDetailpage from "@/pages/ValidatorDetail.vue";
import BlockDetailpage from "@/pages/BlockDetail.vue";
import TransactionDetailPage from "@/pages/TransactionDetail.vue";
import AddressPage from "@/pages/Address.vue";

import notFoundPage from "../pages/NotFound.vue";
import { routePropResolver } from "./util";
import { DOMAIN_TITLE } from "../.env";

export const routes = [
  {
    path: "/",
    name: "home",
    component: homePage,
    meta: { title: `${DOMAIN_TITLE} | home` }
  },
  {
    path: "/auction",
    name: "auction",
    component: auctionPage,
    meta: { title: `${DOMAIN_TITLE} | auction` }
  },
  {
    path: "/pow",
    name: "pow",
    component: PowPage,
    meta: { title: `${DOMAIN_TITLE} | mining` }
  },
  {
    path: "/pos",
    name: "pos",
    component: PosPage,
    meta: { title: `${DOMAIN_TITLE} | pos` }
  },
  {
    path: "/validator-detail",
    name: "validatorDetail",
    component: ValidatorDetailpage,
    meta: { title: `${DOMAIN_TITLE} | validator detail` }
  },
  {
    path: "/address/:address",
    name: "address",
    component: AddressPage,
    meta: { title: `${DOMAIN_TITLE} | address detail ` }
  },
  {
    path: "/block/:revision",
    name: "blockDetail",
    component: BlockDetailpage,
    meta: { title: `${DOMAIN_TITLE} | block detail` }
  },
  {
    path: "/tx/:hash",
    name: "txDetail",
    component: TransactionDetailPage,
    meta: { title: `${DOMAIN_TITLE} | transaction detail` }
  },
  {
    path: "*",
    component: notFoundPage,
    meta: { title: `${DOMAIN_TITLE} | not found` }
  }
];
