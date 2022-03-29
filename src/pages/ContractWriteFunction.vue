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
            <b-form-group v-if="computedPayable" :label="computedFunName">
              <b-form-input
                required
                v-model="options.value"
                trim
                :placeholder="computedPayablePlaceholder"
              ></b-form-input>
            </b-form-group>
            <div
              class="my-2"
              v-for="(item, index) in computedParams"
              :key="item.label"
            >
              <div class="d-flex">
                <label>{{ item.name }}</label>
                <div v-if="item.isUnit">
                  <b-icon
                    class="ml-2"
                    icon="plus-square-fill"
                    @click="addNumberModal(index)"
                  ></b-icon>
                  <AddNumberModal
                    v-model="showNumberModal"
                    @ok="ok"
                    @close="closeAddNumberModel"
                  />
                </div>
              </div>
              <b-form-input
                required
                v-model="params[index]"
                trim
                :placeholder="item.name"
              ></b-form-input>
            </div>
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
import { NATIVE_TOKEN } from "@/config";
import AddNumberModal from "@/components/AddNumberModal";
export default {
  name: "ContractWriteFunction",
  components: {
    Loading,
    AddNumberModal,
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
      options: {
        value: "",
      },
      showNumberModal: false,
      currentSelectIndex: 0,
    };
  },
  computed: {
    computedFunName() {
      return this.abi.name;
    },
    computedParams() {
      const inputs = [];

      for (const i of this.abi.inputs) {
        inputs.push({
          name: `${i.name}(${i.type})`,
          isUnit: i.type.includes("uint"),
        });
      }

      return inputs;
    },
    computedPayable() {
      return this.abi.stateMutability === "payable";
    },
    computedPayablePlaceholder() {
      return `payable amount (${NATIVE_TOKEN[this.network]})`;
    },
  },
  methods: {
    closeAddNumberModel(show) {
      this.showNumberModal = show;
    },
    ok(num) {
      console.log("ok");
      this.params[this.currentSelectIndex] = num;
    },
    addNumberModal(index) {
      this.currentSelectIndex = index;
      this.showNumberModal = true;
    },
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
          const parameters = [...this.params];
          if (this.options.value) {
            const value = this.options.value;
            parameters.push({
              value: "0x" + Number(value).toString(16),
            });
          }

          const tx = await this.contract[this.abi.name].apply(null, parameters);

          await tx.wait();
          this.hash = tx.hash;
          this.writeLoading = false;
        } catch (e) {
          this.writeLoading = false;
          alert(
            `${e.message} ${e.data && e.data.error && e.data.error.message}`
          );
        }
      }
    },
    refresh() {
      this.hash = "";
      this.params = [];
      for (const key in this.options) {
        this.options[key] = "";
      }
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