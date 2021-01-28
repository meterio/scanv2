<template>
  <div class="detail-page">
    <DataSummary :data="summary" :title="summaryTitle" />

    <DataTable title="Clauses" :data="clauses.data">
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
        <!-- <div style="word-break: break-all"> -->
        <div class="dt-row breakable">
          {{ row.value }}
        </div>

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
        <b-card title="Decoded">
          <!-- <div style="word-break: break-all"> -->
          <VueJsonPretty :data="row.item.decoded" />
          <!-- </div> -->
        </b-card>
      </template>
    </DataTable>
  </div>
</template>

<script>
import BigNumber from "bignumber.js";
import DataTable from "@/components/DataTable.vue";
import DataSummary from "@/components/DataSummary.vue";
import * as dev from "@meterio/devkit";
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

// import "vue-json-pretty/lib/style.css";

export default {
  components: {
    DataSummary,
    DataTable,
    VueJsonPretty,
  },
  data() {
    return {
      summaryTitle: "",
      summary: [],
      tx: {},
      clauses: {
        data: {
          fields: [
            { key: "index", label: "Index" },
            { key: "addrAndName", label: "To" },
            { key: "amount", label: "Amount" },
            { key: "data", label: "Data" },
            { key: "show_details", label: "" },
          ],
          items: [],
        },
      },
    };
  },
  async mounted() {
    const { hash } = this.$route.params;
    const res = await this.$api.transaction.getTxDetail(this.network, hash);
    this.loading = false;
    console.log(res);
    const { tx, summary } = res;
    this.summaryTitle = "Transaction";
    if (!!summary) {
      this.summary = [
        { key: "Hash", value: summary.hash },
        { key: "Type", value: summary.type },
        { key: "Origin", value: summary.origin, type: "address-link" },
        { key: "Amount", value: summary.totalAmountStrs[0] },
        { key: "Fee", value: summary.feeStr },
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
          // try decode account-lock data
          if (c.to === "0x6163636f756e742d6c6f636b2d61646472657373") {
            addrAndName.name = "account-lock";
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
            }
          }
          // try decode auction data
          if (c.to === "0x74696f6e2d6163636f756e742d61646472657373") {
            addrAndName.name = "auction";
            const scriptData = dev.ScriptEngine.decodeScriptData(
              Buffer.from(c.data.replace("0xffffffff", ""), "hex")
            );
            if (scriptData.header.modId === dev.ScriptEngine.ModuleID.Auction) {
              const body = dev.ScriptEngine.decodeAuctionBody(
                scriptData.payload
              );
              decoded = dev.ScriptEngine.jsonFromAuctionBody(body);
            }
          }

          // try decode staking data
          if (c.to === "0x616b696e672d6d6f64756c652d61646472657373") {
            addrAndName.name = "staking";
            const scriptData = dev.ScriptEngine.decodeScriptData(
              Buffer.from(c.data.replace("0xffffffff", ""), "hex")
            );
            if (scriptData.header.modId === dev.ScriptEngine.ModuleID.Staking) {
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
    this.clauses.data.items = clauses;
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
