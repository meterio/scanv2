<template>
  <b-container class="table-container data-table-container">
    <b-card>
      <div class="header">
        <b-row>
          <b-col>
            <h3 class="title">Validators</h3>
          </b-col>

          <b-col>
            <div class="btn-nav">
              <b-button-group>
                <b-button
                  :variant="tab == current_tab ? 'primary' : 'outline-primary'"
                  v-for="(tab, idx) in tabs"
                  :key="idx"
                  @click="switchTab(tab)"
                  >{{ tab }}</b-button
                >
              </b-button-group>
            </div>
          </b-col>

          <b-col>
            <div class="form-group has-search">
              <span class="form-control-feedback">
                <b-icon icon="search"></b-icon>
              </span>

              <input
                type="text"
                class="form-control"
                placeholder="Search"
                v-model="validate_right_search"
              />
            </div>
          </b-col>
        </b-row>
      </div>
      <Loading v-if="loading"></Loading>
      <b-table
        v-else
        hover
        class="data-table"
        :sort-by.sync="sortBy"
        :sort-desc.sync="sortDesc"
        :items="validator_data.items"
        :fields="validator_data.fields"
        show-empty
      >
        <template slot="empty">
          <div class="text-center pt15 text-grey" style="color: #5c6f8c">
            No data available.
          </div>
        </template>
        <template v-slot:cell(addressWithName)="data">
          <div class="dt-row">
            <address-link
              :address="data.value.address"
              :name="data.value.name"
            />
          </div>
        </template>
        <template v-slot:cell(totalPoints)="data">
          <div class="dt-row">
            <router-link
              v-if="data.value.penalty > 0"
              :to="{
                name: 'statDetail',
                params: { address: data.value.address },
              }"
              >{{ data.value.penalty }}</router-link
            >
            <span v-else>-</span>
          </div>
        </template>
        <template v-slot:cell(name)="data">
          <div class="dt-row" style="word-break: break-all">
            {{ data.value }}
          </div>
        </template>
        <template v-slot:cell(address)="data">
          <div class="dt-row" style="word-break: break-all">
            <router-link
              class="link"
              :to="{
                name: 'validatorDetail',
                params: { address: data.value },
              }"
            >
              {{ data.value }}
            </router-link>
          </div>
        </template>
        <template v-slot:cell(jailedTime)="data">
          <div class="dt-row">
            {{ fromNow(data.value * 1000) }}
          </div>
        </template>

        <template v-slot:cell()="data">
          <div class="dt-row">
            <!-- amount tag -->
            <amount-tag
              v-if="data.value.type == 'amount'"
              :amount="data.value.amount"
              :token="data.value.token"
              :precision="data.value.precision"
            />
            <span v-else>{{ data.value }}</span>
          </div>
        </template>
      </b-table>
      <b-row v-if="validate_table_total > page_size">
        <b-col sm="7" md="6" offset-sm="3" offset-md="3">
          <b-pagination
            v-model="current_page"
            :total-rows="validate_table_total"
            :per-page="page_size"
            align="fill"
            size="sm"
            @change="pageChange"
          />
        </b-col>
      </b-row>
    </b-card>
  </b-container>
</template>

<script>
import Loading from "@/components/Loading";
import AddressLink from "@/components/AddressLink";
import AmountTag from "@/components/AmountTag";
import { fromNow, formatTime } from "@/utils";
import {SYSTEM_TOKEN} from "../config";

export default {
  name: "ValidatorTable",
  data() {
    return {
      sortBy: "votingPowerStr",
      sortDesc: true,
      page_size: 15,
      loading: true,
      current_tab: "Delegates",
      tabs: ["Delegates", "Candidates", "Jailed"],
      current_page: 1,
      validate_table_total: 0,
      validate_right_search: "",
      validator_data: {
        fields: [],
        items: [],
      },
    };
  },
  components: {
    Loading,
    AmountTag,
    AddressLink,
  },
  watch: {
    validate_right_search(newVal) {
      this.loadData();
    },
  },
  methods: {
    init() {
      this.loadData();
    },
    formatTime(value) {
      return formatTime(value);
    },
    fromNow(value) {
      return fromNow(value);
    },
    switchTab(tab) {
      this.current_tab = tab;
      this.current_page = 1;
      this.loading = true;
      this.loadData();
    },
    pageChange(val) {
      this.current_page = val;
      this.loading = true;
      this.loadData();
    },
    async loadData() {
      try {
        const res = await this.$api.validator.getValidateTypeList(
          this.network,
          this.current_page,
          this.page_size,
          this.current_tab,
          this.validate_right_search
        );
        this.loading = false;
        this.validate_table_total = res.totalRows;
        if (this.current_tab === "Delegates") {
          this.validator_data.fields = [
            { key: "addressWithName", label: "Address" },
            { key: "votingPower", label: "Total Votes" },
            { key: "commission%", label: "Commission Rate" },
            // { key: "shares%", label: "Pool Share%" },
            { key: "totalPoints", label: "Penalty Points" },
          ];
          this.validator_data.items = res.delegates.map((d) => ({
            ...d,
            votingPower: {
              type: "amount",
              amount: d.votingPower,
              token: SYSTEM_TOKEN,
              precision: 2,
            },
            addressWithName: { address: d.address, name: d.name },
            totalPoints: { address: d.address, penalty: d.totalPoints },
          }));
        }
        if (this.current_tab === "Candidates") {
          this.validator_data.fields = [
            { key: "addressWithName", label: "Address" },
            { key: "totalVotes", label: "Total Votes" },
            { key: "commission%", label: "Commission Rate" },
            { key: "totalPoints", label: "Penalty Points" },
          ];
          this.validator_data.items = res.candidates.map((c) => ({
            ...c,
            totalVotes: {
              type: "amount",
              amount: c.totalVotes,
              token: SYSTEM_TOKEN,
              precision: 2,
            },
            addressWithName: { address: c.address, name: c.name },
            totalPoints: { address: c.address, penalty: c.totalPoints },
          }));
        }
        if (this.current_tab === "Jailed") {
          this.validator_data.fields = [
            { key: "addressWithName", label: "Address" },
            { key: "totalPoints", label: "Penalty Points" },
            { key: "jailedTime", label: "Jailed Time" },
            { key: "bailAmount", label: "Bail Amount" },
          ];
          this.validator_data.items = res.jailed.map((j) => ({
            ...j,
            addressWithName: { address: j.address, name: j.name },
            totalPoints: { address: j.address, penalty: j.totalPoints },
          }));
        }
      } catch (e) {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.header {
  margin-bottom: 20px;

  .title {
    display: flex;
    align-items: center;
    height: 100%;
  }
}

.has-search .form-control {
  padding-left: 2.375rem;
}

.has-search .form-control-feedback {
  position: absolute;
  z-index: 2;
  display: block;
  width: 2.375rem;
  height: 2.375rem;
  line-height: 2.375rem;
  text-align: center;
  pointer-events: none;
  color: #aaa;
}
</style>
