// single pages
import HomePage from "@/pages/Home.vue";
import AuctionPage from "@/pages/Auction.vue";
import PowPage from "@/pages/Pow.vue";
import PosPage from "@/pages/Pos.vue";
import ValidatorDetailpage from "@/pages/ValidatorDetail.vue";
import BlockDetailpage from "@/pages/BlockDetail.vue";
import TransactionDetailPage from "@/pages/TransactionDetail.vue";
import AddressPage from "@/pages/Address.vue";
import PowRewardsPage from "@/pages/PowRewards.vue";
import PosRewardsPage from "@/pages/PosRewards.vue";
import AuctionDetailPage from "@/pages/AuctionDetail.vue";
import BlockListPage from "@/pages/BlockList.vue";
import TxListPage from "@/pages/TxList.vue";

import notFoundPage from "../pages/NotFound.vue";
import { routePropResolver } from "./util";
import { DOMAIN_TITLE } from "../.env";

export const routes = [
  {
    path: "/",
    name: "home",
    component: HomePage,
    meta: { title: `${DOMAIN_TITLE} | Explorer` }
  },
  {
    path: "/auction",
    name: "auction",
    component: AuctionPage,
    meta: { title: `${DOMAIN_TITLE} | Auctions` }
  },
  {
    path: "/auction/:auctionID",
    name: "auctionDetail",
    component: AuctionDetailPage,
    meta: { title: `${DOMAIN_TITLE} | Auction ` }
  },
  {
    path: "/pow",
    name: "pow",
    component: PowPage,
    meta: { title: `${DOMAIN_TITLE} | PoW` }
  },
  {
    path: "/pow/rewards/:epoch",
    name: "pow-rewards",
    component: PowRewardsPage,
    meta: { title: `${DOMAIN_TITLE} | Mining Rewards` }
  },

  {
    path: "/pos",
    name: "pos",
    component: PosPage,
    meta: { title: `${DOMAIN_TITLE} | PoS` }
  },
  {
    path: "/pos/rewards/:epoch",
    name: "pos-rewards",
    component: PosRewardsPage,
    meta: { title: `${DOMAIN_TITLE} | Epoch Reward` }
  },
  {
    path: "/validator/:id",
    name: "validatorDetail",
    component: ValidatorDetailpage,
    meta: { title: `${DOMAIN_TITLE} | Validator` }
  },
  {
    path: "/address/:address",
    name: "address",
    component: AddressPage,
    meta: { title: `${DOMAIN_TITLE} | Address` }
  },
  {
    path: "/block/:revision",
    name: "blockDetail",
    component: BlockDetailpage,
    meta: { title: `${DOMAIN_TITLE} | Block` }
  },
  {path:"/blocks",
name:"BlockList",
component: BlockListPage,
meta: {title: `${DOMAIN_TITLE} | Blocks`}},
  {path:"/txs",
name:"TxList",
component: TxListPage,
meta: {title: `${DOMAIN_TITLE} | Txs`}},
 
  {
    path: "/tx/:hash",
    name: "txDetail",
    component: TransactionDetailPage,
    meta: { title: `${DOMAIN_TITLE} | Transaction` }
  },
  {
    path: "*",
    component: notFoundPage,
    meta: { title: `${DOMAIN_TITLE} | Not Found` }
  }
];
