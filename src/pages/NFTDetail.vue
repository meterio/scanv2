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
  name: 'NFTDetail',
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
      summaryTitle: 'NFT Token',
      summary: [],
      tabs: [{ name: 'Transfers' }],
      tabValue: 0,
      transfers: {
        pagination: {
          show: true,
          align: 'center',
          perPage: 20
        },
        fields: [
          { key: 'txhashWithStatus', label: 'Hash' },
          { key: 'blocknum', label: 'Block' },
          { key: 'timestamp', label: 'Time' },
          { key: 'from', label: 'From' },
          { key: 'direct', label: '' },
          { key: 'to', label: 'To' },
          { key: 'nftTokens', label: 'Token ID' }
        ],
        items: []
      }
    };
  },
  mounted() {
    this.init();
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
    }
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
    async getSummary() {
      const detail = await this.$api.nft.getTokenDetail(this.network, this.address, this.tokenId);
      this.summary = [
        { key: 'Type', value: detail.type },
        {
          key: 'Address',
          value: this.address,
          type: 'address-link'
        },
        {
          key: 'Token ID',
          value: `${detail.value} of [${this.tokenId}]`
        },
        {
          key: 'Media',
          value: detail.mediaURI,
          type: 'media'
        },

        { key: 'Owner', value: detail.owner, type: 'address-link' },
        { key: 'Mint Tx', value: detail.creationTxHash, type: 'tx-link' },
        { key: 'Minted By', value: detail.minter, type: 'address-link' },
        { key: 'Minted At', value: detail.block.timestamp, type: 'full-timestamp' }
      ];
    },

    async loadTransfers(network, page, limit) {
      if (!network) return;
      const { totalRows, txs } = await this.$api.account.getNFTTxsByTokenAddrTokenId(
        network,
        this.address,
        this.tokenId,
        page,
        limit
      );
      const items = txs.map(t => ({
        txhashWithStatus: {
          hash: t.txHash,
          status: false
        },
        blocknum: t.block.number,
        from: t.from,
        to: t.to,
        direct: t.from === this.address ? 'Out' : 'In',
        nftTokens: t.nftTransfers.map(t => ({ address: '1', id: t.tokenId, val: t.value, nolink: true })),
        timestamp: t.block.timestamp
      }));
      return { items, totalRows };
    }
  }
};
</script>
