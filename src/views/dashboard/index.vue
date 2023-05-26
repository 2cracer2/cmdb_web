<template>
  <div class="header">
    <el-row :gutter="20">
      <el-col :span="4" :offset="2">
        <el-card :body-style="{ padding: '0px' }" class="card-panel">
          <div class="card-panel-icon-wrapper icon-peoples">
            <router-link to="/permissions/group">
              <svg-icon icon-class="peoples" class-name="card-panel-icon" />
            </router-link>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">组</div>
            <div class="card-panel-num">
              {{ groupNum }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4" :offset="2">
        <el-card :body-style="{ padding: '0px' }" class="card-panel">
          <div class="card-panel-icon-wrapper icon-people">
            <router-link to="/permissions/user">
              <svg-icon icon-class="people" class-name="card-panel-icon" />
            </router-link>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">用户</div>
            <div class="card-panel-num">
              {{ userNum }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="4" :offset="2">
        <el-card :body-style="{ padding: '0px' }" class="card-panel">
          <div class="card-panel-icon-wrapper icon-server">
            <router-link to="/asset/server">
              <svg-icon icon-class="server" class-name="card-panel-icon" />
            </router-link>
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">主机</div>
            <div class="card-panel-num">
              {{ serverNum }}
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 
    <panel-group @handleSetLineChartData="handleSetLineChartData" /> -->
    <!-- <div style="height: 20px;"></div>
    <div id="server-chart" style="width: 100%;height:400px;"></div>
    <div id="status-pie-chart" style="width: 100%;height:400px;"></div>
    <div id="date-timeline-chart" style="width: 100%;height:400px;"></div>
    <div id="manufacturer-pie-chart" style="width: 100%;height:400px;"></div>
    <div id="scatter3D" style="width: 100%; height: 600px;"></div>
    <div id="bar3D" style="width: 100%; height: 600px;"></div> -->

    <div style="height: 20px"></div>
    <div class="echarts-row">
      <el-card class="echart-card">
        <div
          id="server-chart"
          class="echart"
          style="width: 100%; height: 400px"
        ></div>
      </el-card>
      <div style="height: 10px"></div>
      <el-card class="echart-card">
        <div
          id="status-pie-chart"
          class="echart"
          style="width: 100%; height: 400px"
        ></div>
      </el-card>
    </div>
    <div style="height: 30px"></div>
    <div class="echarts-row">
      <el-card class="echart-card">
        <div
          id="date-timeline-chart"
          class="echart"
          style="width: 100%; height: 600px"
        ></div>
      </el-card>
      <el-card class="echart-card">
        <div
          id="manufacturer-pie-chart"
          class="echart"
          style="width: 100%; height: 600px"
        ></div>
      </el-card>
    </div>

    <div class="echarts-row-3d">
      <el-card class="echart-card-3d">
        <div
          id="scatter3D"
          class="echart-3d"
          style="width: 100%; height: 600px"
        ></div>
      </el-card>
    </div>
    <div id="bar3D" class="echart-3d" style="width: 100%; height: 600px"></div>
  </div>
</template>

<script>
import { getServerList } from "@/api/server";
import { getUserList } from "@/api/users";
import { getGroupList } from "@/api/groups";
import PanelGroup from "./components/PanelGroup";
import * as echarts from "echarts";
import "echarts-gl";
const lineChartData = {
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130],
  },
};

export default {
  name: "DashboardAdmin",
  components: {
    PanelGroup,
  },
  data() {
    return {
      serverNum: "",
      userNum: "",
      groupNum: "",
    };
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.initCharts();
    console.log("servers");
    this.getServerStatusData();
    this.getServerDateData();
    this.getManufacturerData();
    this.init3DScatterChart();
    this.init3DBarChart();
  },
  methods: {
    fetchData() {
      getServerList().then(
        // 获取服务器个数
        (res) => {
          this.serverNum = res.data.count;
        }
      );
      getUserList(this.params).then(
        // 获取服务器个数
        (res) => {
          this.userNum = res.data.count;
        }
      );
      getGroupList(this.params).then(
        // 获取所有用户组
        (res) => {
          this.groupNum = res.data.count;
        }
      );
    },
    getData(apiFunction, attr) {
      return apiFunction().then((res) => {
        this[attr] = res.data.count;
      });
    },
    getServerStatusData() {
      getServerList().then((res) => {
        const servers = res.data.results;

        let statusMap = {};
        servers.forEach((server) => {
          if (!statusMap[server.asset.status]) {
            statusMap[server.asset.status] = 0;
          }
          statusMap[server.asset.status] += 1;
        });

        let statusData = Object.keys(statusMap).map((status) => {
          return {
            name: status,
            value: statusMap[status],
          };
        });

        this.initStatusPieChart(statusData);
      });
    },
    initStatusPieChart(data) {
      const statusPieChart = echarts.init(
        document.getElementById("status-pie-chart")
      );
      const option = {
        title: {
          text: "服务器状态分布",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            name: "状态",
            type: "pie",
            radius: "50%",
            data: data,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };
      statusPieChart.setOption(option);
    },
    initCharts() {
      getServerList().then((res) => {
        this.serverNum = res.data.count;
        const servers = res.data.results;

        const chartData = servers.map((server) =>
          parseFloat(server.mem_capacity)
        ); // Get mem_capacity values
        const serverNames = servers.map((server) => server.hostname); // Get server names

        const serverChart = echarts.init(
          document.getElementById("server-chart")
        );
        const option = {
          title: {
            text: "服务器内存容量",
            left: "center",
          },
          tooltip: {},
          xAxis: {
            type: "category",
            data: serverNames,
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              name: "内存容量",
              type: "bar",
              data: chartData,
              itemStyle: {
                color: function (params) {
                  // params 是一个对象，包括了当前数据点的信息，比如 dataIndex、data、name 等
                  // 这里我们根据 data（内存容量）的值来设置颜色
                  const value = params.data;
                  if (value < 10) {
                    return "green";
                  } else if (value < 20) {
                    return "yellow";
                  } else {
                    return "red";
                  }
                },
              },
            },
          ],
        };

        serverChart.setOption(option);
      });
    },
    getServerDateData() {
      getServerList().then((res) => {
        const servers = res.data.results;

        let purchaseData = [];
        let expireData = [];

        servers.forEach((server) => {
          purchaseData.push({
            name: server.hostname,
            value: [server.asset.purchase_day, server.hostname],
          });

          expireData.push({
            name: server.hostname,
            value: [server.asset.expire_day, server.hostname],
          });
        });

        this.initDateTimelineChart(purchaseData, expireData);
      });
    },
    initDateTimelineChart(purchaseData, expireData) {
      const dateTimelineChart = echarts.init(
        document.getElementById("date-timeline-chart")
      );
      const option = {
        title: {
          text: "服务器购买和过期日期",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        xAxis: {
          type: "time",
        },
        yAxis: {
          type: "category",
          inverse: true,
        },
        series: [
          {
            name: "购买日期",
            type: "line",
            data: purchaseData,
            markPoint: {
              data: [
                { type: "min", name: "最早购买日期" },
                { type: "max", name: "最新购买日期" },
              ],
            },
          },
          {
            name: "过期日期",
            type: "line",
            data: expireData,
            markPoint: {
              data: [
                { type: "min", name: "最早过期日期" },
                { type: "max", name: "最新过期日期" },
              ],
            },
          },
        ],
      };
      dateTimelineChart.setOption(option);
    },
    getManufacturerData() {
      getServerList().then((res) => {
        const servers = res.data.results;
        let manufacturerData = {};

        servers.forEach((server) => {
          const manufacturer = server.asset.manufacturer;
          if (!manufacturerData[manufacturer]) {
            manufacturerData[manufacturer] = 0;
          }
          manufacturerData[manufacturer]++;
        });

        let data = [];
        for (const key in manufacturerData) {
          data.push({
            name: key,
            value: manufacturerData[key],
          });
        }

        this.initManufacturerPieChart(data);
      });
    },
    initManufacturerPieChart(data) {
      const manufacturerPieChart = echarts.init(
        document.getElementById("manufacturer-pie-chart")
      );
      const option = {
        title: {
          text: "服务器厂商分布",
          left: "center",
        },
        tooltip: {
          trigger: "item",
        },
        series: [
          {
            name: "厂商",
            type: "pie",
            radius: ["50%", "70%"],
            roseType: "radius",
            itemStyle: {
              borderRadius: 4,
            },
            data: data.sort(function (a, b) {
              return a.value - b.value;
            }),
            animationType: "scale",
            animationEasing: "elasticOut",
            animationDelay: function (idx) {
              return Math.random() * 200;
            },
          },
        ],
      };
      manufacturerPieChart.setOption(option);
    },
    init3DScatterChart() {
      getServerList().then((res) => {
        const servers = res.data.results;

        // 将服务器数据映射到3D散点图需要的格式
        const scatter3DData = servers.map((server) => {
          return [
            server.cpu_core_count, // CPU核数
            parseFloat(server.mem_capacity), // 内存容量
            server.driver.length, // 硬盘驱动器数量
          ];
        });

        // 初始化ECharts实例
        const chart = echarts.init(document.getElementById("scatter3D"));

        // 配置和设置3D散点图
        const option = {
          tooltip: {},
          xAxis3D: {
            type: "value",
            name: "CPU核数",
          },
          yAxis3D: {
            type: "value",
            name: "内存容量",
          },
          zAxis3D: {
            type: "value",
            name: "硬盘驱动器数量",
          },
          grid3D: {
            boxWidth: 200,
            boxDepth: 80,
            boxHeight: 60,
            environment: "auto",
            light: {
              main: {
                intensity: 1.2,
                shadow: true,
              },
              ambient: {
                intensity: 0.3,
              },
            },
          },
          series: [
            {
              type: "scatter3D",
              data: scatter3DData,
              symbolSize: 10,
              itemStyle: {
                opacity: 0.8,
              },
              emphasis: {
                label: {
                  show: false,
                },
                itemStyle: {
                  borderColor: "#fff",
                  opacity: 1,
                },
              },
            },
          ],
        };

        chart.setOption(option);
      });
    },
    init3DBarChart() {
      getServerList().then((res) => {
        const servers = res.data.results;

        // 将服务器数据映射到我们需要的格式
        const data = servers.reduce((acc, server) => {
          const key = `${server.os_release}-${server.prouduct_model}`;
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        const keys = Object.keys(data);
        const values = Object.values(data);
        const categories = keys.map((key) => key.split("-"));

        // 初始化ECharts实例
        const chart = echarts.init(document.getElementById("bar3D"));

        // 配置和设置3D柱状图
        const option = {
          tooltip: {},
          xAxis3D: {
            type: "category",
            data: categories.map((category) => category[0]),
            name: "操作系统类型",
          },
          yAxis3D: {
            type: "category",
            data: categories.map((category) => category[1]),
            name: "服务器型号",
          },
          zAxis3D: {
            type: "value",
            name: "服务器数量",
          },
          grid3D: {
            boxWidth: 200,
            boxDepth: 80,
            boxHeight: 60,
            environment: "auto",
            light: {
              main: {
                intensity: 1.2,
                shadow: true,
              },
              ambient: {
                intensity: 0.3,
              },
            },
          },
          series: [
            {
              type: "bar3D",
              data: categories.map((category, i) => {
                return {
                  value: [category[0], category[1], values[i]],
                };
              }),
              shading: "color",
            },
          ],
        };

        chart.setOption(option);
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.header {
  padding: 10px;
  margin: 10px;
}

.card-panel {
  height: 108px;
  position: relative;

  .icon-peoples {
    color: #40c9c6;
  }

  .icon-people {
    color: #246a6d;
  }

  .icon-server {
    color: #a8d111;
  }
}

.card-panel-icon-wrapper {
  float: left;
  margin: 14px 0 0 14px;
  padding: 16px;
  transition: all 0.38s ease-out;
  border-radius: 6px;
}

.card-panel-icon {
  float: left;
  font-size: 48px;
}

.card-panel-description {
  float: right;
  font-weight: bold;
  margin: 26px;
  margin-left: 0px;

  .card-panel-text {
    line-height: 18px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 16px;
    margin-bottom: 12px;
  }

  .card-panel-num {
    color: rgba(0, 0, 0, 0.45);
    font-size: 20px;
  }

  .echarts-row,
  .echarts-row-3d {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .echart-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 20px;
    padding: 20px;
    width: calc(50% - 40px);
    /* 图表的宽度为50%，减去margin和padding */
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    border-radius: 5px;
  }

  .echart-card:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }

  .echart-3d {
    width: 100%;
    height: 400px;
    /* 这里设置图表的高度，你可以根据需要进行调整 */
  }
}
</style>
