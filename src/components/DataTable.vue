<template>
  <b-container class="table-container data-table-container">
    <b-card :title="title">
      <b-table
        hover
        class="data-table"
        :items="data.items"
        :fields="data.fields"
        busy.sync="loading"
        show-empty
      >
        <template slot="empty">
          <div v-if="loading" class="text-center">
            <spinner />
          </div>
          <div v-else class="text-center">No data available.</div>
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

        <!-- Txhash column template -->
        <template v-slot:cell(txhash)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{ name: 'txDetail', params: { hash: data.value } }"
              >{{ shortHash(data.value) }}</router-link
            >
          </div>
        </template>

        <!-- Address column template -->
        <template v-slot:cell(address)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{ name: 'address', params: { address: data.value } }"
              >{{ shortAddr(data.value) }}</router-link
            >
          </div>
        </template>
        <template v-slot:cell(from)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{ name: 'address', params: { address: data.value } }"
              >{{ shortAddr(data.value) }}</router-link
            >
          </div>
        </template>
        <template v-slot:cell(to)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{ name: 'address', params: { address: data.value } }"
              >{{ shortAddr(data.value) }}</router-link
            >
          </div>
        </template>

        <!-- Block column template-->
        <template v-slot:cell(blocknum)="data">
          <div class="dt-row">
            <router-link
              class="link"
              :to="{ name: 'blockDetail', params: { revision: data.value } }"
              >#{{ data.value }}</router-link
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
        v-if="pagination.show && data.items.length > 0"
        class="data-pagination"
      >
        <b-pagination
          :align="pagination.align"
          v-model="currentPage"
          :total-rows="totalRows"
        ></b-pagination>
      </div>
    </b-card>
  </b-container>
</template>

<script>
import { shortHash, shortAddress } from "@/utils/address";
import { fromNow } from "@/utils/time";
export default {
  name: "DataTable",
  props: {
    title: {
      type: String,
    },
    data: {
      type: Object,
      default: function () {
        return {
          title: "",
          items: [],
          fields: [],
        };
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
  },
  data() {
    return {
      loading: false,
      currentPage: 1,
    };
  },
  computed: {
    totalRows: function () {
      return 100;
      // return this.data.items.length;
    },
  },
  methods: {
    fromNow(time) {
      return fromNow(time * 1000);
    },
    shortAddr(addr) {
      return shortAddress(addr);
    },
    shortHash(hash) {
      return shortHash(hash);
    },
  },
};
</script>

<style lang="scss">
.data-table-container {
  padding-left: 0;
  padding-right: 0;
  font-size: 14px;
  tr td[role="cell"] {
    padding: 0.25rem !important;
  }

  .card-title {
    color: #0c2954 !important;
    font-size: 20px;
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
