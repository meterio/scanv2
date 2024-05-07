<template>
  <div class="validator">
    <DataDashboard :rows="pos_data" :ncols="4"></DataDashboard>

    <ValidatorTable class="px-0"></ValidatorTable>
    <DataTableV2
      title="PoS Epoch Rewards"
      :fields="epoch_reward_fields"
      :pagination="epoch_reward.pagination"
      :loadItems="loadEpochRewards"
      class="px-0"
    >
    </DataTableV2>

    <b-card v-if="network === 82" class="container mt-3" title="Validator Map">
      <iframe width="100%" :height="mobile ? 300 : 600" src="https://vermillion-lokum-ed1b11.netlify.app/" frameborder="0"></iframe>
    </b-card>
  </div>
</template>

<script>
import DataDashboard from '@/components/DataDashboard.vue';
import ValidatorTable from '@/components/ValidatorTable.vue';
import DataTableV2 from '@/components/DataTableV2.vue';
import { fromWei } from '@/utils';

export default {
  name: 'Validator',
  components: {
    DataDashboard,
    ValidatorTable,
    DataTableV2,
  },
  data() {
    return {
      load: true,
      total: 0,
      pos_data: [],
      current_page: 1,
      epoch_reward: {
        pagination: {
          show: true,
          align: 'center',
          perPage: 8,
        },

        fields: [
          { key: 'epoch', label: 'Epoch' },
          { key: 'blockNum', label: 'Block' },
          { key: 'amount', label: 'Total Rewards' },
          { key: 'timestamp', label: 'Time' },
          { key: 'autobidCount', label: 'nAutobid' },
          { key: 'transferCount', label: 'nTransfer' },
          { key: 'posReward', label: 'More' },
        ],
      },
    };
  },
  computed: {
    epoch_reward_fields() {
      if (this.currentChain.pow) {
        return this.epoch_reward.fields;
      }
      return [
        { key: 'epoch', label: 'Epoch' },
        { key: 'blockNum', label: 'Block' },
        { key: 'amount', label: 'Total Rewards' },
        { key: 'timestamp', label: 'Time' },
        { key: 'transferCount', label: 'nTransfer' },
        { key: 'posReward', label: 'More' },
      ];
    },
  },
  methods: {
    init() {
      this.loadPostData();
    },
    async loadEpochRewards(network, page, limit) {
      this.load = true;
      const res = await this.$api.validator.getValidateReward(network, page, limit);
      const { rewards, totalRows } = res;
      const items = rewards.map((r) => {
        return {
          ...r,
          amount: {
            type: 'amount',
            amount: r.totalReward,
            precision: 6,
            token: this.currentChain.symbol,
          },
          posReward: r.epoch,
        };
      });
      return { items, totalRows };
    },
    paginationChange(val) {
      this.current_page = val;
      this.loadEpochRewards();
    },
    async loadPostData() {
      try {
        const res = await this.$api.metric.getAll(this.network);
        this.loading = false;
        const { mtrg, pos, staking, committee } = res;
        this.pos_data = [
          {
            content: staking.candidates,
            label: 'Validators',
            cols: 3,
          },
          {
            content: fromWei(staking.totalStaked, 0) + ' ' + this.currentChain.gSymbol,
            label: 'Total Staked',
            cols: 3,
          },
        ];

        if (this.currentChain.priceEnable) {
          this.pos_data.push(
            { content: pos.best, label: 'PoS Chain Height', cols: 3 },
            // { content: '$ ' + mtrg.price, label: `${this.currentChain.gSymbol} Price`, cols: 4 },
            {
              content: `${committee.healthy} Healthy / ${committee.invalid} Invalid`,
              label: 'Active Committee',
              cols: 3,
            }
          );
        } else {
          this.pos_data.push(
            { content: pos.best, label: 'PoS Chain Height', cols: 3 },
            {
              content: `${committee.healthy} Healthy / ${committee.invalid} Invalid`,
              label: 'Active Committee',
              cols: 3,
            }
          );
        }
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<style>
.validator {
  margin-top: 30px;
}
</style>
