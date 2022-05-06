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
import NFTDetail from "@/pages/NFTDetail.vue";

import notFoundPage from "../pages/NotFound.vue";

import { getCurrentChain } from "@/config";
const { VUE_APP_CHAIN_ID } = process.env;
const cChain = getCurrentChain(Number(VUE_APP_CHAIN_ID));

export const routes = [
  {
    path: "/al/:address",
    name: "address-link",
    component: AddressLinkPage,
    meta: { title: `Explorer` },
  },
  {
    path: "/",
    name: "home",
    component: HomePage,
    meta: { title: `Explorer` },
  },
  {
    path: "/auction",
    name: "auction",
    component: AuctionPage,
    meta: { title: `Auctions` },
  },
  {
    path: "/auction/:auctionID",
    name: "auctionDetail",
    component: AuctionDetailPage,
    meta: { title: `Auction ` },
  },
  {
    path: "/pow",
    name: "pow",
    component: PowPage,
    meta: { title: `PoW` },
  },
  {
    path: "/pow/rewards/:epoch",
    name: "powRewards",
    component: PowRewardsPage,
    meta: { title: `Mining Rewards` },
  },

  {
    path: "/pos",
    name: "pos",
    component: PosPage,
    meta: { title: `PoS` },
  },
  {
    path: "/pos/rewards/:epoch",
    name: "posRewards",
    component: PosRewardsPage,
    meta: { title: `Epoch Reward` },
  },
  {
    path: "/validator/:address",
    name: "validatorDetail",
    component: ValidatorDetailpage,
    meta: { title: `Validator` },
  },
  {
    path: "/address/:address",
    name: "address",
    component: AddressPage,
    meta: { title: `Address` },
  },
  {
    path: "/block/:revision",
    name: "blockDetail",
    component: BlockDetailpage,
    meta: { title: `Block` },
  },
  {
    path: "/blocks",
    name: "blockList",
    component: BlockListPage,
    meta: { title: `Blocks` },
  },
  {
    path: "/epochs",
    name: "epochList",
    component: EpochListPage,
    meta: { title: `Epochs` },
  },
  {
    path: "/epochs/:epoch",
    name: "epochDetail",
    component: EpochDetailPage,
    meta: { title: `Epoch` },
  },
  {
    path: "/epochs/:epoch/stats",
    name: "epochStats",
    component: EpochStatsPage,
    meta: { title: `Epoch Stats` },

  },
  {
    path: "/txs",
    name: "txList",
    component: TxListPage,
    meta: { title: `Txs` },
  },
  {
    path: "/tx/:hash",
    name: "txDetail",
    component: TransactionDetailPage,
    meta: { title: `Transaction` },
  },
  {
    path: `/accounts/${cChain.symbol.toLowerCase()}`,
    name: "topMTR",
    component: TopMTRAccountsPage,
    meta: { title: `Top ${cChain.symbol} Accounts` },
  },
  {
    path: `/accounts/${cChain.gSymbol.toLowerCase()}`,
    name: "topMTRG",
    component: TopMTRGAccountsPage,
    meta: { title: `Top ${cChain.gSymbol} Accounts` },
  },
  {
    path: "/buckets/:id",
    name: "bucket",
    component: BucketPage,
    meta: { title: `Bucket` },
  },
  {
    path: "/stats",
    name: "stats",
    component: StatPage,
    meta: { title: `Stat` },
  },
  {
    path: "/stats/:address",
    name: "statDetail",
    component: StatPage,
    meta: { title: `Stat` },
  },
  {
    path: "/verify/:address",
    name: "verify",
    component: VerifyPage,
    meta: { title: `verify` },
  },
  {
    path: "/token/:address",
    name: "tokenInfo",
    component: TokenAddress,
    meta: { title: `token` },
  },
  {
    path: "/nftDetail/:address/:tokenId",
    name: "nftDetail",
    component: NFTDetail,
    props: true,
    meta: { title: `nftDetail` }
  },

  {
    path: "*",
    component: notFoundPage,
    meta: { title: `Not Found` },
  },
];
