<template lang="pug">
.detail-page
  data-summary(:title="title", :data="summary")

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
import BigNumber from "bignumber.js";
export default {
  name: "Address",
  components: {
    DataTableV2,
    NavTabs,
    DataSummary,
  },
  computed: {
    title() {
      if (this.isContract) {
        if (this.isERC20) {
          return `Token: ${this.address}`;
        } else {
          return `Contract: ${this.address}`;
        }
      } else {
        return `Address: ${this.address}`;
      }
    },
    tabs() {
      console.log(this.isContract);
      return this.isContract ? this.contract_tabs : this.address_tabs;
    },
    fields() {
      switch (this.loadTarget) {
        case "transfers":
          return this.transfers.fields;
        case "txs":
          return this.txs.fields;
        case "erc20Txs":
          return this.txs.fields;
        case "bids":
          return this.bids.fields;
        case "proposedBlocks":
          return this.proposedBlocks.fields;
        case "buckets":
          return this.buckets.fields;
        case "holders":
          return this.holders.fields;
      }
      return this.txs.fields;
    },
    pagination() {
      switch (this.loadTarget) {
        case "transfers":
          return this.transfers.pagination;
        case "txs":
          return this.txs.pagination;
        case "erc20Txs":
          return this.txs.pagination;
        case "bids":
          this.bids.pagination;
        case "proposedBlocks":
          return this.proposedBlocks.pagination;
        case "buckets":
          return this.buckets.pagination;
        case "holders":
          return this.holders.pagination;
      }
      return this.txs.pagination;
    },
    loadItems() {
      switch (this.loadTarget) {
        case "transfers":
          return this.loadTransfers;
        case "txs":
          return this.loadTxs;
        case "erc20Txs":
          return this.loadTxs20;
        case "bids":
          return this.loadBids;
        case "proposedBlocks":
          return this.loadProposed;
        case "buckets":
          return this.loadBuckets;
        case "holders":
          return this.loadHolders;
      }
      return this.loadTxs;
    },
  },
  data() {
    return {
      address_tabs: [
        { name: "Transfers" },
        { name: "Transactions" },
        { name: "ERC20 Transactions" },
        { name: "Auction Bids" },
        { name: "Proposed Blocks" },
        { name: "Buckets" },
      ],
      contract_tabs: [
        { name: "Transfers" },
        { name: "Transactions" },
        { name: "Holders" },
      ],
      tabValue: 0,
      isContract: false,
      isToken: false,
      address: "0x",
      summary: [],
      account: {},
      loadTarget: "transfers",
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
          { key: "txHash", label: "Transaction" },
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
          { key: "txhash", label: "Hash" },
          { key: "blocknum", label: "Block" },
          { key: "timestamp", label: "Time" },
          { key: "from", label: "From" },
          { key: "direct", label: "" },
          { key: "to", label: "To" },
          { key: "amount", label: "Amount" },
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
    };
  },
  beforeMount() {},
  methods: {
    init() {
      this.loadAddress();
    },
    navTabChange(val) {
      this.current_tab_index = val;
      this.tabValue = val;
      if (!this.isContract) {
        switch (val) {
          case 0:
            this.loadTarget = "transfers";
            break;
          case 1:
            this.loadTarget = "txs";
            break;
          case 2:
            this.loadTarget = "erc20Txs";
            break;
          case 3:
            this.loadTarget = "bids";
            break;
          case 4:
            this.loadTarget = "proposedBlocks";
            break;
          case 5:
            this.loadTarget = "buckets";
            break;
          default:
            this.loadTarget = "transfers";
        }
      } else {
        switch (val) {
          case 0:
            this.loadTarget = "transfers";
            break;
          case 1:
            this.loadTarget = "txs";
            break;
          case 2:
            this.loadTarget = "holders";
            break;
          default:
            this.loadTarget = "transfers";
        }
      }
    },
    async loadAddress() {
      try {
        const { address } = this.$route.params;
        this.address = address;
        this.summary = [];

        const res = await this.$api.account.getAccountDetail(
          this.network,
          address
        );

        const { account } = res;
        this.isContract = !!account.isContract;
        this.isERC20 = !!account.isERC20;
        if (this.address === "0x0000000000000000000000000000000000000000") {
          if (new BigNumber(account.mtrgBalance).isLessThan(0)) {
            account.mtrgBalance = "0";
          }
          if (new BigNumber(account.mtrgBounded).isLessThan(0)) {
            account.mtrgBounded = "0";
          }
          if (new BigNumber(account.mtrBalance).isLessThan(0)) {
            account.mtrBalance = "0";
          }
          if (new BigNumber(account.mtrBounded).isLessThan(0)) {
            account.mtrBounded = "0";
          }
        }
        this.summary = this.summary.concat([
          // { key: "Address", value: account.address },
          {
            key: "MTRG Balance",
            value: account.mtrgBalance,
            type: "amount",
            token: "MTRG",
            precision: -1,
          },
          {
            key: "MTRG Staked",
            value: account.mtrgBounded,
            type: "amount",
            token: "MTRG",
            precision: -1,
          },
          {
            key: "MTR Balance",
            value: account.mtrBalance,
            type: "amount",
            token: "MTR",
            precision: -1,
          },
        ]);
        // if (account.name) {
        //   this.summary.push({ key: "Name", value: account.name });
        // }
        if (account.firstSeen && account.firstSeen.number > 0) {
          this.summary.push({
            key: "First Seen",
            type: "block-link-with-note",
            value: this.fromNow(account.firstSeen.timestamp),
            block: account.firstSeen.number,
          });
        }
        if (account.lastUpdate && account.lastUpdate.number > 0) {
          this.summary.push({
            key: "Last Updated",
            type: "block-link-with-note",
            value: this.fromNow(account.lastUpdate.timestamp),
            block: account.lastUpdate.number,
          });
        }
        if (account.hasCode) {
          this.summary.push({ key: "Type", value: "Contract" });
        }
        if (account.isERC20) {
          this.summary.push({
            key: "ERC20 Token",
            value: `${account.tokenName || "Unnamed Token"} (${
              account.tokenSymbol || "ERC20"
            })`,
          });
          this.summary.push({
            key: "Decimals",
            value: account.decimals || 18,
          });
          if (account.circulation) {
            this.summary.push({
              key: "Circulation",
              type: "amount",
              value: account.circulation,
              token: account.tokenSymbol,
              decimals: account.tokenDecimals,
            });
          }
          if (account.holdersCount) {
            this.summary.push({
              key: "Holders Count",
              value: account.holdersCount,
            });
          }
        }
        this.account = account;
      } catch (e) {
        console.log(e);
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
            token: "MTRG",
          },
          timestamp: b.createTime,
          status: b.unbounded ? "Unbounded" : "Created",
        };
      });
      return { items, totalRows };
    },

    async loadHolders(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getHolders(network, address);
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
      return { items, totalRows: items.length };
    },

    async loadTransfers(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getTransfers(
        network,
        address,
        page,
        limit
      );
      const { transfers, totalRows } = res;
      const items = transfers.map((t) => {
        let direct = "";
        if (t.from.toLowerCase() === t.to.toLowerCase()) {
          direct = "Self";
        } else {
          direct =
            t.to.toLowerCase() === this.address.toLowerCase() ? "In" : "Out";
        }
        let decimals = 18;
        let from = t.from;
        let to = t.to;
        if (t.erc20 && t.erc20.address) {
          decimals = t.erc20.decimals || 18;
          if (from === "0x0000000000000000000000000000000000000000") {
            from = t.tokenAddress;
          }
          if (to === "0x0000000000000000000000000000000000000000") {
            to = t.tokenAddress;
          }
        }
        return {
          from: from,
          direct,
          to: to,
          amount: {
            type: "amount",
            amount: t.amount,
            token: t.token,
            precision: 8,
            decimals,
          },
          txHash: t.txHash,
          blockNum: t.block.number,
          timestamp: t.block.timestamp,
        };
      });
      return { items, totalRows };
    },
    async loadTxs(network, page, limit) {
      const { address } = this.$route.params;
      const res = await this.$api.account.getTxs(network, address, page, limit);
      const { txSummaries, totalRows } = res;
      const items = txSummaries.map((t) => {
        let direct = "";
        if (
          t.clauseCount === 1 &&
          t.origin.toLowerCase() === t.majorTo.toLowerCase()
        ) {
          direct = "Self";
        } else {
          direct =
            t.origin.toLowerCase() === this.address.toLowerCase()
              ? "Out"
              : "In";
        }
        return {
          txhash: t.hash,
          blocknum: t.block.number,
          from: t.origin,
          direct,
          to: t.majorTo || "nobody",
          amount: {
            type: "amount",
            amount: t.totalClauseAmount,
            token: t.token,
            precision: 8,
          },
          timestamp: t.block.timestamp,
        };
      });
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
      const { transfers, totalRows } = res;
      const items = transfers.map((t) => ({
        txhash: t.txHash,
        blocknum: t.block.number,
        from: t.from === this.address ? t.from : t.tokenAddress,
        to: t.to === this.address ? t.to : t.tokenAddress,
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
            token: "MTR",
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
            token: "MTR",
          },
          hammerPriceStr: b.pending
            ? "-"
            : {
                type: "amount",
                amount: b.hammerPrice,
                precision: 4,
                token: "MTR",
              },
          lotAmountStr:
            b.pending || !b.lotAmount
              ? "-"
              : {
                  type: "amount",
                  amount: b.lotAmount,
                  precision: 8,
                  token: "MTRG",
                },
        };
      });
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
