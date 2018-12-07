<template>
  <v-layout row>
    <v-flex xs12>
      <v-card
        max-height="600px"
        class="messageCard"
      >
        <v-list row wrap two-line :dark="dark">
          <v-list-tile v-for="message in messages" :key="`key-${message['_id']}`">
            <v-list-tile-avatar>
              <v-icon :color="getColor(message.message)">comment</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title :class="`${getColor(message.message)}--text`">{{ message.message }}</v-list-tile-title>
              <v-list-tile-sub-title v-html="getDate(message.timestamp)"></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>

import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'Messages',
  components: {
  },
  props: {
  },
  mounted () {
    this.$store.dispatch('loadMessages')
  },
  data () {
    return {
    }
  },
  watch: {
    'messages' () {
      setTimeout(() => {
        const card = document.querySelector('.messageCard')
        card.scrollTo(0, 999999999)
      }, 100)
    }
  },
  methods: {
    getDate (timestamp) {
      return moment(timestamp).format('LLL')
    },
    getColor (message) {
      if (message === 'ALERT IL EST MORT') {
        return 'error'
      }

      return 'primary'
    }
  },
  computed: {
    ...mapGetters({
      messages: 'getMessages',
      dark: 'getDark'
    })
  }
}
</script>

<style scoped>

.messageCard {
  overflow-y: scroll;
}


</style>
