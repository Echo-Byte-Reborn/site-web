<template>
  <v-layout column row align-content-center>
    <v-flex xs12>
      <v-card
        max-height="600px"
        class="messageCard"
      >
        <v-progress-circular
          v-if="messages.length === 0"
          :size="50"
          color="primary"
          indeterminate
        ></v-progress-circular>

        <v-list v-else row wrap two-line :dark="dark">
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
    <v-flex xs12 align-content-end class="refresh">
      <v-btn @click="loadData">Rafraichir</v-btn>
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
    this.loadData()
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
    loadData () {
      this.$store.dispatch('loadMessages')
    },
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
  text-align: center;
  padding: 8px;
  margin: 8px;
}

.refresh {
  text-align: end;
}

</style>
