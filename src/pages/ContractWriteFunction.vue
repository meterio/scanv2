<template>
  <div>
    <div class="function-container m-2 p-1" v-if="abi">
      <div class="function-name" @click="v = !v">{{ abi.name }}</div>
      <b-collapse v-model="v">
        <b-card>
          <b-form @submit.prevent="onSubmit">
            <b-form-group
              v-for="(item, index) in computedParams"
              :key="item.name"
              :label="item.name"
            >
              <b-form-input v-model="params[index]" trim></b-form-input>
            </b-form-group>
            <section class="text-center">
              <b-button type="submit" variant="primary">Call</b-button>
            </section>
          </b-form>
        </b-card>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import BigNumber from "bignumber.js";
export default {
  name: "ContractWriteFunction",
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
      params: [],
    };
  },
  watch: {
    params(val) {
      console.log(val);
    },
  },
  computed: {
    paramsLength() {
      return this.abi.inputs.length;
    },
    computedParams() {
      const inputs = [];
      for (const i of this.abi.inputs) {
        // this.params[i.name] = 1;
        inputs.push({
          name: i.name,
          type: i.type,
        });
      }
      return inputs;
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
        this.res = new BigNumber(String(res));
      }
    },
    onSubmit() {
      this.write();
    },
    async write() {
      if (this.contract) {
        const tx = await this.contract[this.abi.name].apply(null, this.params);
        console.log("tx", tx);
        await tx.wait();
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