<template>
  <v-card class="cardBpm" height="100px" width="100px">
    <v-card-title class="titleBpm">BPM</v-card-title>
    <v-card-text class="value">{{ lastBpm.value || 0 }}</v-card-text>
  </v-card>
</template>

<script>

import { mapGetters } from 'vuex'

export default {
  name: 'LastBpm',
  components: {
  },
  props: {
  },
  mounted () {
    this.loadData()
  },
  data () {
    return {
    }
  },
  watch: {
  },
  methods: {
    loadData () {
      this.$store.dispatch('loadLastBpm')
    }
  },
  computed: {
    ...mapGetters({
      lastBpm: 'getLastBpm'
    })
  }
}
</script>

<style scoped>

.cardBpm {
  margin: 8px;
}

.value {
  text-align: center;
  padding: 2px;
}

.titleBpm {
  text-align: center;
  display: block !important;
  font-size: 1.5rem;
}

</style>
