<template>
  <v-layout row>
    <v-flex xs2 offset-sm4>
      <last-bpm></last-bpm>
    </v-flex>
    <v-flex xs4 sm4 offset-sm3>
      <messages></messages>
    </v-flex>
  </v-layout>
</template>

<script>

import Messages from '@/components/Messages'
import LastBpm from '@/components/LastBpm'

export default {
  name: 'Dashboard',
  components: {
    Messages,
    LastBpm
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
