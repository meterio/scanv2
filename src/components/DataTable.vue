<template>
  <b-container class="table-container data-table-container">
    <b-card title="Mining Rewards">
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
      </b-table>
    </b-card>
  </b-container>
</template>

<script>
export default {
  name: "DataTable",
  props: ["data"]
};
</script>

<style lang="scss">
.data-table-container {
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
}
</style>
