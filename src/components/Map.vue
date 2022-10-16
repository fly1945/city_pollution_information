<template>
  <div id="map"></div>
  <div id="chart">
    <div id="chart_bar"></div>
    <div id="chart_pie"></div>
    <div id="chart_line"></div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import { Scene } from "@antv/l7";
import { PointLayer, PolygonLayer } from "@antv/l7";
import { GaodeMap } from "@antv/l7-maps";
import { CityBuildingLayer } from "@antv/l7";
import * as echarts from "echarts";
//import {data} from '../hooks/city_model.js'
export default {
  name: "HelloWorld",
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
      scene.on("loaded", () => {
        const layer = new PolygonLayer({
          zIndex: 0,
        });

        /* eslint-disable */
        layer.source(data).size(5).shape("extrude").color("#f00");
        console.log("add");
        scene.addLayer(layer);
      });
    }
    function city_model() {
      const scene = new Scene({
        id: "map",
        map: new GaodeMap({
          style: "dark",
          center: [120.173104, 30.244072],
          pitch: 70.41138037735848,
          zoom: 17.18,
          rotation: 2.24, // 358.7459759480504
        }),
      });

      scene.on("loaded", () => {
        {
          const layer = new CityBuildingLayer({
            zIndex: 0,
          });
          layer.source(data);
          scene.addLayer(layer);
        }
      });
    }
    //fun_3d();
    function city_model_test() {
      const scene = new Scene({
        id: "map",
        map: new GaodeMap({
          style: "dark",
          center: [120.173104, 30.244072],
          pitch: 70.41138037735848,
          zoom: 17.18,
          rotation: 2.24, // 358.7459759480504
          minZoom: 14,
        }),
      });

      scene.on("loaded", () => {
        fetch(
          "https://gw.alipayobjects.com/os/rmsportal/ggFwDClGjjvpSMBIrcEx.json"
        )
          .then((res) => res.json())
          .then((data) => {
            const layer = new CityBuildingLayer({
              zIndex: 0,
            });
            layer.source(data);
            scene.addLayer(layer);
          });
      });
    }
    city_model();
    function echars() {
      // 基于准备好的dom，初始化echarts实例
      var myChart_bar = echarts.init(document.getElementById("chart_bar"));
      var myChart_pie = echarts.init(document.getElementById("chart_pie"));
      var myChart_line = echarts.init(document.getElementById("chart_line"));
      let option = {
        title: {
          text: "ECharts",
        },
        tooltip: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "pie",
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      };
      // 绘制图表
      option.series[0].type = "bar";

      myChart_bar.setOption(option);
      option.series[0].type = "pie";
      myChart_pie.setOption(option);
      option.series[0].type = "line";
      myChart_line.setOption(option);
    }
    echars();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  position: relative;
  width: 100%;
  height: 1000px;
}

#chart {
  z-index: 10;
  position: absolute;
  top: 50px;
  left: 50px;
  width: 800px;
  height: 400px;
  background-color: aliceblue;
  display: flex;
}

#chart div {
  width: 33.33%;
  height: 400px;
}
</style>