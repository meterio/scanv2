<template>
  <div class="detail-page">
    <DataSummary :data="summary" title="Transaction Detail" />

    <DataTableV2 :fields="fields" :items="items" :pagination="pagination">
      <template slot="header">
        <NavTabs class="px-0" :tabs="tabs" :value="tabValue" @changeTab="navTabChange"></NavTabs>
      </template>
      <template v-slot:cell(to)="data">
        <div class="dt-row">
          <router-link
            class="link"
            :to="{
              name: 'address',
              params: { address: data.value }
            }"
            >{{ data.value }}</router-link
          >
        </div>
      </template>

      <template v-slot:cell(data)="row">
        <div class="dt-row breakable">
          {{ row.value }}
        </div>

        <div v-if="row.row_hovered"></div>
        <b-button
          v-if="row.item.decoded"
          size="sm"
          variant="outline-secondary"
          @click="row.toggleDetails"
          class="mr-2 float-right"
        >
          <span v-if="!row.detailsShowing"> <b-icon icon="chevron-double-down"></b-icon> Decode </span>
          <span v-else> <b-icon icon="chevron-double-up"></b-icon> Hide </span>
        </b-button>
      </template>

      <template #row-details="row">
        <b-card>
          <!-- <div style="word-break: break-all"> -->
          <VueJsonPretty :data="row.item.decoded" />
          <!-- </div> -->
        </b-card>
      </template>
    </DataTableV2>
  </div>
</template>

<script>
import DataTableV2 from '@/components/DataTableV2.vue';
import NavTabs from '@/components/NavTabs.vue';
import DataSummary from '@/components/DataSummary.vue';
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import { bigNum } from '@/utils';
import { abi, ScriptEngine } from '@meterio/devkit';
import BigNumber from 'bignumber.js';
import { ethers } from 'ethers';

const TransferABI = new abi.Event({
  anonymous: false,
  inputs: [
    { indexed: true, name: '_from', type: 'address' },
    { indexed: true, name: '_to', type: 'address' },
    { indexed: false, name: '_value', type: 'uint256' }
  ],
  name: 'Transfer',
  type: 'event'
});

export default {
  components: {
    NavTabs,
    DataSummary,
    DataTableV2,
    VueJsonPretty
  },
  data() {
    return {
      txHash: '',
      tabs: [{ name: 'Clauses' }, { name: 'Transfers' }, { name: 'Events' }],
      tabValue: 0,
      summary: [],
      clauses: {
        fields: [
          { key: 'index', label: 'Index' },
          { key: 'clause', label: 'Clause' }
        ],
        pagination: { show: true, align: 'center', perPage: 20 },
        items: []
      },
      transfers: {
        fields: [
          { key: 'index', label: 'Index' },
          { key: 'from', label: 'Sender' },
          { key: 'to', label: 'Recipient' },
          { key: 'amountStr', label: 'Amount' }
        ],
        pagination: { show: true, align: 'center', perPage: 20 },
        items: []
      },
      internaltxs: {
        fields: [
          { key: 'clauseIndex', label: 'Clause' },
          { key: 'name', label: 'Name' },
          { key: 'from', label: 'From' },
          { key: 'to', label: 'To' },
          { key: 'value', label: 'Value' },
          { key: 'gasLimit', label: 'gasLimit' }
        ],
        pagination: { show: false, align: 'center', perPage: 20 },
        items: []
      },
      events: {
        fields: [
          { key: 'index', label: 'Index' },
          { key: 'event', label: 'Log' }
        ],
        pagination: { show: true, align: 'center', perPage: 20 },
        items: []
      }
    };
  },
  computed: {
    items() {
      switch (this.tabValue) {
        case 0:
          return this.clauses.items;
        case 1:
          return this.transfers.items;
        case 2:
          return this.events.items;
        case 3:
          return this.internaltxs.items;
      }
      return this.clauses.items;
    },
    fields() {
      switch (this.tabValue) {
        case 0:
          return this.clauses.fields;
        case 1:
          return this.transfers.fields;
        case 2:
          return this.events.fields;
        case 3:
          return this.internaltxs.fields;
      }
      return this.clauses.fields;
    },
    pagination() {
      switch (this.tabValue) {
        case 0:
          return this.clauses.pagination;
        case 1:
          return this.transfers.pagination;
        case 2:
          return this.events.pagination;
        case 3:
          return this.internaltxs.pagination;
      }
      return this.clauses.pagination;
    },
    loadItems() {
      switch (this.tabValue) {
        case 0:
          return this.loadClauses;
        case 1:
          return this.loadTransfers;
        case 2:
          return this.loadEvents;
        case 3:
          return this.loadInternalTxs;
      }
      return this.loadClauses;
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
          this.loadClauses();
          break;
        case 1:
          this.loadTransfers();
          break;
        case 2:
          this.loadEvents();
          break;
        case 3:
          this.loadInternalTxs();
          break;
        default:
          this.loadClauses();
          break;
      }
    },
    init() {
      this.txHash = this.$route.params.hash;
      this.getSummary();
      this.loadData();
    },
    async getSummary() {
      const res = await this.$api.transaction.getTxDetail(this.network, this.txHash);
      const { tx } = res;
      if (!!tx) {
        this.tabs = [
          { name: tx.clauseCount > 0 ? `Clauses (${tx.clauseCount})` : 'Clauses' },
          { name: tx.transferCount > 0 ? `Transfers (${tx.transferCount})` : 'Transfers' },
          { name: tx.eventCount > 0 ? `Events (${tx.eventCount})` : 'Events' },
          { name: tx.internaltxsCount > 0 ? `Internal Txs (${tx.internaltxsCount})` : 'Internal Txs' }
        ];
        this.summary = [
          { key: 'Hash', value: tx.hash, type: 'copyable' },
          {
            key: 'Status',
            value: tx.reverted ? `reverted: ${tx.vmError.error},${tx.vmError.reason}` : 'success',
            type: 'status'
          },
          {
            key: 'Block',
            block: tx.block.number,
            value: this.fromNow(tx.block.timestamp),
            time: this.formatTime(tx.block.timestamp),
            type: 'block-link-with-note'
          },
          { key: 'ChainTag', value: tx.chainTag },
          { key: 'Origin', value: tx.origin, type: 'address-link' },
          { key: 'Fee', value: tx.paid, type: 'amount', token: this.currentChain.symbol },
          {
            key: 'BlockRef',
            value: tx.blockRef,
            type: 'blockRef',
            ref: new BigNumber(tx.blockRef.substring(0, 10)).toFixed()
          },
          { key: 'Expiration', value: tx.expiration },
          { key: 'GasPriceCoef', value: tx.gasPriceCoef },
          { key: 'Gas Used/Limit', value: `${tx.gasUsed} / ${tx.gas}` },
          { key: 'Nonce', value: new BigNumber(tx.nonce).toFixed() }
        ];

        if (tx.tokenTransfers && tx.tokenTransfers.length > 0) {
          this.summary.push({
            key: 'Token Transfers',
            value: tx.tokenTransfers,
            type: 'transfer-highlight'
          });
        }

        if (Array.isArray(tx.contractAddress) && tx.contractAddress.length) {
          this.summary.splice(5, 0, { key: 'To', value: tx.contractAddress, type: 'contract-created-link' });
        }
      }
    },
    async loadClauses() {
      const { clauses } = await this.$api.transaction.getClauses(this.network, this.txHash);
      this.clauses.items = clauses.map((clause, index) => {
        const { abi, methodId, to, token, data, datas, value, decoded } = clause;

        return {
          clause: {
            data: data,
            to: to,
            amount: {
              type: 'amount',
              amount: bigNum(value),
              token: token
            },
            abi,
            methodId,
            datas,
            isDecoded: !!decoded
          },
          decoded,
          index: index + 1
        };
      });
    },
    async loadTransfers() {
      const { transfers } = await this.$api.transaction.getTransfers(this.network, this.txHash);
      this.transfers.items = transfers.map((transfer, index) => {
        return {
          from: transfer.sender,
          to: transfer.recipient,
          amountStr: {
            type: 'amount',
            amount: bigNum(transfer.amount),
            token: transfer.token.toString(),
            precision: 8
          },
          index: index + 1
        };
      });
    },
    async loadInternalTxs() {
      const { internalTxs } = await this.$api.transaction.getInternalTxs(this.network, this.txHash);
      this.internaltxs.items = internalTxs.map(itx => ({
        ...itx,
        gasLimit: itx.gasLimit
      }));
    },
    async loadEvents() {
      const { events } = await this.$api.transaction.getEvents(this.network, this.txHash);

      this.events.items = events.map((event, i) => {
        const { address, topics, data, datas, abi, decoded } = event;

        return {
          index: i,
          event: {
            address,
            topics,
            data,
            datas,
            abi
          },
          decoded
        };
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.card-title {
  font-size: 15px;
}

.vjs-tree {
  font-size: 12px !important;
  word-break: break-all !important;

  .vjs-key {
    font-size: 12px !important;
  }

  .vjs-value {
    font-size: 12px !important;
  }
}

.nav-item {
  margin-right: 15px;
}
</style>
