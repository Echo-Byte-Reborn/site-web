<template>
  <div>
    <h1>Page 2</h1>
    <button @click="back">Back</button>
  </div>
</template>

<script>

export default {
  name: 'OtherPage',
  components: {
  },
  props: {
  },
  mounted () {
    console.log('OtherPage mounted')
  },
  data () {
    return {
    }
  },
  watch: {
  },
  methods: {
    back () {
      this.$router.go(-1)
    }
  },
  computed: {
  }
}
</script>

<style scoped>

h1 {
  color: green;
  text-align: center;
}

</style>
