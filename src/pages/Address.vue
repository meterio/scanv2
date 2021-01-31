<template lang="pug">
.detail-page
  data-summary(:title="'Address: ' + address", :data="summary")

  b-container.summary
    #b-card.mt-2pert.px-5
      #pie-chart.px-0
    data-table-v2.mt-2pert.px-0(
      title="Buckets",
      :fields="buckets.fields",
      :pagination="buckets.pagination",
      :loadItems="loadBuckets"
    )
      template(v-slot:cell(candidate)="data")
        .dt-row
          router-link.link(
            :to="{ name: 'address', params: { address: data.item.candidate } }"
          ) {{ data.item.candidate }}
      template(v-slot:cell(totalVotes)="data")
        .dt-row {{ fromWei(data.item.totalVotes, 2) }} MTRG

    data-table.mt-2pert.px-0(
      :data="txs",
      :loading="txs_load",
      :pagination="txs.pagination",
      :paginateTotal="address_total",
      :paginateCurrentPage="address_current_page",
      @tablePaginationChange="pgChange"
    )
      div(slot="header")
        nav-tabs.px-0(:tabs="address_tabs", @changeTab="navTabChange")
</template>

<script>
import DataTable from "@/components/DataTable.vue";
import DataTableV2 from "@/components/DataTableV2.vue";
import NavTabs from "@/components/NavTabs.vue";
import DataSummary from "@/components/DataSummary.vue";
import { fromWei } from "@/utils";
export default {
  name: "Address",
  components: {
    DataTable,
    DataTableV2,
    NavTabs,
    DataSummary,
  },
  data() {
    return {
      address_tabs: [
        { name: "Transations" },
        { name: "ERC20 Transactions", width: 170 },
      ],
      address_current_page: 1,
      address_total: 0,
      address: "0x",
      summary: [],
      account: {},
      txs_load: true,
      txs: {
        pagination: {
          show: true,
          align: "center",
          perPage: 8,
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
        pagination: {
          show: true,
          align: "center",
          perPage: 4,
        },
        fields: [
          { key: "address", label: "Candidate Address" },
          { key: "totalVotes", label: "Votes" },
          { key: "timestamp", label: "Time" },
          { key: "status", label: "Status" },
        ],
      },
      current_tab_index: 0,
    };
  },
  beforeMount() {},
  methods: {
    init() {
      this.loadAddress();
      this.loadTxs();
    },
    navTabChange(val) {
      this.current_tab_index = val;
      this.address_current_page = 1;
      if (val == 0) {
        this.loadTxs();
      } else {
        this.loadTxs20();
      }
    },
    pgChange(val) {
      this.address_current_page = val;
      if (this.current_tab_index == 0) {
        this.loadTxs();
      } else {
        this.loadTxs20();
      }
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
          console.log(account.firstSeen);
          this.summary.push({
            key: "First Seen",
            type: "block-link-with-note",
            value: this.fromNow(account.firstSeen.timestamp),
            block: account.firstSeen.number,
          });
        }
        this.account = account;
      } catch (e) {
        console.log(e);
      }
    },
    async loadBuckets(network, page, limit) {
      const { address } = this.$route.params;
      console.log("ADDRESS: ", address);
      console.log(network);
      const res = await this.$api.account.getBuckets(
        network,
        address,
        page,
        limit
      );
      const { totalPage, buckets } = res;
      const totalRows = totalPage * limit;
      const items = buckets.map((b) => {
        return {
          address: b.candidate,
          totalVotes: b.totalVotes,
          timestamp: b.createTime,
          status: b.unbounded ? "Unbounded" : "Created",
        };
      });
      return { items, totalRows };
    },
    async loadTxs() {
      this.txs_load = true;
      try {
        const { address } = this.$route.params;
        this.txs.items = [];
        const { txSummaries, totalPage } = await this.$api.account.getTxs(
          this.network,
          address,
          this.address_current_page,
          this.page_size
        );
        this.address_total = totalPage * this.page_size;
        for (const t of txSummaries) {
          this.txs.items.push({
            txhash: t.hash,
            blocknum: t.block.number,
            from: t.origin,
            direct: t.origin === this.address ? "Out" : "In",
            to: t.tos && t.tos.length > 0 ? t.tos[0].address : "nobody",
            amount: t.totalAmountStrs[0],
            timestamp: t.block.timestamp,
          });
        }
        this.txs_load = false;
      } catch (e) {
        this.txs_load = false;
      }
    },
    async loadTxs20() {
      this.txs_load = true;
      this.txs.items = [];
      try {
        const { address } = this.$route.params;
        const { transfers, totalPage } = await this.$api.account.getTxs20(
          this.network,
          address,
          this.address_current_page,
          this.page_size
        );
        this.address_total = totalPage * this.page_size;
        for (const t of transfers) {
          this.txs.items.push({
            txhash: t.txHash,
            blocknum: t.block.number,
            from: t.from === this.address ? t.from : t.tokenAddress,
            to: t.to === this.address ? t.to : t.tokenAddress,
            direct: t.from === this.address ? "Out" : "In",
            amount: fromWei(t.amount),
            timestamp: t.block.timestamp,
          });
        }
        this.txs_load = false;
      } catch (e) {
        console.error(e);
        this.txs_load = false;
      }
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
