<template lang="pug">
.detail-page
  data-summary(:title="'Address: ' + address", :data="summary")

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
          :tabs="address_tabs",
          :value="tabValue",
          @changeTab="navTabChange"
        )
</template>

<script>
import DataTableV2 from "@/components/DataTableV2.vue";
import NavTabs from "@/components/NavTabs.vue";
import DataSummary from "@/components/DataSummary.vue";
import { fromWei } from "@/utils";
export default {
  name: "Address",
  components: {
    DataTableV2,
    NavTabs,
    DataSummary,
  },
  computed: {
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
      tabValue: 0,
      address: "0x",
      summary: [],
      account: {},
      loadTarget: "transfers",

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
          { key: "totalVotesStr", label: "Votes" },
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
      console.log("loadtarget:", this.loadTarget);
    },
    async loadAddress() {
      try {
        const { address } = this.$route.params;
        this.address = address;
        const res = await this.$api.account.getAccountDetail(
          this.network,
          address
        );

        const { account } = res;
        this.summary = [
          // { key: "Address", value: account.address },
          {
            key: "MTR Balance",
            value: account.mtrBalanceStr,
          },
          {
            key: "MTRG Balance",
            value: account.mtrgBalanceStr,
          },
        ];
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
          totalVotesStr: fromWei(b.totalVotes, 6, "MTRG"),
          timestamp: b.createTime,
          status: b.unbounded ? "Unbounded" : "Created",
        };
      });
      return { items, totalRows };
    },
    async loadTransfers(network, page, limit) {
      const { address } = this.$route.params;
      console.log("load transfers");
      const res = await this.$api.account.getTransfers(
        network,
        address,
        page,
        limit
      );
      const { transfers, totalRows } = res;
      const items = transfers.map((t) => {
        const amount = fromWei(t.amount, -1, t.token);
        return {
          from: t.from,
          direct: t.to === this.address ? "In" : "Out",
          to: t.to,
          amount,
          txHash: t.txHash,
          blockNum: t.block.number,
          timestamp: t.block.timestamp,
        };
      });
      return { items, totalRows };
    },
    async loadTxs(network, page, limit) {
      const { address } = this.$route.params;
      console.log("load txs");
      const res = await this.$api.account.getTxs(network, address, page, limit);
      const { txSummaries, totalRows } = res;
      const items = txSummaries.map((t) => {
        const amount = fromWei(t.totalClauseAmount, -1, t.token);
        return {
          txhash: t.hash,
          blocknum: t.block.number,
          from: t.origin,
          direct: t.origin === this.address ? "Out" : "In",
          to: t.majorTo || "nobody",
          amount,
          timestamp: t.block.timestamp,
        };
      });
      return { items, totalRows };
    },
    async loadTxs20(network, page, limit) {
      const { address } = this.$route.params;
      console.log("txs erc20");

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
        amount: fromWei(t.amount) + (t.symbol ? ` ${t.symbol}` : " "),
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
          actualRewardStr: fromWei(b.actualReward, -1, "MTR"),
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
        console.log(b);
        return {
          ...b,
          amountStr: fromWei(b.amount, 6, "MTR"),
          hammerPriceStr: b.pending ? "-" : fromWei(b.hammerPrice, 4, "MTR"),
          lotAmountStr:
            b.pending || !b.lotAmount ? "-" : fromWei(b.lotAmount, 6, "MTRG"),
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
