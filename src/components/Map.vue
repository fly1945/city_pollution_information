<template>
  <div id="map"></div>
</template>

<script>
import { Scene } from "@antv/l7";
import { PolygonLayer } from "@antv/l7";
import { GaodeMap } from "@antv/l7-maps";
import { PointLayer, HeatmapLayer, LineLayer } from "@antv/l7";
import axios from "axios";
import { useStore } from "vuex";
LineLayer;
export default {
  setup() {
    let path_layer = new LineLayer();
    const home = new PointLayer();

    const map = new Scene({
      id: "map",
      map: new GaodeMap({
        style: "dark",
        center: [120.142814, 30.311648],

        zoom: 12,
        rotation: 2.24, // 358.7459759480504
      }),
    });
    let _data = {};
    let _layer = {};
    return { _data, _layer, path_layer, map, city: null, home };
  },
  methods: {
    add_city_layer() {
      return new Promise((resolve, reject) => {
        fetch("data/杭州_gcj02.json")
          .then((res) => res.json())
          .then((data) => {
            this._data.city_data = data; /////////
            const city = new PolygonLayer({
              zIndex: 0,
            });
            this._layer.city_layer = city; ///////
            city
              .source(data)
              .size("Floor", (num) => num * 3)
              .shape("extrude")
              .color("#DCDCDC");
            console.log("add");
            resolve();
            //this.map.addLayer(city);
          });
      });
    },
    add_path_layer() {
      return new Promise((resolve) => {
        // axios
        //   .get("/move/2018-06-01/2019-06-30")
        //   .then((response) => {
        //     let state = this.$store.state;
        //     console.log('state',state)
        //     // 处理成功情况
        //     let json_arr = response.data;
        //     let path_data = {
        //       type: "FeatureCollection",
        //       features: json_arr,
        //     };
        //     let path_layer = state.get_layer.get_path_layer(path_data);
        //     console.log("path data", path_data);

        //     //state.original.layer.map_layer.addLayer(path_layer);
        //     this._layer.path_layer = path_layer;
        //     this._data.path_data = path_data;
        //     path_layer.hide();
        //     // date_select_original.data.path_data = state.original.data.path_data
        //     // date_select_original.layer.path_layer = state.original.layer.path_layer
        //     console.log("get path");
        //     resolve();
        //   })
        //   .catch(function (error) {
        //     // 处理错误情况
        //     console.log(error);
        //   })
        //   .then(function () {
        //     // 总是会执行
        //   });
        fetch("data/OD_count.json")
          .then((res) => res.json())
          .then((data) => {
            this._data.path_data = data;
            let path_layer = this.path_layer;
            path_layer
              .source(data)
              .shape("arc3d")
              .animate(true)
              .size("count", (count) => {
                console.log(count);
                return count;
              })
              .color(
                "walkCount*bikeCount*otherCount",
                (walkCount, bikeCount, otherCount) => {
                  let ran = Math.random() * 10;
                  if (ran <= 2) {
                    return "red";
                  } else if (ran <= 5) {
                    return "blue";
                  } else {
                    return "yellow";
                  }
                }
              );
            this._layer.path_layer = path_layer; /////
            path_layer.hide();
            //this.map.addLayer(path_layer);
            resolve();
          });
      });
    },

    add_home_layer() {
      return new Promise((resolve) => {
        fetch("data/home_geojson.json")
          .then((res) => res.json())
          .then((data) => {
            this._data.home_data = data; /////////
            const home = new PointLayer()
              .source(data)
              .shape("circle")
              .size(20)
              .color("#f00")
              .style({
                unit: "meter",
              });
            this.home = home;
            this._layer.home_layer = home; ////////
            this.map.addLayer(home);
            resolve();
          });
      });
    },
    add_heat_layer() {
      return new Promise((resolve) => {
        fetch("data/poi_stay.json")
          .then((res) => res.json())
          .then((data) => {
            this._data.heat_data = data;
            const squareColumn_heat_layer =
              this.$store.state.get_layer.get_squareColumn_heat_layer(data);
            this._layer.squareColumn_heat_layer = squareColumn_heat_layer;

            const classics_heat_layer =
              this.$store.state.get_layer.get_classics_heat_layer(data);
            this._layer.classics_heat_layer = classics_heat_layer;
            classics_heat_layer.hide();

            this.map.addLayer(squareColumn_heat_layer);
            this.map.addLayer(classics_heat_layer);
            resolve();
          });
      });
    },
    init() {
      //初始化图层
      this._layer.map_layer = this.map; /////
      this.map.on("loaded", () => {
        Promise.all([
          this.add_city_layer(),
          this.add_home_layer(),
          this.add_path_layer(),
          this.add_heat_layer(),
        ]).then(() => {
          this.$store.commit("init", { layer: this._layer, data: this._data });
          this.$store.commit("set_display", { select: false });
        });
      });
    },
  },

  mounted() {
    this.init();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#map {
  width: 100%;
  height: 700px;
  color: #b2e212;
}
</style>