<template>
  <div class="detail-page">
    <DataSummary :data="summary" :title="summaryTitle" />

    <DataTableV2 :fields="fields" :items="items">
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
import BigNumber from "bignumber.js";
import DataTableV2 from "@/components/DataTableV2.vue";
import NavTabs from "@/components/NavTabs.vue";
import DataSummary from "@/components/DataSummary.vue";
import * as dev from "@meterio/devkit";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

// import "vue-json-pretty/lib/style.css";
export const StakingModuleAddress =
  "0x" +
  Buffer.from("staking-module-address")
    .toString("hex")
    .padStart(40, "0")
    .slice(-40);
export const AuctionModuleAddress =
  "0x" +
  Buffer.from("auction-account-address")
    .toString("hex")
    .padStart(40, "0")
    .slice(-40);
export const AccountLockModuleAddress =
  "0x" +
  Buffer.from("account-lock-address")
    .toString("hex")
    .padStart(40, "0")
    .slice(-40);
export default {
  components: {
    NavTabs,
    DataSummary,
    DataTableV2,
    VueJsonPretty,
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
          { key: "data", label: "Data" },
        ],
        items: [],
      },
      transfers: {
        fields: [
          { key: "from", label: "Sender" },
          { key: "to", label: "Recipient" },
          { key: "amountStr", label: "Amount" },
        ],
        items: [],
      },
      events: {
        fields: [
          { key: "address", label: "Contract Address" },
          { key: "topics", label: "Topics" },
          { key: "data", label: "Data" },
        ],
        items: [],
      },
    };
  },
  async mounted() {
    const { hash } = this.$route.params;
    const res = await this.$api.transaction.getTxDetail(this.network, hash);
    this.loading = false;
    const { tx, summary } = res;
    if (!!summary) {
      this.summary = [
        { key: "Hash", value: summary.hash },
        { key: "Type", value: summary.type },
        { key: "Origin", value: summary.origin, type: "address-link" },
        {
          key: "Amount",
          value: summary.totalClauseAmount,
          type: "amount",
          token: summary.token,
        },
        { key: "Fee", value: summary.paid, type: "amount", token: "MTR" },
        {
          key: "Result",
          value: summary.reverted ? "reverted" : "success",
          type: "status",
        },
        { key: "Clause Count", value: summary.clauseCount },
        { key: "Block", value: summary.block.number, type: "block-link" },
      ];
    }
    this.tx = tx;
    let clauses = [];
    if (tx.clauseCount > 0) {
      let index = 1;
      clauses = tx.clauses.map((c) => {
        let decoded = undefined;
        let hint = "";

        try {
          const se = dev.ScriptEngine;
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
          }
        } catch (e) {
          console.log(e);
        }

        return {
          ...c,
          data: hint ? `${c.data} (${hint})` : c.data,
          amount: {
            type: "amount",
            amount: new BigNumber(c.value),
            token: c.token,
            precision: 6,
          },
          index: index++,
          decoded,
          hint,
        };
      });
    }
    this.clauses.items = clauses;
    this.transfers.items = tx.transfers.map((tr) => {
      return {
        from: tr.sender,
        to: tr.recipient,
        amountStr: {
          type: "amount",
          amount: new BigNumber(tr.amount).toFixed(),
          token: tr.token == 0 ? "MTR" : "MTRG",
          precision: 8,
        },
      };
    });
    this.events.items = tx.events;
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
  },
  methods: {
    navTabChange(val) {
      this.tabValue = val;
    },
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
</style>
