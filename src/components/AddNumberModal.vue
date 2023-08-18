<template>
  <b-modal v-model="computedValue" title="Add Zeroes" @ok="ok">
    <b-form-select v-model="selected" :options="selectOptions"></b-form-select>
    <div v-if="selected == 4">
      <b-form-input class="mt-2" v-model="customNumber" type="number"></b-form-input>
      <span>Enter the number of zeroes to add. Example: 3 to add three (000) zeroes.</span>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'AddNumberModal',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      selected: '',
      selectOptions: [
        { value: '', text: 'select' },
        { value: '1', text: '10⁶' },
        { value: '2', text: '10⁸' },
        { value: '3', text: '10¹⁸' },
        { value: '4', text: 'Custom' },
      ],
      customNumber: null,
    };
  },
  watch: {
    customNumber(n) {
      if (Number(n) > 18) {
        this.$nextTick(() => {
          this.customNumber = 18;
        });
      }
      if (Number(n) < 1) {
        this.$nextTick(() => {
          this.customNumber = 1;
        });
      }
    },
  },
  computed: {
    computedValue: {
      get() {
        return this.value;
      },
      set() {
        this.$emit('close', false);
      },
    },
  },
  methods: {
    ok() {
      let num;
      switch (this.selected) {
        case '1':
          num = 10 ** 6;
          break;
        case '2':
          num = 10 ** 8;
          break;
        case '3':
          num = 10 ** 18;
          break;
        case '4':
          if (this.customNumber) {
            num = 10 ** this.customNumber;
          }
      }
      this.$emit('ok', num);
    },
  },
};
</script>
