<template>
   <v-app>
    <AppHeader></AppHeader>

    <v-content>
      <transition name="fade">
            <router-view></router-view>
      </transition>
    </v-content>

    <AppFooter></AppFooter>
   </v-app>

</template>

<script>
import AppHeader from './Header.vue'
import AppFooter from './Footer.vue'

export default {
  name: 'AppLayout',
  components: {
    AppHeader,
    AppFooter
  }
}
</script>s
