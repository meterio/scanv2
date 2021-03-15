<template>
  <b-container class="table-container data-table-container">
    <b-card :title="title">
      <slot name="header"></slot>
      <b-table
        hover
        class="data-table"
        :items="data.items"
        :fields="data.fields"
        :busy.sync="loading"
        show-empty
        :style="{ minHeight: minHeight }"
        stacked="lg"
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
                params: { hash: data.value }
              }"
              >{{ shortHash(data.value) }}</router-link
            >
          </div>
        </template>

        <!-- Bucketid column template -->
        <template v-slot:cell(bucketid)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{
                name: 'bucket',
                params: { id: data.value }
              }"
              >{{ shortHash(data.value) }}</router-link
            >
          </div>
        </template>

        <!-- Address column template -->
        <template v-slot:cell(fullAddress)="data">
          <div class="dt-row">
            <address-link :address="data.value" />
          </div>
        </template>

        <!-- addrAndName column template -->
        <template v-slot:cell(addrAndName)="data">
          <div class="dt-row">
            <router-link
              v-if="data.value.name"
              :to="{ name: 'address', params: { address: data.value.address } }"
              >{{ data.value.name }}</router-link
            >
            <router-link
              v-else
              :to="{ name: 'address', params: { address: data.value.address } }"
              >{{ data.value.address }}</router-link
            >
          </div>
        </template>

        <template v-slot:cell(address)="data">
          <div class="dt-row">
            <address-link :address="data.value" :short="true" />
          </div>
        </template>

        <template v-slot:cell(from)="data">
          <div class="dt-row">
            <address-link :address="data.value" :short="true" />
          </div>
        </template>
        <template v-slot:cell(to)="data">
          <div class="dt-row">
            <address-link :address="data.value" :short="true" />
          </div>
        </template>

        <!-- Block column template-->
        <template v-slot:cell(blocknum)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{
                name: 'blockDetail',
                params: { revision: data.value }
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
                params: { revision: data.value }
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

        <template v-slot:cell()="data">
          <div class="dt-row">
            <span>{{ data.value }}</span>
          </div>
        </template>
      </b-table>

      <div
        v-if="pagination.show && paginateTotal > pagination.perPage"
        class="data-pagination"
      >
        <b-pagination
          :align="pagination.align"
          v-model="paginateCurrentPage"
          :total-rows="paginateTotal"
          :per-page="pagination.perPage"
          @change="pgChange"
        ></b-pagination>
      </div>
    </b-card>
  </b-container>
</template>

<script>
import DirectTag from "./DirectTag.vue";
import AddressLink from "./AddressLink.vue";
export default {
  components: { DirectTag, AddressLink },
  name: "DataTable",
  props: {
    title: {
      type: String
    },
    minHeight: {
      type: String,
      default: "auto"
    },
    data: {
      type: Object,
      default: function() {
        return {
          title: "",
          items: [],
          fields: []
        };
      }
    },
    pagination: {
      type: Object,
      default: function() {
        return {
          show: false,
          align: "right"
        };
      }
    },
    loading: {
      type: Boolean,
      default: false
    },
    paginateTotal: {
      type: Number,
      default: 0
    },
    paginateCurrentPage: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      currentPage: 1
    };
  },
  methods: {
    pgChange(val) {
      this.$emit("tablePaginationChange", val);
    }
  }
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
