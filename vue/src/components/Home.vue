<template>
  <div>
    <h1>Hello World !!!</h1>
    <v-btn @click="route" color="primary">Route</v-btn>
    <square></square>
    <square startAt="5"></square>
    <square :startAt="41"></square>
  </div>
</template>

<script>
import Square from '@/components/Square'

export default {
  name: 'Home',
  components: {
    Square
  },
  props: {
  },
  mounted () {
    this.$router.push('/')
    // Test the store
    console.log('text: ', this.$store.getters.getText)
    this.$store.dispatch('setText', 'Hello World !')
    console.log('text: ', this.$store.getters.getText)
  },
  data () {
    return {
    }
  },
  watch: {
  },
  methods: {
    route () {
      this.$router.push('/page')
    }
  },
  computed: {
  }
}
</script>

<style scoped>

h1 {
  color: red;
  text-align: center;
}

</style>
