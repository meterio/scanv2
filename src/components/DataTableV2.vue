<template>
  <b-container class="table-container data-table-container">
    <b-card :title="title">
      <slot name="header"></slot>
      <b-table
        hover
        class="data-table"
        :items="itemsLocal"
        :fields="fields"
        :busy.sync="loading"
        show-empty
        :style="{ minHeight: minHeight }"
      >
        <template #table-busy>
          <div class="text-center">
            <b-spinner
              variant="primary"
              type="grow"
              label="Spinning"
            ></b-spinner>
          </div>
        </template>
        <template slot="empty">
          <div class="text-center pt15 text-grey" style="color: #5c6f8c">
            No data available.
          </div>
        </template>

        <template
          v-for="slotName in Object.keys($scopedSlots)"
          v-slot:[slotName]="slotScope"
        >
          <slot :name="slotName" v-bind="slotScope"></slot>
        </template>

        <!-- Time column template -->
        <template v-slot:cell(time)="data">
          <div class="dt-row">
            <span class="time">{{ data.value }}</span>
          </div>
        </template>

        <!-- Time column template -->
        <template v-slot:cell(timestamp)="data">
          <div class="dt-row">
            <span class="time">{{ fromNow(data.value) }}</span>
          </div>
        </template>

        <template v-slot:cell(direct)="data">
          <div class="dt-row">
            <DirectTag :direct="data.value" />
          </div>
        </template>

        <!-- Txhash column template -->
        <template v-slot:cell(txhash)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{
                name: 'txDetail',
                params: { hash: data.value },
              }"
              >{{ shortHash(data.value) }}</router-link
            >
          </div>
        </template>

        <!-- Address column template -->
        <template v-slot:cell(fullAddress)="data">
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

        <template v-slot:cell(address)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{
                name: 'address',
                params: { address: data.value },
              }"
              >{{ shortAddr(data.value) }}</router-link
            >
          </div>
        </template>

        <template v-slot:cell(from)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{
                name: 'address',
                params: { address: data.value },
              }"
              >{{ shortAddr(data.value) }}</router-link
            >
          </div>
        </template>
        <template v-slot:cell(to)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{
                name: 'address',
                params: { address: data.value },
              }"
              >{{ shortAddr(data.value) }}</router-link
            >
          </div>
        </template>

        <!-- Block column template-->
        <template v-slot:cell(blocknum)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{
                name: 'blockDetail',
                params: { revision: data.value },
              }"
              >#{{ data.value }}</router-link
            >
          </div>
        </template>

        <!-- Block hash column template -->
        <template v-slot:cell(blockhash)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{
                name: 'blockDetail',
                params: { revision: data.value },
              }"
              >{{ shortHash(data.value) }}</router-link
            >
          </div>
        </template>

        <!-- Auction column template-->
        <template v-slot:cell(auctionid)="data">
          <div class="dt-row">
            <router-link
              :to="{ name: 'auctionDetail', params: { auctionID: data.value } }"
              >Bids</router-link
            >
          </div>
        </template>

        <!-- Mining Reward -->
        <template v-slot:cell(powReward)="data">
          <div class="dt-row">
            <router-link
              :to="{ name: 'powRewards', params: { epoch: data.value } }"
            >
              Rewards
            </router-link>
          </div>
        </template>

        <!-- Pos Reward template -->
        <template v-slot:cell(posReward)="data">
          <div class="dt-row">
            <router-link
              :to="{ name: 'posRewards', params: { epoch: data.value } }"
              >Rewards</router-link
            >
          </div>
        </template>

        <!-- default template -->
        <template v-slot:cell()="data">
          <div class="dt-row">
            <span>{{ data.value }}</span>
          </div>
        </template>
      </b-table>

      <div
        v-if="pagination.show && totalRows >= pagination.perPage"
        class="data-pagination"
      >
        <b-pagination
          :align="pagination.align"
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="pagination.perPage"
          @change="pageChange"
        ></b-pagination>
      </div>
    </b-card>
  </b-container>
</template>

<script>
import DirectTag from "./DirectTag.vue";
export default {
  components: { DirectTag },
  name: "DataTable",
  props: {
    title: {
      type: String,
    },
    minHeight: {
      type: String,
      default: "auto",
    },
    items: {
      type: Array,
      default: function () {
        return [];
      },
    },
    fields: {
      type: Array,
      default: function () {
        return [];
      },
    },
    pagination: {
      type: Object,
      default: function () {
        return {
          show: false,
          align: "right",
        };
      },
    },
    loadItems: {
      type: Function,
    },
  },
  data() {
    return {
      itemsLocal: [],
      totalRows: 0,
      currentPage: 1,
      loading: false,
    };
  },
  async beforeMount() {
    this.init();
  },
  computed: {
    passedItems() {
      if (this.items) {
        return this.items.map((i) => i);
      }
      return undefined;
    },
  },
  watch: {
    passedItems(to, from) {
      this.init();
    },
  },
  methods: {
    async init() {
      this.loading = true;
      try {
        if (!!this.passedItems && this.passedItems.length > 0) {
          const start = (this.currentPage - 1) * this.pagination.perPage;
          let end = 0;
          if (
            this.passedItems.length >=
            this.currentPage * this.pagination.perPage
          ) {
            end = this.currentPage * this.pagination.perPage;
          } else {
            end = this.passedItems.length;
          }
          this.itemsLocal = this.passedItems.slice(start, end);
          this.totalRows = this.passedItems.length;
        }
        if (!this.loadItems) {
          this.loading = false;
          return;
        }
        const res = await this.loadItems(
          this.network,
          this.currentPage,
          this.pagination.perPage
        );
        const { items, totalRows } = res;
        this.itemsLocal = items;
        this.totalRows = totalRows;
      } catch (e) {
        console.log(e);
        this.itemsLocal = [];
        this.totalRows = 0;
      }

      this.loading = false;
    },
    async pageChange(val) {
      if (val === this.currentPage) {
        return;
      }
      this.currentPage = val;
      this.$emit("tablePaginationChange", val);
      this.init();
    },
  },
};
</script>

<style lang="scss">
.data-table {
  .dt-row {
    margin: 0.02rem !important;
  }
}
.data-table-container {
  padding-left: 0;
  padding-right: 0;
  font-size: 14px;
  tr td[role="cell"] {
    padding: 0.1rem;
  }

  .card-title {
    color: #0c2954 !important;
    font-size: 20px;
    padding-bottom: 10px;
    margin-top: 10px;
    margin-bottom: 20px;
    border-bottom: 1px dotted #e5e5e5;
  }

  .data-table {
    thead {
      th {
        border: none;
      }
    }

    tbody {
      td {
        border-top: 1px solid #e5e5e5;
      }
    }
  }

  .data-pagination {
    margin-top: 15px;
  }
}
</style>
