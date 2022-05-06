<template>
  <div class="detail-page">
    <DataSummary :data="summary" :title="summaryTitle" />
    <DataTableV2 :fields="fields" :loadItems="loadItems" :pagination="pagination">
      <template slot="header">
        <NavTabs class="px-0" :tabs="tabs" :value="tabValue" @changeTab="navTabChange"></NavTabs>
      </template>
    </DataTableV2>
  </div>
</template>

<script>
import DataSummary from '@/components/DataSummary.vue';
import DataTableV2 from '@/components/DataTableV2.vue';
import NavTabs from '@/components/NavTabs.vue';

export default {
  name: "NFTDetail",
  components: {
    DataSummary,
    DataTableV2,
    NavTabs
  },
  props: {
    address: {
      type: String
    },
    tokenId: {
      type: String
    }
  },
  data() {
    return {
      summaryTitle: 'NFT token detail',
      summary: [],
      tabs: [{ name: 'Transfers' }],
      tabValue: 0,
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
          { key: "nft", label: "Token ID" },
        ],
        items: [],
      },
    }
  },
  mounted() {
    this.summary.push(
      {
        key: 'Address',
        value: this.address,
        type: 'address-link'
      },
      {
        key: 'ID',
        value: this.tokenId
      },
      {
        key: 'Image',
        value: `${this.currentChain.nftImageUrlBase}${this.address}/${this.tokenId}`,
        type: 'token-image'
      })
  },
  computed: {
    items() {
      switch (this.tabValue) {
        case 0:
          return this.transfers.items;
      }
      return this.transfers.items;
    },
    fields() {
      switch (this.tabValue) {
        case 0:
          return this.transfers.fields;
      }
      return this.transfers.fields;
    },
    pagination() {
      switch (this.tabValue) {
        case 0:
          return this.transfers.pagination;
      }
      return this.transfers.pagination;
    },
    loadItems() {
      switch (this.tabValue) {
        case 0:
          return this.loadTransfers;
      }
      return this.loadTransfers;
    },
  },
  methods: {
    navTabChange(val) {
      this.tabValue = val;
      this.loadData();
    },
    loadData() {
      switch (this.tabValue) {
        case 0:
          this.loadTransfers();
          break;
        default:
          this.loadTransfers();
          break;
      }
    },
    init() {
      this.getSummary();
      this.loadData();
    },
    getSummary() { },
    async loadTransfers(network, page, limit) {
      if (!network) return
      const { totalRows, txs } = await this.$api.account.getNFTTxsByTokenAddrTokenId(
        network,
        this.address,
        this.tokenId,
        page,
        limit
      );
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
  }
}
</script>