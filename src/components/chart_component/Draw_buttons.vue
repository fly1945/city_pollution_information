<template>
  <div class="draw_pannel">
    局部展示功能：
    <div class="button_groups">
      <el-button type="primary" @click="enable_draw">选择区域</el-button>
      <el-button type="primary" @click="disable_draw">禁止选择</el-button>
      <el-button type="primary" @click="display_select_area"
        >展示区域</el-button
      >
      <el-button type="primary" @click="clear_draw">删除全部</el-button>
    </div>
  </div>
</template>

<script>
import * as turf from "@turf/turf";
import { useStore } from "vuex";
import { onMounted, toRaw } from "vue";
import { DrawEvent, DrawPolygon } from "@antv/l7-draw";
import { HeatmapLayer, LineLayer } from "@antv/l7";

export default {
  setup() {
    const store = useStore();
    let draw = null;
    let clear_draw = () => {
      draw.clear();
      store.commit("set_display", { select: false });
    };
    let disable_draw = () => draw.disable();
    let enable_draw = () => draw.enable();

    let select_data = [];

    onMounted(function () {
      new Promise((resolve) => {
        store.commit("add_resolve_list", {
          name: "Draw_init",
          resolve_fun: resolve,
        });
      }).then(() => {
        draw = new DrawPolygon(store.state.original.layer.map_layer, {
          editable: true,
          distanceOptions: false,
          // Draw 配置
        });

        // 调用 Draw 上的方法
        draw.disable();

        // 监听 Draw 的事件
        draw.on(DrawEvent.Change, (polygonList) => {
          select_data = polygonList;
        });
      });
    });
    function get_limit(area) {
      //获取limit,用于筛选数据
      let limit = {
        max_longitude: 0, //经度
        min_longitude: 180,
        max_latitude: 0, //纬度 0-90
        min_latitude: 180,
      };
      for (const point of area.geometry.coordinates[0]) {
        limit.max_longitude = Math.max(limit.max_longitude, point[0]);
        limit.min_longitude = Math.min(limit.min_longitude, point[0]);
        limit.max_latitude = Math.max(limit.max_latitude, point[1]);
        limit.min_latitude = Math.min(limit.min_latitude, point[1]);
      }
      return limit;
    }
    function judge_contain(point, polygon, limit) {
      //初步筛选
      if (
        point[0] > limit.min_longitude &&
        point[0] < limit.max_longitude &&
        point[1] > limit.min_latitude &&
        point[1] < limit.max_latitude
      ) {
        return turf.booleanPointInPolygon(turf.point(point), polygon);
      } else return false;
    }

    function get_select_path_geojson(features, path_data, polygon, limit) {
      for (const data of features) {
        let point1 = data.geometry.coordinates[0];
        let point2 = data.geometry.coordinates[1];
        (judge_contain(point1, polygon, limit) ||
          judge_contain(point2, polygon, limit)) &&
          path_data.features.push(data);
      }
      console.log("path_data", path_data);
    }

    function get_select_heat_geojson(features, heat_data, polygon, limit) {
      for (const data of features) {
        let point = data.geometry.coordinates;
        judge_contain(point, polygon, limit) && heat_data.features.push(data);
      }
    }
    function get_select_data(path_data, heat_data) {
      //获取选择区域的数据
      let original_data = store.state.original.data;

      for (let area of select_data) {
        let limit = get_limit(area); //获取第一步刷选的限制条件
        let polygon = turf.polygon(area.geometry.coordinates);
        get_select_path_geojson(
          toRaw(original_data.path_data.features),
          path_data,
          polygon,
          limit
        );
        get_select_heat_geojson(
          toRaw(original_data.heat_data.features),
          heat_data,
          polygon,
          limit
        );
      }
    }
    function get_select_squareColumn_heat_layer(map, data) {
      //画选中的区域的热力图
      const squareColumn_heat_layer =
        store.state.get_layer.get_squareColumn_heat_layer(data);
      map.addLayer(squareColumn_heat_layer);
      return squareColumn_heat_layer;
    }
    function get_select_classics_heat_layer(map, data) {
      const classics_heat_layer =
        store.state.get_layer.get_classics_heat_layer(data);
      classics_heat_layer.hide();
      map.addLayer(classics_heat_layer);
      return classics_heat_layer;
    }
    function get_select_path_layer(map, data) {
      //画选择区域的出现路线图
      const path_layer =
        store.state.get_layer.get_path_layer(data);
      map.addLayer(path_layer);
      return path_layer;
    }
    function get_select_layer(path_data, heat_data) {
      let map = store.state.original.layer.map_layer;
      console.log("map", map);
      return {
        path_layer: get_select_path_layer(map, path_data),
        squareColumn_heat_layer: get_select_squareColumn_heat_layer(
          map,
          heat_data
        ),
        classics_heat_layer:get_select_classics_heat_layer(map,heat_data)
      };
    }
    function display_select_area() {
      let path_data = { type: "FeatureCollection", features: [] };
      let heat_data = { type: "FeatureCollection", features: [] };
      get_select_data(path_data, heat_data);
      let layer = get_select_layer(path_data, heat_data);
      let data = { path_data, heat_data };
      store.commit("set_select", { layer, data });
      store.commit("set_display", { select: true });
    }
    return { clear_draw, disable_draw, enable_draw, display_select_area };
  },
};
</script>

<style scoped>
.button_groups {
  height: 40%;
  width: 100%;
  color: rgb(255, 8, 0);
}
</style>