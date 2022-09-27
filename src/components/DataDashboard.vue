<template>
  <b-container class="card p-0">
    <div v-bind:key="index" v-for="(row, index) in rows">
      <b-row>
        <b-col v-bind:key="index" v-for="(col, index) in row" v-bind:class="hasBorderRight(row.length, index)">
          <DataCard v-bind:data="col"></DataCard>
        </b-col>
      </b-row>
      <hr v-if="hasRowLine(rows.length, index)" class="m-0" />
    </div>
  </b-container>
</template>

<script>
import DataCard from '@/components/DataCard.vue';

export default {
  name: 'DataDashboard',
  components: {
    DataCard
  },
  props: ['rows'],
  methods: {
    hasRowLine: function(row_size, index) {
      return row_size > index + 1;
    },

    hasBorderRight: function(col_size, index) {
      if (col_size > index + 1) {
        return { 'border-r': true };
      }

      return { 'border-r': false };
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  margin: 0.5rem auto;
  padding: 0.5rem;

  hr {
    border-color: $border-light;
  }

  .border-r {
    border-right: 1px solid $border-light;
  }
}
</style>
