<template>
  <div class="demo-date-picker">
    <div class="block">
      <p>请选择时间(默认为6月1--6月30)</p>
      <el-date-picker
        v-model="value"
        type="daterange"
        start-placeholder="Start date"
        end-placeholder="End date"
        :default-time="defaultTime"
        :default-value="defaultTime"
        @change="select_finish"
      />
    </div>
  </div>
</template>

<script>
import { ref, reactive, toRaw } from "vue";
import { useStore } from "vuex";
import axios from "axios";

export default {
  setup() {
    const store = useStore();
    let state = store.state;
    const value = ref("");
    const defaultTime = reactive([
      (new Date(2018, 5, 1, 0, 0, 0), new Date(2018, 5, 30, 23, 59, 59)),
    ]);
    function getTime(date) {
      let Y = date.getFullYear(),
        M =
          date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1,
        D = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(),
        h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(),
        m =
          date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(),
        s =
          date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + "-" + M + "-" + D;
    }
    function select_finish() {
      if (value.value == undefined) {
        store.commit("set_original", { original: state.original_reserve });
        store.commit("set_display", { select: false });
        return;
      }
      let date_select_original = reactive({
        layer: {
          map_layer: state.original.layer.map_layer, //地图
          city_layer: state.original.layer.city_layer, //城市
          home_layer: state.original.layer.home_layer, //居住地点
          path_layer: null,
          classics_heat_layer: null,
          squareColumn_heat_layer: null,
        },
        data: {
          home_data: state.original.data.home_data,
          city_data: state.original.data.city_data,
          path_data: null,
          heat_data: null,
        },
      });

      function get_heat_data_and_layer() {
        return new Promise((resolve) => {
          axios
            .get(
              "/stay/" + getTime(value.value[0]) + "/" + getTime(value.value[1])
            )
            .then(function (response) {
              // 处理成功情况
              let json_arr = response.data;
              let heat_data = {
                type: "FeatureCollection",
                features: json_arr,
              };
              let classics_heat_layer = state.get_layer.get_classics_heat_layer(
                heat_data,
                value.value[1].getDate() - value.value[0].getDate()
              );
              let squareColumn_heat_layer =
                state.get_layer.get_squareColumn_heat_layer(
                  heat_data,
                  value.value[1].getDate() - value.value[0].getDate()
                );
              date_select_original.data.heat_data = heat_data;
              date_select_original.layer.classics_heat_layer =
                classics_heat_layer;
              date_select_original.layer.squareColumn_heat_layer =
                squareColumn_heat_layer;
              state.original.layer.map_layer.addLayer(classics_heat_layer);
              classics_heat_layer.hide();
              state.original.layer.map_layer.addLayer(squareColumn_heat_layer);
              squareColumn_heat_layer.show();
              console.log("get data");
              resolve();
            });
        });
      }
      function get_path_data_and_layer() {
        return new Promise((resolve) => {
          axios
            .get(
              "/move/" + getTime(value.value[0]) + "/" + getTime(value.value[1])
            )
            .then(function (response) {
              // 处理成功情况
              let json_arr = response.data;
              let path_data = {
                type: "FeatureCollection",
                features: json_arr,
              };
              let path_layer = state.get_layer.get_path_layer(path_data);
              console.log('path data',path_data)
              date_select_original.data.path_data = path_data;
              date_select_original.layer.path_layer = path_layer;

              state.original.layer.map_layer.addLayer(path_layer);
              
              path_layer.hide();
              // date_select_original.data.path_data = state.original.data.path_data
              // date_select_original.layer.path_layer = state.original.layer.path_layer
              console.log("get path");
              resolve();
            })
            .catch(function (error) {
              // 处理错误情况
              console.log(error);
            });
        });
      }
      Promise.all([get_heat_data_and_layer(), get_path_data_and_layer()]).then(
        () => {
          store.commit("set_original", { original: date_select_original });
          store.commit("set_display", { select: false });
        }
      );
    }

    return { defaultTime, value, select_finish };
  },
};
</script>

<style>
</style>