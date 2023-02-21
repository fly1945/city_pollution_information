<template>
  <!-- <Map />
  <Charts chart_type="bar"></Charts> -->

    <!-- <Charts v-if="store=='Config'" chart_type="bar"></Charts> --> -->
    <Map></Map>
    <Pannel></Pannel>
</template>

<script>
import Map from "./components/Map.vue";
import Charts from "./components/chart_component/Charts.vue";
import Pannel from "./components/chart_component/Pannel.vue";
import axios from 'axios'
export default {
  name: "App",
  components: {
    Map,
    Charts,
    Pannel
  },
  setup() {

  },
  mounted(){
  //   axios.get('/poi')
  // .then(function (response) {
  //   // 处理成功情况
  //   console.log(response.data[0].geometry);
  //   console.log("m222222222222222222222222222222222");
  // })
  // .catch(function (error) {
  //   // 处理错误情况
  //   console.log(error);
  // })
  // .then(function () {
  //   // 总是会执行
  // });
    
  }
};
</script>

<style>
/* #app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #303539;
} */
</style>
