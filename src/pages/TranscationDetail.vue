<template>
  <div class="detail">
    <b-container class="summary">
      <h2 class="title">Transcation Details</h2>

      <b-card>
        <b-row class="row" :key="index" v-for="(row, index) in summary_info">
          <b-col cols="2">
            <span class="label">{{ row.label }}</span>
          </b-col>
          <b-col cols="10">
            <span v-if="!row.type" class="value">{{ row.value }}</span>
            <a :href="row.value" v-if="row.type === 'block-link'"
              >#{{ row.value }}</a
            >

            <span v-if="row.type === 'status'">
              <StatusTag :status="row.value"></StatusTag>
            </span>
          </b-col>
        </b-row>
      </b-card>
    </b-container>
  </div>
</template>

<script>
import StatusTag from "@/components/StatusTag.vue";

export default {
  components: {
    StatusTag
  },
  data() {
    return {
      summary_info: [
        {
          label: "Trx Hash",
          value:
            "DC7E2E4056F212B916B29EFBCECCE9A1F0327EFD9DA24D65A1C4CED5A5537333"
        },
        {
          label: "Height",
          value: "8971894"
        },
        {
          label: "Block",
          type: "block-link",
          value: "458"
        },
        {
          label: "Status",
          type: "status",
          value: "success"
        },
        {
          label: "Amount",
          value: "454.0 MTR"
        },
        {
          label: "Amount",
          value: "0.05 MTR"
        },
        {
          label: "Remark",
          value: "None"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.detail {
  margin-top: 30px;
}

.summary {
  .title {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .row {
    padding: 10px 0;
  }

  .label {
    color: #5c6f8c;
  }
}
</style>
