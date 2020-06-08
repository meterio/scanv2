<template>
  <b-container class="table-container data-table-container">
    <b-card :title="title">
      <b-table
        hover
        class="data-table"
        :items="data.items"
        :fields="data.fields"
      >
        <template
          v-for="slotName in Object.keys($scopedSlots)"
          v-slot:[slotName]="slotScope"
        >
          <slot :name="slotName" v-bind="slotScope"></slot>
        </template>

        <template v-slot:cell(time)="data">
          <div class="dt-row">
            <span class="time">{{ data.value }}</span>
          </div>
        </template>

        <template v-slot:cell()="data">
          <div class="dt-row">
            <span>{{ data.value }}</span>
          </div>
        </template>
      </b-table>

      <div v-if="pagination.show" class="data-pagination">
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
export default {
  name: "DataTable",
  props: {
    title: {
      type: String
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
      ype: Object,
      default: function() {
        return {
          show: false,
          align: "right"
        };
      }
    }
  },
  data() {
    return {
      currentPage: 1
    };
  },
  computed: {
    totalRows: function() {
      return 100;
      // return this.data.items.length;
    }
  }
};
</script>

<style lang="scss">
.data-table-container {
  padding-left: 0;
  padding-right: 0;

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
