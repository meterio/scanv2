<template>
  <div>
    <div class="function-container m-2 p-1" v-if="abi">
      <div
        class="function-name d-flex justify-content-between"
        @click="isOpenFolder"
      >
        <span>{{ computedFunName }}</span>
        <span class="d-flex align-center">
          <b-icon v-if="!v" icon="arrow-right"></b-icon>
          <b-icon @click.stop="refresh" v-else icon="arrow-clockwise"></b-icon>
        </span>
      </div>
      <b-collapse v-model="v">
        <b-card>
          <Loading v-if="readLoading" />
          <b-form v-if="paramsLength" @submit.prevent="onSubmit">
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
              <b-button type="submit" variant="primary">Read</b-button>
            </section>
          </b-form>
          <span>{{ res }}</span>
        </b-card>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading";
export default {
  name: "ContractReadFunction",
  components: {
    Loading,
  },
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
      readLoading: false,
    };
  },
  computed: {
    paramsLength() {
      return this.abi.inputs.length;
    },
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
  watch: {
    v(newVal) {
      if (newVal) {
        this.paramsLength === 0 && this.read();
      }
    },
  },
  methods: {
    isOpenFolder() {
      if (this.contract) {
        this.v = !this.v;
      } else {
        alert("Please connet you web3 provider.");
      }
    },
    onSubmit() {
      this.read();
    },
    async read() {
      if (this.contract) {
        try {
          this.readLoading = true;
          const params = this.paramsLength === 0 ? [] : [...this.params];
          const res = await this.contract.callStatic[this.abi.name].apply(
            null,
            params
          );
          console.log("res", res);
          this.res = res;
          this.readLoading = false;
        } catch (err) {
          this.readLoading = false;
          alert(err.message);
        }
      }
    },
    refresh() {
      console.log("refresh");
      if (this.paramsLength) {
        this.params = [];
      } else {
        this.read();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.function-container {
  border-radius: 4px;
  background-color: lightgray;
  cursor: pointer;
}
</style>