<template>
  <div>
    <b-button variant="light" size="sm" class="float-right btn-outline-secondary mr-2" @click="copyData()">
      <b-icon icon="clipboard"></b-icon>
      <span class="ml-1">{{ copied ? 'copied' : 'Copy data' }}</span>
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'CopyData',
  props: {
    data: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      copied: false,
    };
  },
  methods: {
    async copyData() {
      await navigator.clipboard.writeText(this.data);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 1000);
    },
  },
};
</script>
