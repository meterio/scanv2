<template>
  <div>
    <div class="function-container my-2 p-1 px-3" v-if="abi">
      <div class="function-name d-flex justify-content-between" @click="isOpenFolder">
        <span>{{ index + '. ' + computedFunName }}</span>
        <span class="d-flex align-center">
          <b-icon v-if="!v" icon="arrow-right"></b-icon>
          <b-icon @click.stop="refresh" v-else icon="arrow-clockwise"></b-icon>
        </span>
      </div>
      <b-collapse v-model="v">
        <b-card>
          <Loading v-if="readLoading" />
          <b-form v-if="paramsLength" @submit.prevent="onSubmit">
            <div class="my-2" v-for="(item, index) in computedParams" :key="item.label">
              <div class="d-flex">
                <label class="ml-1 mb-0">{{ item.name }}</label>
                <div v-if="item.isUnit">
                  <b-icon class="ml-2" icon="plus-square-fill" @click="addNumberModal(index)"></b-icon>
                  <AddNumberModal v-model="showNumberModal" @ok="ok" @close="closeAddNumberModel" />
                </div>
              </div>
              <b-form-input
                size="sm"
                class="mb-3"
                required
                v-model="params[index]"
                trim
                :placeholder="item.name"
              ></b-form-input>
            </div>
            <section>
              <b-button type="submit" size="sm" variant="success" class="mb-2">Read</b-button>
            </section>
          </b-form>
          <div>{{ res }}</div>
        </b-card>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import Loading from '@/components/Loading';
import AddNumberModal from '@/components/AddNumberModal';
export default {
  name: 'ContractReadFunction',
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
      res: '',
      params: [],
      readLoading: false,
      showNumberModal: false,
      currentSelectIndex: 0,
    };
  },
  computed: {
    paramsLength() {
      return this.abi.inputs.length;
    },
    computedFunName() {
      return this.abi.name;
    },
    computedParams() {
      const inputs = [];
      for (const i of this.abi.inputs) {
        const isUnit = i.type.includes('uint');
        if (i.type == 'tuple') {
          let details = i.components.map((c) => `${c.type} ${c.name}`);
          inputs.push({
            name: `${i.name} ${i.type}(${details.join(',')})`,
            isUnit,
          });
        } else {
          inputs.push({
            name: `${i.name || '<input>'} (${i.type})`,
            isUnit,
          });
        }
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
    closeAddNumberModel(show) {
      this.showNumberModal = show;
    },
    ok(num) {
      this.params[this.currentSelectIndex] = String(num);
    },
    addNumberModal(index) {
      this.currentSelectIndex = index;
      this.showNumberModal = true;
    },
    isOpenFolder() {
      if (this.contract) {
        this.v = !this.v;
      }
    },
    onSubmit() {
      this.read();
    },
    async read() {
      this.res = '';
      if (this.contract) {
        try {
          this.readLoading = true;
          let params = this.paramsLength === 0 ? [] : [...this.params];
          params = params.map((p) => {
            const _p = p.replaceAll("'", '"').replaceAll('"true"', 'true').replaceAll('"false"', 'false');
            if (p.includes('[') && p.includes(']')) {
              const parsedP = JSON.parse(_p);
              return parsedP;
            }
            if (p == 'true') {
              return true;
            } else if (p == 'false') {
              return false;
            }
            return p;
          });
          // console.log('abi', this.abi)
          // const abiName = `${this.abi.name}(${this.abi.inputs
          //   .map((input) => {
          //     if (input.type.includes('[]') && input.components && input.components.length) {
          //       return `(${input.components.map((c) => c.type).join(',')})[]`;
          //     } else {
          //       return input.type;
          //     }
          //   })
          //   .join(',')})`;
          const abiName = this.abi.name;
          // console.log({abiName, params})
          // console.log(this.contract, this.contract[abiName])
          const res = await this.contract[abiName].apply(null, params);
          // console.log('res', res)
          let r = '';
          if (Array.isArray(res)) {
            r = [];
            for (let i = 0; i < res.length; i++) {
              r.push(String(res[i]));
            }
          } else {
            r = res;
          }
          this.res = r;

          this.readLoading = false;
        } catch (e) {
          this.readLoading = false;
          alert(`${e.message} ${e.data && e.data.error && e.data.error.message}`);
        }
      }
    },
    refresh() {
      this.res = '';
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
  border-radius: 0.75rem;
  background-color: #f8f9fa;
  cursor: pointer;
}
.card-body {
  padding: 0.25rem 0.75rem;
}
</style>
