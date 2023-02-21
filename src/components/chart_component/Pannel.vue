<template>
  <div class="main">
    <div class="tab">
      <el-tabs class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="功能" name="first"></el-tab-pane>
        <el-tab-pane label="图表" name="second"></el-tab-pane>
        <el-tab-pane label="收起" name="third"></el-tab-pane>
      </el-tabs>
    </div>
    <div v-show="tag_select == '功能'">
      <Time_select></Time_select>
      <Select_box></Select_box>
      <div class="blank"></div>
      <Draw_buttons></Draw_buttons>
    </div>
    <Chart v-if="tag_select == '图表'"></Chart>
    <div class="blank"></div>
  </div>
</template>

<script>
import Chart from "./Charts.vue";
import Draw_buttons from "./Draw_buttons.vue";
import Select_box from "./Select_box.vue";
import Time_select from './Time_select.vue'
import { ref } from "vue";
export default {
  setup() {
    let tag_select = ref("f");
    const handleClick = (tab, event) => {
      tag_select.value = tab.props.label;
    };

    return { handleClick, tag_select };
  },
  components: { Chart, Draw_buttons, Select_box ,Time_select},
};
</script>

<style scoped>
.el-tabs__nav-scroll {
  display: inline;
}
.blank {
  height: 20px;
}
.main {
  z-index: 10;
  position: absolute;
  top: 10px;
  left: 20px;
  width: 500px;

  background-color: aliceblue;
  /* justify-content: center;
  flex-wrap: wrap;
  display: flex; */
}
.tabs {
  margin: 0 auto;
}
.el-tabs {
  margin: 0 auto;
  width: 45%;
}

</style>>
