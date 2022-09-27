<template>
  <div>
    <div class="fileName my-2">{{ fileName }}</div>
    <prism-editor
      class="my-editor"
      v-model="codeContent"
      :highlight="highlighter"
      :line-numbers="lineNumbers"
      readonly
    ></prism-editor>
  </div>
</template>

<script>
import { PrismEditor } from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles

export default {
  name: 'CodeTextArea',
  components: {
    PrismEditor
  },
  props: {
    code: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  computed: {
    codeContent() {
      return this.code.content;
    },
    lineNumbers() {
      return this.code.name.includes('.sol');
    },
    fileName() {
      return `File ${this.index} of ${this.total}: ${this.code.name}`;
    }
  },
  methods: {
    highlighter(code) {
      if (this.code.name.includes('.sol')) {
        return highlight(code, languages.js); // languages.<insert language> to return html with markup
      } else {
        return code;
      }
    }
  }
};
</script>

<style lang="scss">
.my-editor {
  border: 1px solid #e7eaf3;
  background-color: #f9f9f9;
  color: #ccc;
  height: 450px;
  border-radius: 5px;
}
.prism-editor__textarea:focus {
  outline: none;
}
.fileName {
  color: #77838f;
}
</style>
