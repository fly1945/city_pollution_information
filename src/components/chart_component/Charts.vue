<template>
  <div id="chart">
    <el-button type="primary" @click="set_data_original('总数据')"
      >总数据</el-button
    >
    <el-button type="primary" @click="set_data_original('选择区域数据')"
      >选择区域数据</el-button
    >
    <div class="cut"></div>
    <el-button type="primary" @click="set_energy_type('地点能耗指数')"
      >地点能耗指数</el-button
    >
    <el-button type="primary" @click="set_energy_type('出行能耗指数')"
      >出行能耗指数</el-button
    >
    <div id="select_list">
      <el-select @change="select" v-model="value" placeholder="Select">
        <el-option
          v-for="item in select_option"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        />
      </el-select>
    </div>
    <div
      v-show="((data_original == '总数据' && energy_type=='地点能耗指数')) || firse_show"
      id="Mychart_original_architecture"
    ></div>
    <div
      v-show="(data_original == '选择区域数据' && energy_type=='地点能耗指数') || firse_show"
      id="Mychart_select_area__architecture"
    ></div> 
    <div
      v-show="(data_original == '总数据' && energy_type=='出行能耗指数') || firse_show"
      id="Mychart_original_move"
    ></div>

    <div
      v-show="(data_original == '选择区域数据'  && energy_type=='出行能耗指数') || firse_show"
      id="Mychart_select_area__move"
    ></div>
  </div>
  >
</template>

<script>
import * as echarts from "echarts";
import { ref, toRaw } from "vue";

export default {
  components: {},
  setup() {
    let value = ref("柱状图");
    const select_option = [
      {
        value: "bar",
        label: "柱状图",
      },
      {
        value: "pie",
        label: "饼状图",
      },
      {
        value: "line",
        label: "折线图",
      },
    ];
    let original_move_chart = "";
    let select_area_move_chart = "";
    let original_architecture_chart = "";
    let select_area_architecture_chart = "";

    let data_original = ref("总数据");
    let firse_show = ref(true);
    let energy_type = ref("地点能耗指数");
    console.log("energy_type  111", energy_type);
    return {
      select_option,
      value,
      original_move_chart,
      select_area_move_chart,
      original_architecture_chart,
      select_area_architecture_chart,
      data_original,
      energy_type,
      firse_show,
    };
  },
  props: {
    chart_type: {
      type: String,
      require: true,
    },
  },
  methods: {
    set_data_original(select) {
      this.firse_show = false;
      this.data_original = select;
    },
    set_energy_type(energy_type) {
      this.firse_show = false;
      console.log("energy_type", energy_type);
      this.energy_type = energy_type;
    },
    select(chart_type) {
      let heat_original_data = toRaw(this.$store.state.original.data.heat_data);
      let path_original_data = toRaw(this.$store.state.original.data.path_data);
      this.$store.dispatch("init_charts_data", {
        name: "original_data",
        heat_geojson: heat_original_data,
        path_geojson: path_original_data,
      });

      let original_move_chart_data =
        chart_type == "pie"
          ? this.$store.state.charts_data.original_data.move_energy_pie_data
          : this.$store.state.charts_data.original_data.move_energy_bar_line_data;
      original_move_chart_data.series[0].type = chart_type;
      this.original_move_chart.clear();
      console.log('original_move_chart_data',original_move_chart_data)
      this.original_move_chart.setOption(original_move_chart_data);
      ///////////
      let original_architecture_chart_data =
        chart_type == "pie"
          ? this.$store.state.charts_data.original_data
              .architecture_energy_pie_data
          : this.$store.state.charts_data.original_data
              .architecture_energy_bar_line_data;
      original_architecture_chart_data.series[0].type = chart_type;
      this.original_architecture_chart.clear();
      this.original_architecture_chart.setOption(
        original_architecture_chart_data
      );
      console.log('original_architecture_chart_data',original_architecture_chart_data)
      /////////////////////////////////////////
      let select_area_heat_data = toRaw(
        this.$store.state.select_area.data.heat_data
      );
      let select_area_path_data = toRaw(
        this.$store.state.select_area.data.path_data
      );
      if (select_area_heat_data == null) {
        return;
      }
      this.$store.dispatch("init_charts_data", {
        name: "select_area_data",
        heat_geojson: select_area_heat_data,
        path_geojson: select_area_path_data,
      });
      let select_chart_move_data =
        chart_type == "pie"
          ? this.$store.state.charts_data.select_area_data.move_energy_pie_data
          : this.$store.state.charts_data.select_area_data
              .move_energy_bar_line_data;
      select_chart_move_data.series[0].type = chart_type;
      this.select_area_move_chart.clear();
      this.select_area_move_chart.setOption(select_chart_move_data);
      /////////////////////////////////
      let select_chart_architecture_data =
        chart_type == "pie"
          ? this.$store.state.charts_data.select_area_data
              .architecture_energy_pie_data
          : this.$store.state.charts_data.select_area_data
              .architecture_energy_bar_line_data;
      select_chart_architecture_data.series[0].type = chart_type;
      this.select_area_architecture_chart.clear();
      this.select_area_architecture_chart.setOption(
        select_chart_architecture_data
      );
    },
  },
  mounted() {
    function echars() {
      // 基于准备好的dom，初始化echarts实例

      this.original_architecture_chart = echarts.init(
        document.getElementById("Mychart_original_architecture")
      );
      this.original_move_chart = echarts.init(
        document.getElementById("Mychart_original_move")
      );
      this.select_area_move_chart = echarts.init(
        document.getElementById("Mychart_select_area__move")
      );
      this.select_area_architecture_chart = echarts.init(
        document.getElementById("Mychart_select_area__architecture")
      );
      // 绘制图表

      this.select("pie");
    }
    echars.call(this);

    function myechars() {
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
    //myechars()
  },
};
</script>

<style scoped>
.show_pannel {
  height: 400px;
}
.cut {
  height: 10px;
}
#chart {
  height: 500px;
  width: 100%;
  text-align: center;
}
#select_list {
  margin: 0 auto;
  width: 100%;
  height: 10%;
}
#Mychart_original_architecture {
  margin: 0 auto;
  width: 80%;
  height: 90%;
}
#Mychart_original_move {
  margin: 0 auto;
  width: 80%;
  height: 90%;
}
#Mychart_select_area__move {
  margin: 0 auto;
  width: 80%;
  height: 90%;
}
#Mychart_select_area__architecture {
  margin: 0 auto;
  width: 80%;
  height: 90%;
}
.el-select {
  height: 100%;
  width: 50%;
  margin: 0 auto;
  display: block;
}
</style>