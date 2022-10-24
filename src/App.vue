<template>
  <Map/>
  <Charts chart_type="bar"></Charts>
</template>

<script>
import Map from './components/Map.vue'
import Charts from './components/Charts.vue'
export default {
  name: 'App',
  components: {
    Map,Charts
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #303539;
}
</style>
