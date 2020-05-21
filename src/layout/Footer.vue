<template>
  <v-card height="150">
    <v-footer absolute class="font-weight-medium">
      <v-col class="text-center" cols="12"> {{ new Date().getFullYear() }} — <strong>Vuetify</strong> </v-col>
    </v-footer>
  </v-card>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      currentYear: new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  text-align: center;
  background-color: #ccc;
  padding: 40px 0;
  width: 100%;
  margin-top: auto;
}
</style>
