<template>
  <div>
    <div class="function-container m-2 p-1" v-if="abi">
      <div class="function-name" @click="v = !v">{{ abi.name }}</div>
      <b-collapse v-model="v">
        <b-card>{{ res }}</b-card>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import BigNumber from "bignumber.js";
export default {
  name: "ContractReadFunction",
  props: {
    abi: {
      type: Object,
      default() {
        return null;
      },
    },
    contract: {
      type: Object,
      default() {
        return null;
      },
    },
  },
  data() {
    return {
      v: false,
      res: "",
    };
  },
  computed: {
    paramsLength() {
      return this.abi.inputs.length;
    },
  },
  watch: {
    v(newVal) {
      if (newVal) {
        this.paramsLength === 0 && this.read();
      }
    },
  },
  methods: {
    async read() {
      if (this.contract) {
        console.log("abi", this.abi);
        console.log("contract", this.contract);
        const res = await this.contract.callStatic[this.abi.name].apply(
          null,
          []
        );
        console.log(res);
        this.res = res;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.function-container {
  background-color: lightgray;
  cursor: pointer;
}
</style>