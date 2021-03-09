<template>
  <div class="detail-page">
    <DataSummary :data="summary" :title="summaryTitle" />

    <DataTableV2
      title="Clauses"
      :fields="clauses.fields"
      :items="clauses.items"
    >
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
import DataSummary from "@/components/DataSummary.vue";
import * as dev from "@meterio/devkit";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";
import { fromWei } from "@/utils";

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
    DataSummary,
    DataTableV2,
    VueJsonPretty,
  },
  data() {
    return {
      summaryTitle: "",
      summary: [],
      tx: {},
      clauses: {
        fields: [
          { key: "index", label: "Index" },
          { key: "addrAndName", label: "To" },
          { key: "amount", label: "Amount" },
          { key: "data", label: "Data" },
          { key: "show_details", label: "" },
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
    this.summaryTitle = "Transaction";
    if (!!summary) {
      const totalAmount = fromWei(summary.totalClauseAmount, -1, summary.token);
      const fee = fromWei(summary.paid, 6) + " MTR";
      this.summary = [
        { key: "Hash", value: summary.hash },
        { key: "Type", value: summary.type },
        { key: "Origin", value: summary.origin, type: "address-link" },
        { key: "Amount", value: totalAmount },
        { key: "Fee", value: fee },
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
        const amount = new BigNumber(c.value).dividedBy(1e18).toFixed();
        let addrAndName = { address: c.to, name: "" };
        let decoded = undefined;

        try {
          if (c.to === AccountLockModuleAddress) {
            addrAndName.name = "account-lock";
          }
          if (c.to === AuctionModuleAddress) {
            addrAndName.name = "auction";
          }
          if (c.to === StakingModuleAddress) {
            addrAndName.name = "staking";
          }
          // try decode account-lock data
          if (c.data.startsWith("0xffffffffdeadbeef")) {
            const scriptData = dev.ScriptEngine.decodeScriptData(
              Buffer.from(c.data.replace("0xffffffff", ""), "hex")
            );
            if (
              scriptData.header.modId === dev.ScriptEngine.ModuleID.AccountLock
            ) {
              const body = dev.ScriptEngine.decodeAccountLockBody(
                scriptData.payload
              );
              decoded = dev.ScriptEngine.jsonFromAccountLockBody(body);
            } else if (
              scriptData.header.modId === dev.ScriptEngine.ModuleID.Auction
            ) {
              const body = dev.ScriptEngine.decodeAuctionBody(
                scriptData.payload
              );
              decoded = dev.ScriptEngine.jsonFromAuctionBody(body);
            } else if (
              scriptData.header.modId === dev.ScriptEngine.ModuleID.Staking
            ) {
              const body = dev.ScriptEngine.decodeStakingBody(
                scriptData.payload
              );
              decoded = dev.ScriptEngine.jsonFromStakingBody(body);
            }
          }
        } catch (e) {
          console.log(e);
        }

        return {
          ...c,
          addrAndName,
          amount: `${amount} ${c.token}`,
          index: index++,
          decoded,
        };
      });
    }
    this.clauses.items = clauses;
  },
  methods: {},
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
