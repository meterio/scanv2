<template lang="pug">
.detail-page
  token-data-summary(:title="title" :data="computedTokenProfile", wide)

  b-container.summary
    .mt-2pert.px-5
    data-table-v2.mt-2pert.px-0(
      :loadItems="loadItems",
      :fields="fields",
      :pagination="pagination",
      :key="loadTarget"
    )
      div(slot="header")
        nav-tabs.px-0(
          :tabs="token_tabs",
          :value="tabValue",
          @changeTab="navTabChange"
        )
</template>

<script>
import TokenDataSummary from "@/components/TokenDataSummary.vue";
import DataTableV2 from "@/components/DataTableV2.vue";
import NavTabs from "@/components/NavTabs.vue";

export default {
  name: "TokenAddress",
  components: { 
    TokenDataSummary,
    DataTableV2,
    NavTabs
  },
  data() {
    return {
      token_tabs: [
        { name: "Transfers" },
        { name: "Holders" },
      ],
      tabValue: 0,
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
      tokenProfile: {
        // name: '',
        // symbol: '',
        // decimals: 18,
        // address: '',
        // officialSite: '',
        // totalSupply: 0,
        // circulation: 0,
        // holdersCount: 0,
        // transfersCount: 0,
      }
    }
  },
  computed: {
    title() {
      return `Token: ${this.tokenProfile.name}`;
    },
    computedTokenProfile() {
      const data = {
        'Name': this.tokenProfile.name,
        'Symbol': this.tokenProfile.symbol,
        'Decimals': this.tokenProfile.decimals,
        'Contract': this.tokenProfile.address,
        'Official Site': this.tokenProfile.officialSite,
        'Total Supply': this.tokenProfile.totalSupply,
        'Circulation': this.tokenProfile.circulation,
        'Holders': this.tokenProfile.holdersCount,
        'Transfers': this.tokenProfile.transfersCount
      }
      const profile = []
      for (const key of Object.keys(data)) {
        if (key === 'Contract') {
          profile.push({
            name: key,
            type: 'address-link',
            value: data[key]
          })
        } else if (key === 'Circulation') {
          profile.push({
            name: key,
            type: 'amount',
            value: data[key],
            token: data['Symbol'],
            decimals: data['Decimals']
          })
        } else if (key === 'Total Supply') {
          profile.push({
            name: key,
            type: 'amount',
            value: data[key],
            token: data['Symbol'],
            decimals: data['Decimals']
          })
        } else if (key === 'Official Site') {
          profile.push({
            name: key,
            type: 'http-link',
            value: data[key],
          })
        } else {
          profile.push({
            name: key,
            type: 'span',
            value: data[key]
          })
        }
      }
      return profile
    },
    fields() {
      switch (this.loadTarget) {
        case "transfers":
        return this.transfers.fields;
        case "holders":
          return this.holders.fields;
      }
      return this.transfers.fields;
    },
    pagination() {
      switch (this.loadTarget) {
        case "transfers":
        return this.transfers.pagination;
        case "holders":
          return this.holders.pagination;
      }
      return this.transfers.pagination;
    },
    loadItems() {
      switch (this.loadTarget) {
        case "transfers":
        return this.loadTransfers;
        case "txs":
          return this.loadTxs;
        case "holders":
          return this.loadHolders;
      }
      return this.loadTransfers;
    },
  },
  methods: {
    init() {
      this.loadToken();
    },
    async loadToken() {
      try {
        const { address } = this.$route.params;

        const res = await this.$api.token.getTokenProfile(
          this.network,
          address
        );
        this.tokenProfile = res.result ? res.result : {}
      } catch(e) {
        console.log('e: ', e)
      }
    },
    navTabChange(val) {
      this.tabValue = val;
      switch (val) {
        case 0:
          this.loadTarget = "transfers";
          break;
        case 1:
          this.loadTarget = "holders";
          break;
        default:
          this.loadTarget = "transfers";
      }
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
            amount: String(h.balance),
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
            amount: String(t.amount),
            token: t.token,
            precision: 8,
            decimals,
          },
          txhashWithStatus: {
            hash: t.txHash,
            status: t.reverted,
          },
          blockNum: t.block.number,
          timestamp: t.block.timestamp,
        };
      });
      return { items, totalRows };
    }
  }
}
</script>

<style lang="scss" scoped>

</style>