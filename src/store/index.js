
import { createStore } from 'vuex'
import { PointLayer, HeatmapLayer, LineLayer } from "@antv/l7";
let obj = {
  state() {
    return {
      original_reserve: null,
      date_select_num: -1,
      original: {
        layer: {//原始的图层
          map_layer: null,//地图
          city_layer: null,//城市
          home_layer: null,//居住地点
          path_layer: null,//出行路线
          squareColumn_heat_layer: null,//柱状热力图
          classics_heat_layer: null//经典热力图
        },
        data: {//原始的数据
          home_data: null,
          city_data: null,
          path_data: null,
          heat_data: null,
        },
      },
      select_area: {//选择区域后的图层和数据
        data: {
          path_data: null,
          heat_data: null,
        },
        layer: {}
      },
      display: {//页面实际展示的图层和数据
        layer: {},
        data: {},
        not_init: true
      },
      resolve_list: {//保存promise的resolve函数
      },
      charts_data: {//图标展示的内容
        original_data: {
          architecture_energy_bar_line_data: [],
          architecture_energy_pie_data: [],
          move_energy_bar_line_data :[],
          move_energy_pie_data :[]
        },
        select_area_data: {
          architecture_energy_bar_line_data: [],
          architecture_energy_pie_data: [],
          move_energy_bar_line_data :[],
          move_energy_pie_data :[]
        }
      },
      get_layer: {
        get_classics_heat_layer(data, date_select) {
          const heatmap = new HeatmapLayer({})
            .source(data)
            .shape('heatmap')
            .size('energy', (energy) => {
              if (date_select == undefined || date_select < 3) {
                date_select = 3

              }
              return energy / (1000000 / (date_select / 3))
            }) // weight映射通道
            .style({
              intensity: 2,
              radius: 30,
              rampColors: {
                colors: [
                  '#FF4818',
                  '#F7B74A',
                  '#FFF598',
                  '#91EABC',
                  '#2EA9A1',
                  '#206C7C'
                ].reverse(),
                positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0]
              }
            });
          return heatmap
        },
        get_squareColumn_heat_layer(data, date_select) {
          const squareColumn_heat_layer = new HeatmapLayer({})
            .source(data, {
              transforms: [
                {
                  type: "grid",
                  size: 500,
                  field: "energy",
                  method: "min",
                },
              ],
            })
            .shape("squareColumn")
            .style({
              coverage: 1,
              angle: 0,
              opacity: 0.5,
            })
            .color("min", (energy) => {
              let bound = 10;
              if (date_select != undefined) {
                bound = date_select / 4 + 1
              }
              let change_num = Math.log2(1 + energy / 100) - 5;
              change_num = change_num > 0 ? change_num : 0;
              let heat_num = change_num > bound ? 1 : change_num / bound;
              return `rgb(${parseInt(255 * heat_num)},0,${parseInt(
                255 - 255 * heat_num
              )})`;
            })
            .size("min", (energy) => {
              return Math.log2(1 + energy) * 100;
            });

          return squareColumn_heat_layer
        },
        get_path_layer(data) {
          let path_layer = new LineLayer();;
          path_layer
            .source(data)
            .shape("arc3d")
            .animate(true)
            .size("count", (count) => {
              return count;
            }).color(
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
          return path_layer
        }
      }
    }
  },
  actions: {
    test() {
    },
    init_charts_data(context, { name, heat_geojson, path_geojson }) {
      let heat_data = {
        "company": 0, "shopping": 0,
        "transportfacilities": 0, "financial": 0,
        "hotel": 0, "resort": 0,
        "service": 0, "residential": 0,
        "school": 0, "hospital": 0
      }
      let heat_items = [
        "company", "shopping",
        "financial", "hotel", "resort",
        "service", "residential", "school", "transportfacilities", "hospital"]
      console.log('heat_geojson', heat_geojson)
      let heat_Features = heat_geojson.features
      let properties = ''
      for (const heat_Feature of heat_Features) {
        properties = heat_Feature.properties
        for (const item of heat_items) {
          heat_data[item] = heat_data[item] + properties[item]
        }
      }

      let path_data = {
        "walkEnergy": 0.0, "batteryEnergy": 0.0,
        "carEnergy": 0.0, "railwayEnergy": 0.0, "planeEnergy": 0.0,
      }

      let path_items = [
        "walkEnergy", "batteryEnergy",
        "carEnergy", "railwayEnergy", "planeEnergy"]

      let path_Features = path_geojson.features
      let path_properties = ''
      for (const path_Feature of path_Features) {
        path_properties = path_Feature.properties
        for (const item of path_items) {
          path_data[item] = path_data[item] + path_properties[item]
        }
      }

      context.commit('set_charts_data', { name, heat_data, path_data })
    }
  },
  mutations: {
    set_charts_data(state, { name, heat_data, path_data }) {
      console.log('path_data', path_data)
      let arr_data = [
        heat_data['company'], heat_data['shopping'],
        heat_data['financial'], heat_data['hotel'],
        heat_data['resort'], heat_data['service'],
        heat_data['residential'], heat_data['school'],
        heat_data['transportfacilities'], heat_data['hospital'],]
      let obj_data = [
        { name: '公司', value: heat_data['company'] }, { name: '商店', value: heat_data['shopping'] },
        { name: '俱乐部', value: heat_data['financial'] },
        { name: '旅馆', value: heat_data['hotel'] }, { name: '度假胜地', value: heat_data['resort'] },
        { name: '公共设施', value: heat_data['service'] }, { name: '住宅', value: heat_data['residential'] },
        { name: '学校', value: heat_data['school'] }, { name: '交通设施', value: heat_data['transportfacilities'] }, { name: '医院', value: heat_data['hospital'] },]
      
        let path_arr_data = [
        path_data["walkEnergy"], path_data["batteryEnergy"],
        path_data["carEnergy"], path_data["railwayEnergy"], path_data["planeEnergy"]]
      let path_obj_data = [{ name: '步行', value: path_data["walkEnergy"] },
      { name: '电车', value: path_data["batteryEnergy"] },
      { name: '小汽车', value: path_data["carEnergy"] },
      { name: '铁轨', value: path_data["railwayEnergy"] },
      { name: '飞机', value: path_data["planeEnergy"] },]
      function get_pie_data_mode() {
        let pie_data = {
          title: {
            text: "排放图",
          },
          tooltip: {
            show: true,
          },
          series: [
            {
              radius: "50%",
              type: "pie",
              data: obj_data,
            },
          ],
        };
        return pie_data
      }
      function get_bar_line_data_mode() {
        let bar_line_data = {
          title: {
            text: "排放图",
          },
          tooltip: {},
          xAxis: {
            data: [
              "公司",
              "商店",
              "俱乐部",
              "旅馆",
              "度假胜地",
              "公共设施",
              "住宅",
              "学校",
              "交通设施",
              "医院",
            ].slice(0, 5),
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              type: "bar",
              data: arr_data.slice(
                0,
                5
              ),
              label: { show: true },
            },
          ],
        };
        return bar_line_data
      }
      let architecture_energy_bar_line_data = get_bar_line_data_mode()
      architecture_energy_bar_line_data.series[0].data = arr_data.slice(0, 5)
      let architecture_energy_pie_data = get_pie_data_mode()
      architecture_energy_pie_data.series[0].data = obj_data
      state.charts_data[name].architecture_energy_bar_line_data = architecture_energy_bar_line_data
      state.charts_data[name].architecture_energy_pie_data = architecture_energy_pie_data
    

      let move_energy_bar_line_data=get_bar_line_data_mode()
      move_energy_bar_line_data.series[0].data = path_arr_data.slice(0, 5)
      let move_energy_pie_data=get_pie_data_mode()
      move_energy_pie_data.series[0].data=path_obj_data

      state.charts_data[name].move_energy_pie_data = move_energy_pie_data
      state.charts_data[name].move_energy_bar_line_data = move_energy_bar_line_data

    },
    init(state, original) {
      state.original = original
      state.original_reserve = original
      state.resolve_list['init_check_map']()
      delete state.resolve_list['init_check_map']

      state.resolve_list['Draw_init']()
      delete state.resolve_list['Draw_init']
    },
    add_resolve_list(state, { name, resolve_fun }) {
      state.resolve_list[name] = resolve_fun
    },
    set_display(state, { select }) {//select   true 表示选择区域的数据  flase表示原始数据
      if (state.display.not_init != true) {
        state.display.layer.squareColumn_heat_layer.hide()
        state.display.layer.path_layer.hide()
        state.display.layer.classics_heat_layer.hide()
        state.display.layer.path_layer.hide()
      }

      state.display = select ? state.select_area : state.original
      if (select) {//select   true 表示选择区域的数据  flase表示原始数据  
        state.original.layer.squareColumn_heat_layer.hide()
        state.original.layer.path_layer.hide()
      } else {
        state.original.layer.squareColumn_heat_layer.show()
        //state.original.layer.path_layer.show()
        state.select_area.layer.squareColumn_heat_layer && state.select_area.layer.squareColumn_heat_layer.hide()
        state.select_area.layer.classics_heat_layer && state.select_area.layer.classics_heat_layer.hide()
        state.select_area.layer.path_layer && state.select_area.layer.path_layer.hide()
      }
    },
    set_select(state, select_area) {//选择区域
      state.select_area.layer.squareColumn_heat_layer && state.select_area.layer.squareColumn_heat_layer.hide()
      state.select_area.layer.path_layer && state.select_area.layer.path_layer.hide()
      state.select_area = select_area
    },
    set_original(state, { original }) {

      state.original = original

    },
    set_date_select_num(state, { date_select_num }) {
      state.date_select_num = date_select_num
    }
  },
}

export default createStore(obj)