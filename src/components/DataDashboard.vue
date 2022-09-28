<template>
  <b-container class="card p-0">
    <b-row>
      <b-col
        cols="6"
        md="3"
        v-bind:key="index"
        v-for="(col, index) in rows"
        :class="hasBorderRight(rows.length, index)"
      >
        <DataCard v-bind:data="col"></DataCard>
      </b-col>
    </b-row>
    <hr v-if="hasRowLine(rows.length, index)" class="m-0" />
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

    getViewport() {
      // https://stackoverflow.com/a/8876069
      const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      if (width <= 576) return 'xs';
      if (width <= 768) return 'sm';
      if (width <= 992) return 'md';
      if (width <= 1200) return 'lg';
      return 'xl';
    },

    hasBorderRight: function(col_size, index) {
      const vp = this.getViewport();
      if (vp == 'lg' || vp == 'xl') {
        if ((index + 1) % 4 != 0) {
          return { 'border-r': true, 'border-b': true };
        }
      }
      if (vp == 'xs' || vp == 'sm' || vp == 'md') {
        if ((index + 1) % 2 != 0) {
          return { 'border-r': true, 'border-b': true };
        }
      }

      return { 'border-r': false, 'border-b': true };
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

  .border-b {
    border-bottom: 1px solid $border-light;
  }
  .border-r {
    border-right: 1px solid $border-light;
  }
}
</style>
