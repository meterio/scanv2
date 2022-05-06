<template lang="pug">
.detail-page
  data-summary(:title="title", :data="addressInfo.summary")

  b-container.summary
    #b-card.mt-2pert.px-5
      #pie-chart.px-0

    data-table-v2.mt-2pert.px-0(
      :loadItems="loadItems",
      :fields="fields",
      :pagination="pagination",
      :key="loadTarget"
    )
      div(slot="header")
        nav-tabs.px-0(
          :tabs="tabs",
          :value="tabValue",
          @changeTab="navTabChange"
        )
</template>

<script>
import DataTableV2 from "@/components/DataTableV2.vue";
import NavTabs from "@/components/NavTabs.vue";
import DataSummary from "@/components/DataSummary.vue";
export default {
  name: "UserAddress",
  components: {
    DataTableV2,
    NavTabs,
    DataSummary,
  },
  props: {
    addressInfo: {
      type: Object,
      default() {
        return {
          isContract: false,
          isERC20: false,
          address: "0x",
          summary: [],
        };
      },
    },
    userDataCount: {
      type: Object,
      required: true
    }
  },
  computed: {
    title() {
      return `Address: ${this.address}`;
    },
    tabs() {
      return [
        { name: this.userDataCount.txCount > 0 ? `Transactions(${this.userDataCount.txCount})` : 'Transactions' },
        { name: this.userDataCount.erc20TokenCount > 0 ? `ERC20 Tokens(${this.userDataCount.erc20TokenCount})` : 'ERC20 Tokens' },
        { name: this.userDataCount.erc20TxCount > 0 ? `ERC20 Txns(${this.userDataCount.erc20TxCount})` : 'ERC20 Txns' },
        { name: this.userDataCount.nftTokenCount > 0 ? `NFT(${this.userDataCount.nftTokenCount})` : 'NFT' },
        { name: this.userDataCount.nftTxCount > 0 ? `NFT Txns(${this.userDataCount.nftTxCount})` : 'NFT Txns' },
        { name: this.userDataCount.bidCount > 0 ? `Auction Bids(${this.userDataCount.bidCount})` : 'Auction Bids' },
        { name: this.userDataCount.proposedCount > 0 ? `Proposed Blocks(${this.userDataCount.proposedCount})` : 'Proposed Blocks' },
        { name: this.userDataCount.bucketCount > 0 ? `Buckets(${this.userDataCount.bucketCount})` : 'Buckets' },
      ];
    },
    fields() {
      switch (this.loadTarget) {
        case "txs":
          return this.txs.fields;
        case "erc20Txs":
          return this.erc20txs.fields;
        case "nftTxs":
          return this.nftTxs.fields;
        case "bids":
          return this.bids.fields;
        case "proposedBlocks":
          return this.proposedBlocks.fields;
        case "buckets":
          return this.buckets.fields;
        case "holders":
          return this.holders.fields;
        case "erc20Tokens":
          return this.erc20Tokens.fields;
        case "nftTokens":
          return this.nftTokens.fields;
      }
      return this.txs.fields;
    },
    pagination() {
      switch (this.loadTarget) {
        case "txs":
          return this.txs.pagination;
        case "erc20Txs":
          return this.erc20txs.pagination;
        case "nftTxs":
          return this.nftTxs.pagination;
        case "bids":
          this.bids.pagination;
        case "proposedBlocks":
          return this.proposedBlocks.pagination;
        case "buckets":
          return this.buckets.pagination;
        case "holders":
          return this.holders.pagination;
        case "erc20Tokens":
          return this.erc20Tokens.pagination;
        case "nftTokens":
          return this.nftTokens.pagination;
      }
      return this.txs.pagination;
    },
    loadItems() {
      switch (this.loadTarget) {
        case "txs":
          return this.loadTxs;
        case "erc20Txs":
          return this.loadTxs20;
        case "nftTxs":
          return this.loadNFTTxs;
        case "bids":
          return this.loadBids;
        case "proposedBlocks":
          return this.loadProposed;
        case "buckets":
          return this.loadBuckets;
        case "holders":
          return this.loadHolders;
        case "erc20Tokens":
          return this.loadErc20Tokens;
        case "nftTokens":
          return this.loadNFTTokens;
      }
      return this.loadTxs;
    },
    tokenSymbol() {
      return this.currentChain.symbol;
    },
  },
  data() {
    return {
      tabValue: 0,
      isToken: false,
      address: "0x",
      summary: [],
      account: {},
      loadTarget: "txs",
      holders: {
        pagination: { show: true, align: "center", perPage: 20 },
        fields: [
          { key: "fullAddress", label: "Holder Address" },
          { key: "balance", label: "Amount" },
          { key: "percentage", label: "Percentage" },
        ],
      },
      transfers: {
        pagination: { show: true, align: "center", perPage: 20 },
        fields: [
          { key: "from", label: "From" },
          { key: "direct", label: "" },
          { key: "to", label: "To" },
          { key: "amount", label: "Amount" },
          { key: "txhashWithStatus", label: "Transaction" },
          { key: "blockNum", label: "Block" },
          { key: "timestamp", label: "Time" },
        ],
      },
      proposedBlocks: {
        pagination: { show: true, align: "center", perPage: 20 },
        fields: [
          { key: "blockNum", label: "Height" },
          { key: "blockhash", label: "Block Hash" },
          { key: "txCount", label: "Txs" },
          { key: "actualRewardStr", label: "Reward" },
          { key: "timestamp", label: "Time" },
        ],
      },
      bids: {
        pagination: {
          show: true,
          align: "center",
          perPage: 20,
        },
        fields: [
          { key: "blockNum", label: "Block" },
          { key: "txHash", label: "Tx" },
          { key: "type", label: "Type" },
          { key: "amountStr", label: "Amount" },
          { key: "hammerPriceStr", label: "Hammer Price" },
          { key: "lotAmountStr", label: "Lot Amount" },
          { key: "timestamp", label: "Time" },
        ],
      },
      txs: {
        pagination: {
          show: true,
          align: "center",
          perPage: 20,
        },
        fields: [
          { key: "txhashWithStatus", label: "Hash" },
          { key: "methodName", label: "Method" },
          { key: "blocknum", label: "Block" },
          { key: "timestamp", label: "Time" },
          { key: "from", label: "From" },
          { key: "direct", label: "" },
          { key: "to", label: "To" },
          { key: "amount", label: "Amount" },
        ],
        items: [],
      },
      erc20txs: {
        pagination: {
          show: true,
          align: "center",
          perPage: 20,
        },
        fields: [
          { key: "txhashWithStatus", label: "Hash" },
          { key: "blocknum", label: "Block" },
          { key: "timestamp", label: "Time" },
          { key: "from", label: "From" },
          { key: "direct", label: "" },
          { key: "to", label: "To" },
          { key: "amount", label: "Amount" },
        ],
        items: [],
      },
      nftTxs: {
        pagination: {
          show: true,
          align: "center",
          perPage: 20,
        },
        fields: [
          { key: "txhashWithStatus", label: "Hash" },
          { key: "blocknum", label: "Block" },
          { key: "timestamp", label: "Time" },
          { key: "from", label: "From" },
          { key: "direct", label: "" },
          { key: "to", label: "To" },
          { key: "nft", label: "Token ID" },
        ],
        items: [],
      },
      buckets: {
        pagination: { show: true, align: "center", perPage: 20 },
        fields: [
          { key: "bucketid", label: "ID" },
          { key: "address", label: "Candidate Address" },
          { key: "totalVotes", label: "Votes" },
          { key: "timestamp", label: "Time" },
          { key: "status", label: "Status" },
        ],
      },
      erc20Tokens: {
        pagination: { show: true, align: "center", perPage: 20 },
        fields: [
          { key: "tokenType", label: "Type" },
          { key: "fullAddress", label: "Token Address" },
          { key: "balance", label: "Balance" },
          { key: "blocknum", label: "Last Updated on Block" },
        ],
      },
      nftTokens: {
        pagination: { show: true, align: "center", perPage: 20 },
        fields: [
          { key: "type", label: "Type" },
          // { key: "name", label: "Name" },
          { key: "nft", label: "Token ID" }
          // { key: "fullAddress", label: "Token Address" },
          // { key: "balance", label: "Balance" },
          // { key: "blocknum", label: "Last Updated on Block" },
        ],
      },
    };
  },
  methods: {
    init() {
      this.address = this.addressInfo.address;
    },
    navTabChange(val) {
      this.tabValue = val;
      this.getLoadTarget(val);
    },
    getLoadTarget(val) {
      switch (val) {
        case 0:
          this.loadTarget = "txs";
          break;
        case 1:
          this.loadTarget = "erc20Tokens";
          break;
        case 2:
          this.loadTarget = "erc20Txs";
          break;
        case 3:
          this.loadTarget = "nftTokens";
          break;
        case 4:
          this.loadTarget = "nftTxs";
          break;
        case 5:
          this.loadTarget = "bids";
          break;
        case 6:
          this.loadTarget = "proposedBlocks";
          break;
        case 7:
          this.loadTarget = "buckets";
          break;
        default:
          this.loadTarget = "txs";
      }
    },
    async loadBuckets(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getBuckets(
        network,
        address,
        page,
        limit
      );
      const { buckets, totalRows } = res;
      const items = buckets.map((b) => {
        return {
          bucketid: b.id,
          address: b.candidate,
          totalVotes: {
            type: "amount",
            amount: b.totalVotes,
            precision: 6,
            token: this.currentChain.gSymbol,
          },
          timestamp: b.createTime,
          status: b.unbounded ? "Unbounded" : "Created",
        };
      });
      return { items, totalRows };
    },

    async loadHolders(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getHolders(
        network,
        address,
        page,
        limit
      );
      const { holders, token } = res;
      const items = holders.map((h) => {
        return {
          ...h,
          fullAddress: h.address,
          balance: {
            type: "amount",
            amount: h.balance,
            precision: 6,
            decimals: token.decimals || 18,
            token: h.symbol,
          },
          percentage: {
            type: "percentage",
            amount: h.percentage,
          },
        };
      });
      return { items, totalRows: token.holdersCount };
    },

    async loadTxs(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getTxs(network, address, page, limit);
      const { txs, totalRows } = res;
      const items = txs.map((t) => {
        let direct = "";
        const fromAddr = t.from;
        const toAddr = t.to;
        let amount = t.mtr;

        let token = this.currentChain.symbol;
        if (t.mtrg !== '0') {
          amount = t.mtrg;
          token = this.currentChain.gSymbol;
        }

        if (fromAddr === toAddr) {
          direct = "Self";
        } else if (fromAddr === address.toLowerCase()) {
          direct = "Out";
        } else {
          direct = "In";
        }

        console.log("direct = ", direct);

        let methodName = t.method;
        if (String(t.method).includes("(")) {
          const index = String(t.method).indexOf("(");
          methodName = String(t.method).substring(0, index);
        }
        return {
          txhashWithStatus: {
            hash: t.txHash,
            status: t.reverted,
          },
          methodName,
          blocknum: t.block.number,
          from: fromAddr,
          direct,
          to: toAddr || "nobody",
          amount: {
            type: "amount",
            amount: amount,
            token: token,
            precision: 8,
          },
          timestamp: t.block.timestamp,
        };
      });
      console.log(items);
      return { items, totalRows };
    },
    async loadTxs20(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getTxs20(
        network,
        address,
        page,
        limit
      );
      const { txs, totalRows } = res;
      const items = txs.map((t) => ({
        txhashWithStatus: {
          hash: t.txHash,
          status: false,
        },
        blocknum: t.block.number,
        from: t.from,
        to: t.to,
        direct: t.from === this.address ? "Out" : "In",
        amount: {
          type: "amount",
          amount: t.amount,
          token: t.symbol || "ERC20",
          precision: 8,
          decimals: t.decimals || 18,
        },
        timestamp: t.block.timestamp,
      }));
      return { items, totalRows };
    },
    async loadNFTTxs(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getNFTTxs(
        network,
        address,
        page,
        limit
      );
      const { txs, totalRows } = res;
      const items = txs.map((t) => ({
        txhashWithStatus: {
          hash: t.txHash,
          status: false,
        },
        blocknum: t.block.number,
        from: t.from,
        to: t.to,
        direct: t.from === this.address ? "Out" : "In",
        nft: {
          nftBalances: t.nftTransfers,
        },
        timestamp: t.block.timestamp,
      }));
      return { items, totalRows };
    },
    async loadProposed(network, page, limit) {
      this.load = true;
      const { address } = this.$route.params;
      const { proposed, totalRows } = await this.$api.account.getProposed(
        network,
        address,
        page,
        limit
      );

      const items = proposed.map((b) => {
        return {
          ...b,
          blockNum: b.number,
          blockhash: b.hash,
          actualRewardStr: {
            type: "amount",
            amount: b.actualReward,
            precision: -1,
            token: this.tokenSymbol,
          },
        };
      });
      return { items, totalRows };
    },
    async loadBids(network, page, limit) {
      this.load = true;
      const { address } = this.$route.params;
      const { bids, totalRows } = await this.$api.account.getBids(
        network,
        address,
        page,
        limit
      );

      const items = bids.map((b) => {
        return {
          ...b,
          amountStr: {
            type: "amount",
            amount: b.amount,
            precision: 8,
            token: this.tokenSymbol,
          },
          hammerPriceStr: b.pending
            ? "-"
            : {
              type: "amount",
              amount: b.hammerPrice,
              precision: 4,
              token: this.tokenSymbol,
            },
          lotAmountStr:
            b.pending || !b.lotAmount
              ? "-"
              : {
                type: "amount",
                amount: b.lotAmount,
                precision: 8,
                token: this.tokenSymbol,
              },
        };
      });
      return { items, totalRows };
    },
    async loadErc20Tokens(network, page, limit) {
      this.load = true;
      const { address } = this.$route.params;
      const { tokens, totalRows } = await this.$api.account.getErc20Tokens(
        network,
        address,
        page,
        limit
      );
      const items = [];
      for (const t of tokens) {
        items.push({
          ...t,
          fullAddress: t.tokenAddress,
          blocknum: t.lastUpdate.number,
          balance: {
            type: "amount",
            amount: t.balance,
            token: t.tokenSymbol,
            precision: 8,
            decimals: t.tokenDecimals,
          },
        })
      }
      return { items, totalRows };
    },
    async loadNFTTokens(network, page, limit) {
      this.load = true;
      const { address } = this.$route.params;
      const { tokens, totalRows } = await this.$api.account.getNFTTokens(
        network,
        address,
        page,
        limit
      );
      const items = [];
      for (const t of tokens) {
        items.push({
          type: t.tokenType,
          nft: {
            name: t.tokenName,
            address: t.tokenAddress,
            nftBalances: t.nftBalances,
          }
        })
      }
      console.log('items', items)
      return { items, totalRows };
    },
  },
};
</script>

<style lang="scss" scoped>
.summary {
  .title {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .row {
    padding: 10px 0;
  }

  .label {
    color: #5c6f8c;
  }

  .mt-2pert {
    margin-top: 2.6%;
  }
}
</style>
