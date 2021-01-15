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
              <span class="fa fa-search form-control-feedback"></span>

              <input type="text" class="form-control" placeholder="Search" />
            </div>
          </b-col>
        </b-row>
      </div>
      <Loading v-if="loading"></Loading>
      <b-table
        v-else
        hover
        class="data-table"
        :items="validator_data.items"
        :fields="validator_data.fields"
      >
        <template v-slot:cell()="data">
          <div class="dt-row">
            <span>{{ data.value }}</span>
          </div>
        </template>
      </b-table>
    </b-card>
  </b-container>
</template>

<script>
import Loading from "@/components/Loading";
export default {
  name: "ValidatorTable",
  data() {
    return {
      loading: true,
      current_tab: "Delegates",
      tabs: ["Delegates", "Candidates", "Jailed"],
      current_page: 1,
      validator_data: {
        fields: [],
        items: [],
      },
    };
  },
  components: {
    Loading,
  },
  beforeMount() {
    console.log("page", this.limit);
    this.loadData();
  },
  methods: {
    switchTab(tab) {
      this.current_tab = tab;
      this.current_page = 1;
      this.loading = true;
      this.loadData();
    },
    async loadData() {
      try {
        const res = await this.$api.validator.getValidateTypeList(
          this.current_page,
          this.limit,
          this.current_tab
        );
        this.loading = false;
        console.log("res", res);
        if (this.current_tab === "Delegates") {
          this.validator_data.fields = [
            { key: "name", label: "Name" },
            { key: "address", label: "Address" },
            { key: "netAddr", label: "Net Address" },
            { key: "votingPower", label: "Total Votes" },
            { key: "commission%", label: "Commission Rate" },
            { key: "upTime", label: "Up Time 48h" },
          ];
          this.validator_data.items = res.delegates;
        }
        if (this.current_tab === "Candidates") {
          this.validator_data.fields = [
            { key: "name", label: "Name" },
            { key: "address", label: "Address" },
            { key: "totalVotesStr", label: "Total Votes" },
            { key: "commission%", label: "Commission Rate" },
            { key: "upTime", label: "Up Time 48h" },
          ];
          this.validator_data.items = res.candidates;
        }
        if (this.current_tab === "Jailed") {
          this.validator_data.fields = [
            { key: "name", label: "Name" },
            { key: "address", label: "Address" },
            { key: "totalPoints", label: "Total Points" },
            { key: "jailedTime", label: "Jailed Time" },
            { key: "bailAmount", label: "Bail Amount" },
          ];
          this.validator_data.items = res.jailed;
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
