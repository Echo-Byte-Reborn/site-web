<template>
  <v-app id="app" :dark="dark">
      <v-btn
        :dark="!dark"
        :light="dark"
        fixed
        bottom
        right
        @click="switchMode"
        v-html="text"
      ></v-btn>
    <router-view/>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  methods: {
    switchMode () {
      this.$store.dispatch('setDrak', !this.dark)
    }
  },
  computed: {
    text () {
      return this.dark ? 'jour' : 'nuit'
    },
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
