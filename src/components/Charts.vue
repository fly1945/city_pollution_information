<template>
  <div id="chart">
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
    <div id="Mychart"></div>
  </div>

  <!-- <div id="chart">
    <div id="chart_bar"></div>
    <div id="chart_pie"></div>
    <div id="chart_line"></div>
  </div> -->
</template>

<script>
import * as echarts from "echarts";
import { ref } from "vue";
export default {
  setup(props) {
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
    let chart = "";
    let the_data={
        title: {
          text: "排放图",
        },
        tooltip: {},
        xAxis: {
          data: ["居住", "工作", "旅游", "餐饮", "购物", "休憩"],
        },
        yAxis: {
          type:'value'
        },
        series: [
          {
            type: "bar",
            data: [5, 20, 36, 10, 10, 20],
            label:{show:true}
          },
        ],
      }
      let pie_data={
        title: {
          text: "排放图",
        },
        tooltip:{
          show:true
        },
        series: [
          {
            radius:'50%',
            type: "pie",
            data: [{name:"居住",value:5},{name:"工作",value:20},{name:"旅游",value:36},{name:"餐饮",value:10},{name:"购物",value:10},{name:"休憩",value:20},],
          },
        ],
      }
    let city_data = {
      bar: the_data,
      line:the_data,
      pie:pie_data
    };
    return { select_option, value, chart, city_data };
  },
  props: {
    chart_type: {
      type: String,
      require: true,
    },
  },
  methods: {
    select(val) {
      let select=this.city_data[val]
      select.series[0].type = val;
      this.chart.clear()
      this.chart.setOption(select);
    },
  },
  mounted() {
    function echars() {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById("Mychart"));
      this.chart = myChart;
      // 绘制图表
      this.select('bar')

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
#chart {
  z-index: 10;
  position: absolute;
  top: 50px;
  left: 50px;
  width: 400px;
  height: 400px;
  background-color: aliceblue;
  justify-content: center;
  flex-wrap: wrap;
  display: flex;
}
#select_list {
  width: 100%;
  height: 40px;
}
#Mychart {
  width: 80%;
  height: 100%;
}

.el-select {
  height: 100%;
  width: 50%;
}
/* #chart div {
  width: 33.33%;
  height: 500px;
} */
</style>