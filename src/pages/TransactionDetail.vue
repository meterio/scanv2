<template>
  <div class="detail-page">
    <DataSummary :data="summary" :title="summaryTitle" />

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
              params: { address: data.value },
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
          <span v-if="!row.detailsShowing"> <b-icon icon="chevron-double-down"></b-icon> Show Decoded </span>
          <span v-else> <b-icon icon="chevron-double-up"></b-icon> Hide Decoded </span>
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
    { indexed: false, name: '_value', type: 'uint256' },
  ],
  name: 'Transfer',
  type: 'event',
});

export default {
  components: {
    NavTabs,
    DataSummary,
    DataTableV2,
    VueJsonPretty,
  },
  data() {
    return {
      txHash: '',
      tabs: [{ name: 'Clauses' }, { name: 'Transfers' }, { name: 'Events' }],
      tabValue: 0,
      summaryTitle: 'Transaction',
      summary: [],
      clauses: {
        fields: [
          { key: 'index', label: 'Index' },
          { key: 'clause', label: 'Clause' },
        ],
        pagination: { show: true, align: 'center', perPage: 20 },
        items: [],
      },
      transfers: {
        fields: [
          { key: 'index', label: 'Index' },
          { key: 'from', label: 'Sender' },
          { key: 'to', label: 'Recipient' },
          { key: 'amountStr', label: 'Amount' },
        ],
        pagination: { show: true, align: 'center', perPage: 20 },
        items: [],
      },
      events: {
        fields: [
          { key: 'index', label: 'Index' },
          { key: 'event', label: 'Log' },
        ],
        pagination: { show: true, align: 'center', perPage: 20 },
        items: [],
      },
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
      }
      return this.loadClauses;
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
          this.loadClauses();
          break;
        case 1:
          this.loadTransfers();
          break;
        case 2:
          this.loadEvents();
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
        ];
        this.summary = [
          { key: 'Hash', value: tx.hash },
          {
            key: 'Status',
            value: tx.reverted ? `reverted ( ${tx.vmError.error} )` : 'success',
            type: 'status',
          },
          {
            key: 'Block',
            block: tx.block.number,
            value: this.fromNow(tx.block.timestamp),
            time: this.formatTime(tx.block.timestamp),
            type: 'block-link-with-note',
          },
          { key: 'ChainTag', value: tx.chainTag },
          { key: 'Origin', value: tx.origin, type: 'address-link' },
          { key: 'Fee', value: tx.paid, type: 'amount', token: 'MTR' },
          {
            key: 'BlockRef',
            value: tx.blockRef,
            type: 'blockRef',
            ref: new BigNumber(tx.blockRef.substring(0, 10)).toFixed(),
          },
          { key: 'Expiration', value: tx.expiration },
          { key: 'GasPriceCoef', value: tx.gasPriceCoef },
          { key: 'Gas Used/Limit', value: `${tx.gasUsed} / ${tx.gas}` },
          { key: 'Nonce', value: new BigNumber(tx.nonce).toFixed() },
        ];

        let transferHighlights = [];
        const knownTokens = this.$store.state.dom.knownTokens;
        for (const ev of tx.events) {
          const { topics, address, data } = ev;
          if (topics && topics.length > 1) {
            const topic0 = topics[0];

            if (topic0 === TransferABI.signature) {
              const decoded = TransferABI.decode(data, topics);
              let token;
              if (address in knownTokens) {
                token = knownTokens[address];
              }
              let sym = 'ERC20';
              let decimals = 18;
              if (token) {
                sym = token.symbol;
                decimals = token.decimals;
              }
              transferHighlights.push({
                address,
                from: decoded._from === '0x0000000000000000000000000000000000000000' ? address : decoded._from,
                to: decoded._to,
                amount: new BigNumber(decoded._value).toFixed(),
                token: sym,
                decimals,
              });
            }
          }
        }

        if (transferHighlights.length > 0) {
          this.summary.push({
            key: 'Token Transfers',
            value: transferHighlights,
            type: 'transfer-highlight',
          });
        }
      }
    },
    async loadClauses() {
      const { clauses } = await this.$api.transaction.getClauses(this.network, this.txHash);
      this.clauses.items = clauses.map((clause, index) => {
        const isSE = ScriptEngine.IsScriptEngineData(clause.data);
        let selector = undefined;
        let datas = [];
        let abiStr = undefined;
        let decoded = undefined;
        let tail = clause.data ? clause.data.substring(2) : '';
        if (isSE) {
          decoded = ScriptEngine.decodeScriptData(clause.data);
          delete decoded['payload'];
          abiStr = decoded.action;
        } else {
          if (clause.data && clause.data.length >= 10) {
            selector = clause.data.substring(0, 10);
            tail = clause.data.substring(10);
          }

          const { abi, name, data, value } = clause;
          if (abi) {
            const iface = new ethers.utils.Interface([abi]);
            const d = iface.parseTransaction({ data, value });
            console.log(d);
            decoded = {};
            let params = [];
            for (const [index, input] of abi.inputs.entries()) {
              params.push(`${input.type} ${input.name}`);
              const val = d.args[index];
              if (ethers.utils.BigNumber.isBigNumber(val)) {
                decoded[input.name] = val.toString();
              } else {
                decoded[input.name] = val;
              }
            }
            abiStr = `${d.name}( ${params.join(', ')} )`;
          }
        }

        while (tail.length >= 64) {
          datas.push('0x' + tail.substring(0, 64));
          tail = tail.substring(64);
        }
        if (tail.length > 0) {
          datas.push('0x' + tail);
        }
        return {
          clause: {
            data: clause.data,
            to: clause.to,
            amount: {
              type: 'amount',
              amount: bigNum(clause.value),
              token: clause.token,
            },
            abiStr,
            selector,
            datas,
          },
          decoded,
          index: index + 1,
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
            precision: 8,
          },
          index: index + 1,
        };
      });
    },
    async loadEvents() {
      const { events } = await this.$api.transaction.getEvents(this.network, this.txHash);

      let abiStr = undefined;
      this.events.items = events.map((event, i) => {
        const { name, topics, data } = event;
        let decoded = undefined;
        if (event.abi) {
          let abi = event.abi;
          abi.inputs = abi.inputs.map((i) => ({ ...i, indexed: false }));
          const topicsCount = event.topics.length - 1;
          for (let i = 0; i < topicsCount; i++) {
            abi.inputs[i].indexed = true;
          }

          const iface = new ethers.utils.Interface([abi]);
          const log = iface.parseLog(event);
          console.log(log);

          decoded = {};
          let params = [];
          for (const input of abi.inputs) {
            params.push(`${input.indexed ? 'indexed' : ''} ${input.type} ${input.name}`);
            decoded[input.name] = log.values[input.name].toString();
          }
          abiStr = `${log.name} ( ${params.join(', ')} )`;
        }
        let datas = [];
        if (data && data != '0x') {
          let temp = data.substring(2);
          while (temp.length >= 64) {
            datas.push('0x' + temp.substring(0, 64));
            temp = temp.substring(64);
          }
          if (temp.length > 0) {
            datas.push('0x' + temp);
          }
        }
        console.log(datas);

        return {
          index: i,
          event: {
            address: event.address,
            topics,
            data,
            datas,
            abi,
            abiStr,
          },
          decoded,
        };
      });
    },
    // async init1() {
    //   const { hash } = this.$route.params;
    //   let start = new Date();
    //   const res = await this.$api.transaction.getTxDetail(this.network, hash);
    //   let end = new Date();
    //   console.log(`api cost ${end - start}`);

    //   start = new Date();
    //   this.loading = false;
    //   const { tx, summary, tokens } = res;
    //   if (!!summary) {
    //     this.summary = [
    //       { key: 'Hash', value: summary.hash },
    //       { key: 'Origin', value: summary.origin, type: 'address-link' },
    //       { key: 'Fee', value: summary.paid, type: 'amount', token: 'MTR' },
    //       // { key: "BlockRef", value: summary.blockRef },
    //       { key: 'Expiration', value: summary.expiration },
    //       {
    //         key: 'Result',
    //         value: summary.reverted ? `reverted(${summary.vmError.error})` : 'success',
    //         type: 'status',
    //       },
    //       { key: 'Clause Count', value: summary.clauseCount },
    //       {
    //         key: 'Block',
    //         block: summary.block.number,
    //         value: this.fromNow(summary.block.timestamp),
    //         type: 'block-link-with-note',
    //       },
    //     ];
    //     if (summary.reverted) {
    //       this.summary.push({
    //         key: 'VM Error',
    //         value: summary.vmError.reason || summary.vmError.error,
    //       });
    //     }
    //   }
    //   this.tx = tx;
    //   end = new Date();
    //   console.log(`summary cost ${end - start}`);

    //   start = new Date();
    //   let clauses = [];
    //   if (tx.clauseCount > 0) {
    //     let index = 1;
    //     clauses = tx.clauses.map((c) => {
    //       let decoded = undefined;
    //       let hint = '';

    //       try {
    //         const se = ScriptEngine;
    //         // try decode account-lock data
    //         if (se.IsScriptEngineData(c.data)) {
    //           const scriptData = se.decodeScriptData(c.data);
    //           decoded = scriptData.body;
    //           hint = scriptData.action;
    //         } else {
    //           if (c.knownMethod) {
    //             if (c.knownMethod.abi) {
    //               const abi = JSON.parse(c.knownMethod.abi);
    //               const coder = new ethers.utils.AbiCoder();
    //               const inputsType = abi.inputs.map((item) => item.type);
    //               // console.log('inputsType', inputsType)
    //               const method = abi.name + '(' + abi.inputs.map((item) => item.name + ' ' + item.type).join(',') + ')';
    //               const result = coder.decode(inputsType, ethers.utils.hexDataSlice(c.data, 4));
    //               // console.log('result: ', result)
    //               const formatRes = {};
    //               for (let index in abi.inputs) {
    //                 formatRes[abi.inputs[index].name] = result[index].toString();
    //               }
    //               decoded = {
    //                 method,
    //                 ...formatRes,
    //               };
    //             }
    //           }
    //         }
    //       } catch (e) {
    //         console.log(e);
    //       }

    //       return {
    //         ...c,
    //         data: hint ? `${c.data} (${hint})` : c.data,
    //         amount: {
    //           type: 'amount',
    //           amount: bigNum(c.value),
    //           token: c.token,
    //           precision: 6,
    //         },
    //         index: index++,
    //         decoded,
    //         hint,
    //       };
    //     });
    //   }
    //   this.clauses.items = clauses;
    //   end = new Date();
    //   console.log(`clauses cost ${end - start}`);

    //   start = new Date();
    //   let transfers = [];
    //   let events = [];
    //   for (const o of tx.outputs) {
    //     for (const tr of o.transfers) {
    //       transfers.push({
    //         from: tr.sender,
    //         to: tr.recipient,
    //         amountStr: {
    //           type: 'amount',
    //           amount: bigNum(tr.amount),
    //           token: tr.token == 0 ? 'MTR' : 'MTRG',
    //           precision: 8,
    //         },
    //       });
    //     }
    //     for (const e of o.events) {
    //     }
    //   }
    //   this.transfers.items = tx.transfers.map((tr) => {
    //     return;
    //   });
    //   end = new Date();
    //   console.log(`transfers cost ${end - start}`);

    //   start = new Date();
    //   this.events.items = tx.events.map((e) => {
    //     let decoded = undefined;
    //     if (e.topics.length && e.knownEvent.abi) {
    //       const abi = JSON.parse(e.knownEvent.abi);
    //       console.log('event abi', abi);
    //       const coder = new ethers.utils.AbiCoder();
    //       const inputsType = abi.inputs.map((item) => item.type);
    //       // console.log('inputsType', inputsType)
    //       const event =
    //         abi.name +
    //         '(' +
    //         abi.inputs
    //           .map((item) => {
    //             let params = item.name;
    //             if (item.indexed) {
    //               params += ' indexed';
    //             }
    //             params += ' ' + item.type;
    //             return params;
    //           })
    //           .join(',') +
    //         ')';

    //       const topicStr = e.topics.map((t, i) => {
    //         if (i === 0) {
    //           return '';
    //         } else {
    //           return t.substr(2); //remove 0x
    //         }
    //       });
    //       let eventData = '';
    //       if (e.data) {
    //         eventData = e.data.substr(2);
    //       }
    //       const data = '0x' + topicStr.join('') + eventData;
    //       const result = coder.decode(inputsType, data);
    //       console.log('result: ', result);
    //       const formatRes = {};
    //       for (let index in abi.inputs) {
    //         formatRes[abi.inputs[index].name] = result[index].toString();
    //       }
    //       decoded = {
    //         event,
    //         ...formatRes,
    //       };
    //     }
    //     console.log();
    //     return {
    //       address: e.address,
    //       details: {
    //         topics: e.topics,
    //         data: e.data,
    //       },
    //       decoded,
    //     };
    //   });
    //   end = new Date();
    //   console.log(`events cost ${end - start}`);

    //   start = new Date();
    //   let transferHighlights = [];
    //   const knownTokens = this.$store.state.dom.knownTokens;
    //   for (const ev of tx.events) {
    //     const { topics, address, data } = ev;
    //     if (topics && topics.length > 1) {
    //       const topic0 = topics[0];

    //       if (topic0 === TransferABI.signature) {
    //         const decoded = TransferABI.decode(data, topics);
    //         let token = tokens[address];
    //         if (!token && address in knownTokens) {
    //           token = knownTokens[address];
    //         }
    //         let sym = 'ERC20';
    //         let decimals = 18;
    //         if (token) {
    //           sym = token.symbol;
    //           decimals = token.decimals;
    //         }
    //         transferHighlights.push({
    //           address,
    //           from: decoded._from === '0x0000000000000000000000000000000000000000' ? address : decoded._from,
    //           to: decoded._to,
    //           amount: new BigNumber(decoded._value).toFixed(),
    //           token: sym,
    //           decimals,
    //         });
    //       }
    //     }
    //   }
    //   end = new Date();
    //   console.log(`events cost ${end - start}`);

    //   if (transferHighlights.length > 0) {
    //     this.summary.push({
    //       key: 'Token Transfers',
    //       value: transferHighlights,
    //       type: 'transfer-highlight',
    //     });
    //   }
    // },
  },
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
