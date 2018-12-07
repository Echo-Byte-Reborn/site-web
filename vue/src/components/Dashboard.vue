<template>
  <v-layout row>
    <v-flex xs4 sm4 offset-sm9>
      <messages></messages>
    </v-flex>
  </v-layout>
</template>

<script>

import Messages from '@/components/Messages'

export default {
  name: 'Dashboard',
  components: {
    Messages
  },
  props: {
  },
  mounted () {
  },
  data () {
    return {
    }
  },
  watch: {
  },
  methods: {
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
