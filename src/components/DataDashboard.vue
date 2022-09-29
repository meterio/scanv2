<template>
  <b-container class="card p-0">
    <b-row>
      <b-col cols="6" :md="cols" v-bind:key="index" v-for="(col, index) in rows" :class="'ncols-' + actualNCols">
        <DataCard v-bind:data="col"></DataCard>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import DataCard from '@/components/DataCard.vue';

export default {
  name: 'DataDashboard',
  components: {
    DataCard
  },
  props: ['rows', 'ncols'],
  data() {
    return {
      cols: 3,
      actualNCols: 4
    };
  },
  created() {
    this.handleResize();
    window.addEventListener('resize', this.handleResize);
  },
  destroyed() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    getViewport() {
      // https://stackoverflow.com/a/8876069
      const width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      if (width <= 576) return 'xs';
      if (width <= 768) return 'sm';
      if (width <= 992) return 'md';
      if (width <= 1200) return 'lg';
      return 'xl';
    },
    handleResize() {
      const vp = this.getViewport();
      console.log('RESIZE!', vp);
      if (vp == 'xs' || vp == 'sm' || vp == 'md') {
        console.log('ncols change to 2');
        this.actualNCols = 2;
        this.cols = 12 / this.actualNCols;
      } else {
        this.cols = 12 / this.ncols;
        this.actualNCols = this.ncols;
      }
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

.ncols-3,
.ncols-2,
.ncols-4 {
  border-right: 1px solid $border-light;
  border-bottom: 1px solid $border-light;
}
.ncols-3:nth-of-type(3n + 3) {
  border-right: none;
}
.ncols-2:nth-of-type(2n + 2) {
  border-right: none;
}
.ncols-4:nth-of-type(4n + 4) {
  border-right: none;
}
</style>
