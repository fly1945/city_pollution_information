<template>
  <div id="map"></div>
</template>

<script>
import { Scene } from "@antv/l7";
import {PolygonLayer } from "@antv/l7";
import { GaodeMap } from "@antv/l7-maps";
import { CityBuildingLayer } from "@antv/l7";
import * as echarts from "echarts";

export default {
  components:{},

  props: {
    msg: String,
  },
  mounted() {
    function fun_3d() {
      const scene = new Scene({
        id: "map",
        map: new GaodeMap({
          center: [120, 30],
          zoom: 5,
        }),
      });

    }
    function city_model() {
      const scene = new Scene({
        id: "map",
        map: new GaodeMap({
          style: "dark",
          center: [120.173104, 30.244072],
          pitch: 70.41138037735848,
          zoom: 11,
          rotation: 2.24, // 358.7459759480504
        }),
      });

      scene.on("loaded", () => {
        fetch(
          "data/杭州_gcj02.json"
          
        )
          .then((res) => res.json())
          .then((data) => {
            const layer = new PolygonLayer({
              zIndex: 0,
            });

            layer.source(data).size('Floor',(num)=>num*3).shape("extrude").color("#DCDCDC");
            console.log("add");
            scene.addLayer(layer);
          });
      });

    }
    city_model();

    //myechars();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  width: 100%;
  height: 700px;
}
</style>