<template>
  <div>
    <div class="function-container m-2 p-1" v-if="abi">
      <div class="function-name d-flex justify-content-between" @click="v = !v">
        <span>{{ computedFunName }}</span>
        <span class="d-flex align-center">
          <b-icon v-if="!v" icon="arrow-right"></b-icon>
          <b-icon @click.stop="refresh" v-else icon="arrow-clockwise"></b-icon>
        </span>
      </div>
      <b-collapse v-model="v">
        <b-card>
          <b-form @submit.prevent="onSubmit">
            <b-form-group
              v-for="(item, index) in computedParams"
              :key="item.name"
              :label="item.name"
            >
              <b-form-input
                required
                v-model="params[index]"
                trim
                :placeholder="item.type"
              ></b-form-input>
            </b-form-group>
            <section>
              <b-button type="submit" variant="primary">Write</b-button>
              <b-button
                class="ml-2"
                v-if="!!hash"
                @click="viewTransaction"
                type="button"
                variant="primary"
                >View Transaction</b-button
              >
            </section>
          </b-form>
        </b-card>
      </b-collapse>
    </div>
  </div>
</template>

<script>
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
      hash: "",
      params: [],
    };
  },
  computed: {
    computedFunName() {
      let p = [];
      for (const item of this.abi.inputs) {
        p.push(`${item.name}:${item.type}`);
      }
      return `${this.abi.name}(${p.join(",")})`;
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
    onSubmit() {
      this.hash = "";
      this.write();
    },
    async write() {
      if (this.contract) {
        try {
          const tx = await this.contract[this.abi.name].apply(
            null,
            this.params
          );

          this.hash = tx.hash;
        } catch (e) {
          alert(e.message);
        }
      } else {
        alert("Please connet you web3 provider.");
      }
    },
    refresh() {
      this.params = [];
    },
    viewTransaction() {
      const href = window.location.href;
      const index = href.indexOf("/", 9);
      const preUrl = href.substr(0, index);
      window.open(`${preUrl}/tx/${this.hash}`);
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