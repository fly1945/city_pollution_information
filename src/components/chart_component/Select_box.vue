<template>
  <div>
    选择展示内容:
    <el-checkbox
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      @change="handleCheckAllChange"
      >Check all</el-checkbox
    >
    <el-checkbox-group
      size="small"
      v-model="checkedLayers"
      @change="handleCheckedCitiesChange"
    >
      <el-checkbox-button v-for="layer in layers" :key="layer" :label="layer">{{
        layer
      }}</el-checkbox-button>
    </el-checkbox-group>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, toRaw } from "vue";
import { reactive } from "vue";

export default {
  setup() {
    let store = useStore();
    const checkAll = ref(false);
    const isIndeterminate = ref(true);
    const layers = ["出行路线", "柱状热力图",'经典热力图'];
    const checkedLayers = ref(layers);
    const check_map = reactive({});

    function init_check_map() {
      const layer = store.state.display.layer;
      console.log('store.state.display.layer',store.state.display.layer)
      check_map.map = {
        出行路线: layer.path_layer,
        柱状热力图: layer.squareColumn_heat_layer,
        经典热力图: layer.classics_heat_layer,
      };
    }
    const change_all_layer = (isShow) => {
      init_check_map();
      isShow
        ? layers.forEach((val) => {
            check_map.map[val].show();
          })
        : layers.forEach((val) => {
            check_map.map[val].hide();
          });
    };

    const show_select_layer = (arr) => {//数组里面没有，就不展示
      init_check_map();
      for (let layer in check_map.map) {
        arr.indexOf(layer) == -1
          ? check_map.map[layer].hide()
          : check_map.map[layer].show();
      }
    };
    const handleCheckAllChange = (val) => {
      //全选判断
      checkedLayers.value = val ? layers : [];
      isIndeterminate.value = false;
      change_all_layer(val);
    };
    const handleCheckedCitiesChange = (value) => {
      //单选判断
      show_select_layer(value);
      const checkedCount = value.length;
      checkAll.value = checkedCount === layers.length;
      isIndeterminate.value = checkedCount > 0 && checkedCount < layers.length;
    };

    return {
      checkAll,
      isIndeterminate,
      checkedLayers,
      layers,
      handleCheckAllChange,
      handleCheckedCitiesChange,
      check_map,
    };
  },
  mounted() {
    new Promise((resolve) => {
      this.$store.commit("add_resolve_list", {
        name: "init_check_map",
        resolve_fun: resolve,
      });
    }).then(() => {
      const layer = this.$store.state.display.layer;
      this.check_map.map = {
        出行路线: layer.path_layer,
        柱状热力图: layer.squareColumn_heat_layer,
      };
    });
  },
};
</script>

<style scoped>
.el-checkbox{
  display: block;
}
</style>