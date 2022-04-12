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
import EpochListPage from "@/pages/EpochList.vue";
import EpochDetailPage from "@/pages/EpochDetail.vue";
import EpochStatsPage from "@/pages/EpochStats.vue";
import TopMTRAccountsPage from "@/pages/TopMTRAccounts.vue";
import TopMTRGAccountsPage from "@/pages/TopMTRGAccounts.vue";
import BucketPage from "@/pages/Bucket.vue";
import AddressLinkPage from "@/pages/AddressLinkPage.vue";
import StatPage from "@/pages/Stat.vue";
import VerifyPage from "@/pages/Verify.vue";
import TokenAddress from "@/pages/tokenAddress.vue";

import notFoundPage from "../pages/NotFound.vue";
import { DOMAIN_TITLE } from "../.env";

export const routes = [
  {
    path: "/al/:address",
    name: "address-link",
    component: AddressLinkPage,
    meta: { title: `${DOMAIN_TITLE} | Explorer` },
  },
  {
    path: "/",
    name: "home",
    component: HomePage,
    meta: { title: `${DOMAIN_TITLE} | Explorer` },
  },
  {
    path: "/auction",
    name: "auction",
    component: AuctionPage,
    meta: { title: `${DOMAIN_TITLE} | Auctions` },
  },
  {
    path: "/auction/:auctionID",
    name: "auctionDetail",
    component: AuctionDetailPage,
    meta: { title: `${DOMAIN_TITLE} | Auction ` },
  },
  {
    path: "/pow",
    name: "pow",
    component: PowPage,
    meta: { title: `${DOMAIN_TITLE} | PoW` },
  },
  {
    path: "/pow/rewards/:epoch",
    name: "powRewards",
    component: PowRewardsPage,
    meta: { title: `${DOMAIN_TITLE} | Mining Rewards` },
  },

  {
    path: "/pos",
    name: "pos",
    component: PosPage,
    meta: { title: `${DOMAIN_TITLE} | PoS` },
  },
  {
    path: "/pos/rewards/:epoch",
    name: "posRewards",
    component: PosRewardsPage,
    meta: { title: `${DOMAIN_TITLE} | Epoch Reward` },
  },
  {
    path: "/validator/:address",
    name: "validatorDetail",
    component: ValidatorDetailpage,
    meta: { title: `${DOMAIN_TITLE} | Validator` },
  },
  {
    path: "/address/:address",
    name: "address",
    component: AddressPage,
    meta: { title: `${DOMAIN_TITLE} | Address` },
  },
  {
    path: "/block/:revision",
    name: "blockDetail",
    component: BlockDetailpage,
    meta: { title: `${DOMAIN_TITLE} | Block` },
  },
  {
    path: "/blocks",
    name: "blockList",
    component: BlockListPage,
    meta: { title: `${DOMAIN_TITLE} | Blocks` },
  },
  {
    path: "/epochs",
    name: "epochList",
    component: EpochListPage,
    meta: { title: `${DOMAIN_TITLE} | Epochs` },
  },
  {
    path: "/epochs/:epoch",
    name: "epochDetail",
    component: EpochDetailPage,
    meta: { title: `${DOMAIN_TITLE} | Epoch` },
  },
  {
    path: "/epochs/:epoch/stats",
    name: "epochStats",
    component: EpochStatsPage,
    meta: { title: `${DOMAIN_TITLE} | Epoch Stats` },
 
  },
  {
    path: "/txs",
    name: "txList",
    component: TxListPage,
    meta: { title: `${DOMAIN_TITLE} | Txs` },
  },
  {
    path: "/tx/:hash",
    name: "txDetail",
    component: TransactionDetailPage,
    meta: { title: `${DOMAIN_TITLE} | Transaction` },
  },
  {
    path: "/accounts/mtr",
    name: "topMTR",
    component: TopMTRAccountsPage,
    meta: { title: `${DOMAIN_TITLE} | Top MTR Accounts` },
  },
  {
    path: "/accounts/mtrg",
    name: "topMTRG",
    component: TopMTRGAccountsPage,
    meta: { title: `${DOMAIN_TITLE} | Top MTRG Accounts` },
  },
  {
    path: "/buckets/:id",
    name: "bucket",
    component: BucketPage,
    meta: { title: `${DOMAIN_TITLE} | Bucket` },
  },
  {
    path: "/stats",
    name: "stats",
    component: StatPage,
    meta: { title: `${DOMAIN_TITLE} | Stat` },
  },
  {
    path: "/stats/:address",
    name: "statDetail",
    component: StatPage,
    meta: { title: `${DOMAIN_TITLE} | Stat` },
  },
  {
    path: "/verify/:address",
    name: "verify",
    component: VerifyPage,
    meta: { title: `${DOMAIN_TITLE} | verify` },
  },
  {
    path: "/token/:address",
    name: "tokenInfo",
    component: TokenAddress,
    meta: { title: `${DOMAIN_TITLE} | token` },
  },

  {
    path: "*",
    component: notFoundPage,
    meta: { title: `${DOMAIN_TITLE} | Not Found` },
  },
];
