<template>
  <v-app id="app" :dark="dark">
    <router-view/>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  computed: {
    ...mapGetters({
      dark: 'getDark'
    })
  }
}
</script>

<style scoped>

#app {
  height: 100%;
  width: 100%;
}

</style>
  