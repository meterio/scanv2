<template>
  <div class="detail-page">
    <DataSummary :data="summary" :title="summaryTitle" />

    <DataTableV2 :fields="fields" :items="items" :pagination="pagination">
      <template slot="header">
        <NavTabs
          class="px-0"
          :tabs="tabs"
          :value="tabValue"
          @changeTab="navTabChange"
        ></NavTabs>
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
          <template v-if="row.hind !== ''">
            <div v-for="item in row.value" :key="item.index">
              {{ item }}
            </div>
          </template>
          <template v-else>
            {{ row.value }}
          </template>
        </div>

        <div v-if="row.row_hovered"></div>
        <b-button
          v-if="row.item.decoded"
          size="sm"
          variant="outline-secondary"
          @click="row.toggleDetails"
          class="mr-2 float-right"
        >
          <span v-if="!row.detailsShowing">
            <b-icon icon="chevron-double-down"></b-icon> Show Decoded
          </span>
          <span v-else>
            <b-icon icon="chevron-double-up"></b-icon> Hide Decoded
          </span>
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
import DataTableV2 from "@/components/DataTableV2.vue";
import NavTabs from "@/components/NavTabs.vue";
import DataSummary from "@/components/DataSummary.vue";
import { ScriptEngine } from "@meterio/devkit/dist/scriptEngine";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { bigNum } from "@/utils";
import { abi } from "@meterio/devkit";
import BigNumber from "bignumber.js";
import { ethers } from "@meterio/ethers";

const TransferABI = new abi.Event({
  anonymous: false,
  inputs: [
    { indexed: true, name: "_from", type: "address" },
    { indexed: true, name: "_to", type: "address" },
    { indexed: false, name: "_value", type: "uint256" }
  ],
  name: "Transfer",
  type: "event"
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
      tabs: [{ name: "Clauses" }, { name: "Transfers" }, { name: "Events" }],
      tabValue: 0,
      summaryTitle: "Transaction",
      summary: [],
      tx: {},
      clauses: {
        fields: [
          { key: "index", label: "Index" },
          { key: "to", label: "To" },
          { key: "amount", label: "Amount" },
          { key: "data", label: "Data" }
        ],
        pagination: { show: true, align: "center", perPage: 20 },
        items: []
      },
      transfers: {
        fields: [
          { key: "from", label: "Sender" },
          { key: "to", label: "Recipient" },
          { key: "amountStr", label: "Amount" }
        ],
        items: [],
        pagination: { show: true, align: "center", perPage: 20 }
      },
      events: {
        fields: [
          { key: "address", label: "Contract Address" },
          { key: "details", label: "Details" }
        ],
        items: [],
        pagination: { show: true, align: "center", perPage: 20 }
      }
    };
  },
  async mounted() {
    await this.init();
  },
  // async updated() {
  // await this.init();
  // },
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
    }
  },
  methods: {
    navTabChange(val) {
      this.tabValue = val;
    },
    async init() {
      const { hash } = this.$route.params;
      let start = new Date();
      const res = await this.$api.transaction.getTxDetail(this.network, hash);
      let end = new Date();
      console.log(`api cost ${end - start}`);

      start = new Date();
      this.loading = false;
      const { tx, summary, tokens } = res;
      if (!!summary) {
        this.summary = [
          { key: "Hash", value: summary.hash },
          { key: "Type", value: summary.type },
          { key: "Origin", value: summary.origin, type: "address-link" },
          {
            key: "Amount",
            value: summary.totalClauseAmount,
            type: "amount",
            token: summary.token
          },
          { key: "Fee", value: summary.paid, type: "amount", token: "STPT" },
          {
            key: "Result",
            value: summary.reverted ? "reverted" : "success",
            type: "status"
          },
          { key: "Clause Count", value: summary.clauseCount },
          {
            key: "Block",
            block: summary.block.number,
            value: this.fromNow(summary.block.timestamp),
            type: "block-link-with-note"
          }
        ];
      }
      this.tx = tx;
      end = new Date();
      console.log(`summary cost ${end - start}`);

      start = new Date();
      let clauses = [];
      if (tx.clauseCount > 0) {
        let index = 1;
        clauses = tx.clauses.map(c => {
          let decoded = undefined;
          let hint = "";
          const abiData = []
          const scriptengineData = []

          try {
            const se = ScriptEngine;
            // try decode account-lock data
            if (se.IsScriptEngineData(c.data)) {
              const scriptData = se.decodeScriptData(
                Buffer.from(c.data.replace("0xffffffff", ""), "hex")
              );
              if (scriptData.header.modId === se.ModuleID.AccountLock) {
                const body = se.decodeAccountLockBody(scriptData.payload);
                decoded = se.jsonFromAccountLockBody(body);
                hint = se.explainAccountLockOpCode(body.opCode);
              } else if (scriptData.header.modId === se.ModuleID.Auction) {
                const body = se.decodeAuctionBody(scriptData.payload);
                decoded = se.jsonFromAuctionBody(body);
                hint = se.explainAuctionOpCode(body.opCode, body.option);
              } else if (scriptData.header.modId === se.ModuleID.Staking) {
                const body = se.decodeStakingBody(scriptData.payload);
                decoded = se.jsonFromStakingBody(body);
                hint = se.explainStakingOpCode(body.opCode);
              }
            } else {
              if(c.knownMethod) {
                if (c.knownMethod.name) {
                  abiData.push(`Function: ${c.knownMethod.name}`);
                }
                if (c.knownMethod.signature) {
                  abiData.push(`MethodID: ${c.knownMethod.signature}`);
                }
              }

              for (let i = 10; i < c.data.length; i += 64) {
                abiData.push(`[${Math.ceil(i / 64)}]: ${c.data.substr(i, 64)}`);
              }
            }
          } catch (e) {
            console.log(e);
          }

          if (hint) {
            scriptengineData.push('Function: scriptengine');
            scriptengineData.push('MethodID: 0xffffffff');
            scriptengineData.push(`${c.data} (${hint})`);
          }

          return {
            ...c,
            data: hint ? scriptengineData : abiData,
            amount: {
              type: "amount",
              amount: bigNum(c.value),
              token: c.token,
              precision: 6
            },
            index: index++,
            decoded,
            hint
          };
        });
      }
      this.clauses.items = clauses;
      end = new Date();
      console.log(`clauses cost ${end - start}`);

      start = new Date();
      this.transfers.items = tx.groupedTransfers.map(tr => {
        return {
          from: tr.sender,
          to: tr.recipient,
          amountStr: {
            type: "amount",
            amount: bigNum(tr.amount),
            token: tr.token == 0 ? "STPT" : "VERSE",
            precision: 8
          }
        };
      });
      end = new Date();
      console.log(`transfers cost ${end - start}`);

      start = new Date();
      this.events.items = tx.events.map(e => {
        const _data = [];
        for (let i = 10; i < e.data.length; i += 64) {
          _data.push(e.data.substr(i, 64))
        }
        return {
          address: e.address,
          details: {
            name: e.knownEvent.name,
            topics: e.topics,
            data: _data
          }
        }
      });
      end = new Date();
      console.log(`events cost ${end - start}`);

      start = new Date();
      let transferHighlights = [];
      const knownTokens = this.$store.state.dom.knownTokens;
      for (const ev of tx.events) {
        const { topics, address, data } = ev;
        if (topics && topics.length > 1) {
          const topic0 = topics[0];

          if (topic0 === TransferABI.signature) {
            const decoded = TransferABI.decode(data, topics);
            let token = tokens[address];
            if (!token && address in knownTokens) {
              token = knownTokens[address];
            }
            let sym = "ERC20";
            let decimals = 18;
            if (token) {
              sym = token.symbol;
              decimals = token.decimals;
            }
            transferHighlights.push({
              address,
              from:
                decoded._from === "0x0000000000000000000000000000000000000000"
                  ? address
                  : decoded._from,
              to: decoded._to,
              amount: new BigNumber(decoded._value).toFixed(),
              token: sym,
              decimals
            });
          }
        }
      }
      end = new Date();
      console.log(`events cost ${end - start}`);

      if (transferHighlights.length > 0) {
        this.summary.push({
          key: "Token Transfers",
          value: transferHighlights,
          type: "transfer-highlight"
        });
      }
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
</style>
