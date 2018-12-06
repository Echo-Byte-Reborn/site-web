<template>
  <div class="square">
    <h1 @click="increment">{{ number }}</h1>
    <p>{{ double }}</p>
  </div>
</template>

<script>

export default {
  name: 'Square',
  components: {
  },
  props: {
    startAt: {
      type: [Number, String],
      default: 0
    }
  },
  mounted () {
    console.log('Component is ready !')
  },
  data () {
    return {
      number: this.startAt
    }
  },
  watch: {
    number (newValue, oldValue) {
      if (oldValue === 0) {
        console.log('GG it\'s your first click !')
      }

      if (newValue === 42) {
        console.log('My God !')
      }
    }
  },
  methods: {
    increment () {
      this.number ++
    }
  },
  computed: {
    double () {
      return this.number * 2
    }
  }
}
</script>

<style scoped>

.square {
  height: 100px;
  width: 100px;
  background-color: blue;
}

h1 {
  text-align: center;
  padding-top: 30px;
  margin-bottom: 0px;
}

p {
  text-align: center;
  padding-bottom: 8px;
}

</style>
