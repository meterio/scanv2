<template>
  <div>
    <div class="function-container m-2 p-1" v-if="abi">
      <div
        class="function-name d-flex justify-content-between"
        @click="isOpenFolder"
      >
        <span>{{ index + ". " + computedFunName }}</span>
        <span class="d-flex align-center">
          <b-icon v-if="!v" icon="arrow-right"></b-icon>
          <b-icon @click.stop="refresh" v-else icon="arrow-clockwise"></b-icon>
        </span>
      </div>
      <b-collapse v-model="v">
        <b-card>
          <Loading v-if="writeLoading" />
          <b-form v-else @submit.prevent="onSubmit">
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
import Loading from "@/components/Loading";
export default {
  name: "ContractWriteFunction",
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
    open: {
      type: Boolean,
    },
    index: {
      type: Number,
    },
  },
  data() {
    return {
      v: false,
      hash: "",
      params: [],
      writeLoading: false,
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
    isOpenFolder() {
      if (this.open) {
        this.v = !this.v;
      }
    },
    onSubmit() {
      this.hash = "";
      this.write();
    },
    async write() {
      if (this.writeLoading) {
        return;
      }
      if (this.contract) {
        this.writeLoading = true;
        try {
          const tx = await this.contract[this.abi.name].apply(
            null,
            this.params
          );

          await tx.wait();
          this.hash = tx.hash;
          this.writeLoading = false;
        } catch (e) {
          this.writeLoading = false;
          alert(e.message);
        }
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
  border-radius: 4px;
  background-color: #f8f9fa;
  cursor: pointer;
}
</style>