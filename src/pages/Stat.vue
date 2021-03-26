<template lang="pug">
.detail-page
  b-container.summary
    data-table-v2.mt-2pert.px-0(
      :items="explains.items",
      :fields="explains.fields"
    )
      div(slot="header")
        .card-title Penalty Details
        b-form-group(label="Node:", v-if="options.length > 0")
          b-form-select(v-model="selected", :options="options")
</template>

<script>
import DataTableV2 from "@/components/DataTableV2.vue";
import DataSummary from "@/components/DataSummary.vue";
export default {
  name: "Address",
  components: {
    DataTableV2,
    DataSummary,
  },
  computed: {},
  data() {
    return {
      selected: null,
      options: [],

      summaries: [],
      infractions: {},

      explains: {
        pagination: { show: false, align: "center", perPage: 20 },
        fields: [
          { key: "type", label: "Infraction" },
          { key: "explain", label: "Detail" },
          { key: "penalty", label: "Penalty" },
          { key: "actualPenalty", label: "Actual Penalty" },
        ],
        items: [],
      },
    };
  },
  watch: {
    selected: function (newVal, oldVal) {
      console.log(oldVal, newVal);
      if (newVal && newVal.toLowerCase() in this.infractions) {
        if (newVal && newVal.toLowerCase() in this.infractions) {
          this.explains.items = this.infractions[newVal.toLowerCase()];
        }
      }
    },
  },
  methods: {
    init() {
      this.loadStats();
    },
    async loadStats() {
      try {
        const res = await this.$api.validator.getStats(this.network);
        const { address } = this.$route.params;
        const { summaries, infractions } = res;
        this.summaries = summaries;
        this.infractions = infractions;

        if (this.summaries.length > 0) {
          const first = this.summaries[0];

          this.options = [];
          for (const s of this.summaries) {
            this.options.push({
              value: s.address,
              text: `${s.name} (${s.address}) Penalty: ${s.totalPoints}`,
            });
          }
          this.selected = first.address;
        } else {
          this.options = [];
        }
        if (address) {
          console.log("address = ", address);
          this.selected = address.toLowerCase();
        }
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.summary {
  .title {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .row {
    padding: 10px 0;
  }

  .label {
    color: #5c6f8c;
  }
  .mt-2pert {
    margin-top: 2.6%;
  }

  .card-title {
    color: #0c2954 !important;
    font-size: 20px;
    padding-bottom: 10px;
    margin-top: 10px;
    margin-bottom: 20px;
    border-bottom: 1px dotted #e5e5e5;
  }
}
</style>
