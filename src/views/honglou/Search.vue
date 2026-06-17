<template>
  <div id="container">
    <!-- 顶部导航栏 -->
    <honglou-header />
    <!-- 主体内容区域 -->
    <main id="main-content" style="margin-top: 60px">
      <!-- 搜索区域 -->
      <div class="search-section">
        <h2 class="section-title">人物关系可视化</h2>
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            class="search-section-input"
            placeholder="请输入你要检索的名字..."
            @keyup.enter="search"
          />
          <el-button
            type="primary"
            @click="search"
            class="search-section-button"
            >搜索</el-button
          >
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="charts-area">
        <!-- 关系图 -->
        <div class="chart-box graph-box">
          <h3 class="chart-title">人物关系图</h3>
          <v-chart
            ref="graphRef"
            :option="graphOption"
            style="width: 100%; height: 100%"
            autoresize
          />
        </div>

        <!-- 词云图 -->
        <div class="chart-box wordcloud-box">
          <h3 class="chart-title">人物词云</h3>
          <v-chart
            ref="wordCloudRef"
            :option="wordCloudOption"
            style="width: 100%; height: 100%"
            autoresize
            @click="onWordCloudClick"
          />
        </div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer id="footer">
      <p>Copyright© 2018 林智敏 | All Rights Reserved</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import VChart from "vue-echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import {
  TitleComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import { GraphChart } from "echarts/charts";
import "echarts-wordcloud";
import { ElInput, ElButton } from "element-plus";
import { searchName } from "@/api/honglou";
import HonglouHeader from "@/components/honglou-header.vue";

// 注册必要的组件
use([
  CanvasRenderer,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GraphChart,
]);

const router = useRouter();
const wordCloudRef = ref();
const graphRef = ref();
const searchQuery = ref("");

// 词云图配置
const wordCloudOption = ref<any>({
  tooltip: {
    show: true,
    formatter: (params: any) => {
      return `${params.name}: ${params.value}次`;
    },
  },
  series: [
    {
      type: "wordCloud",
      shape: "circle",
      left: "center",
      top: "center",
      width: "90%",
      height: "90%",
      sizeRange: [14, 60],
      rotationRange: [-45, 45],
      rotationStep: 15,
      gridSize: 8,
      drawOutOfBound: false,
      keepAspect: true,
      animation: true,
      animationDuration: 3000,
      animationEasing: "sinusoidalInOut",
      textStyle: {
        fontFamily: "sans-serif",
        fontWeight: "bold",
        color: () => {
          const colorList = [
            "#d9363e",
            "#2d50a7",
            "#2387c4",
            "#e17b36",
            "#4aaf5c",
            "#7a5d9e",
            "#c2823a",
          ];
          return colorList[Math.floor(Math.random() * colorList.length)];
        },
      },
      emphasis: {
        textStyle: {
          shadowBlur: 10,
          shadowColor: "#333",
        },
      },
      data: [],
    },
  ],
});

// 词云点击事件
const onWordCloudClick = (params: any) => {
  if (params.name) {
    searchByName(params.name);
  }
};

// 关系图配置
const graphOption = ref<any>({
  title: {
    text: "",
    textStyle: {
      fontWeight: "normal",
    },
  },
  animationDurationUpdate: 1500,
  animationEasingUpdate: "quinticInOut",
  legend: {
    x: "center",
    show: true,
    data: ["贾家荣国府", "贾家宁国府", "王家", "史家", "薛家", "其他", "林家"],
    bottom: 10,
    textStyle: {
      fontSize: 12,
    },
  },
  series: [
    {
      type: "graph",
      layout: "force",
      symbolSize: 50,
      edgeSymbol: ["circle", "arrow"],
      edgeSymbolSize: [4, 4],
      edgeLabel: {
        normal: {
          show: true,
          textStyle: {
            fontSize: 10,
          },
          formatter: "{c}",
        },
      },
      force: {
        repulsion: 2500,
        edgeLength: [10, 100],
      },
      focusNodeAdjacency: true,
      draggable: true,
      roam: true,
      categories: [
        { name: "贾家荣国府", itemStyle: { color: "#d9363e" } },
        { name: "贾家宁国府", itemStyle: { color: "#2d50a7" } },
        { name: "王家", itemStyle: { color: "#2387c4" } },
        { name: "史家", itemStyle: { color: "#e17b36" } },
        { name: "薛家", itemStyle: { color: "#4aaf5c" } },
        { name: "其他", itemStyle: { color: "#7a5d9e" } },
        { name: "林家", itemStyle: { color: "#c2823a" } },
      ],
      label: {
        normal: {
          show: true,
          textStyle: {
            fontSize: 12,
            fontWeight: "bold",
            color: "#333",
          },
        },
      },
      tooltip: {
        formatter: function (node: any) {
          if (!node.value) {
            return node.data.name;
          } else {
            return node.data.name + ":" + node.data.showNum;
          }
        },
      },
      lineStyle: {
        normal: {
          color: "#999",
          opacity: 0.8,
          width: 2,
          curveness: 0.2,
        },
      },
      nodes: [],
      links: [],
    },
  ],
});

// 固定词云数据
const fixedWordCloudData = [
  { name: "贾宝玉", value: 700 },
  { name: "林黛玉", value: 600 },
  { name: "薛宝钗", value: 550 },
  { name: "王熙凤", value: 500 },
  { name: "贾母", value: 480 },
  { name: "贾政", value: 450 },
  { name: "史湘云", value: 420 },
  { name: "贾琏", value: 400 },
  { name: "贾迎春", value: 380 },
  { name: "贾探春", value: 380 },
  { name: "贾惜春", value: 370 },
  { name: "袭人", value: 350 },
  { name: "贾元春", value: 340 },
  { name: "贾珠", value: 330 },
  { name: "贾环", value: 320 },
  { name: "王夫人", value: 310 },
  { name: "贾赦", value: 300 },
  { name: "巧姐", value: 290 },
  { name: "贾珍", value: 280 },
  { name: "贾蓉", value: 270 },
  { name: "紫鹃", value: 260 },
  { name: "贾兰", value: 250 },
  { name: "薛蟠", value: 240 },
  { name: "贾敬", value: 230 },
  { name: "薛姨妈", value: 220 },
];

// 初始化固定词云
const initWordCloud = () => {
  wordCloudOption.value.series[0].data = fixedWordCloudData;
  if (wordCloudRef.value) {
    wordCloudRef.value.setOption(wordCloudOption.value, true);
  }
};

// 更新关系图（词云不更新）
const updateGraph = (data: any[], links: any[]) => {
  graphOption.value.series[0].nodes = Array.isArray(data)
    ? JSON.parse(JSON.stringify(data))
    : [];
  graphOption.value.series[0].links = Array.isArray(links)
    ? JSON.parse(JSON.stringify(links))
    : [];

  if (graphRef.value) {
    graphRef.value.setOption(graphOption.value, true);
  }
};

const search = async () => {
  if (!searchQuery.value) return;

  const queryName = searchQuery.value.trim();

  try {
    const response = await searchName({ name: queryName });

    if (response.data) {
      const data = response.data || [];
      const links = response.links || [];
      console.log(data, links);

      await nextTick();
      updateGraph(data, links);
    } else {
      throw new Error("响应数据为空");
    }
  } catch (error) {
    console.error("API调用失败:", error);
  }
};

const searchByName = async (name: string) => {
  searchQuery.value = name;
  try {
    const response = await searchName({ name });

    if (response.data) {
      const data = response.data || [];
      const links = response.links || [];

      await nextTick();
      updateGraph(data, links);
    } else {
      throw new Error("响应数据为空");
    }
  } catch (error) {
    console.error("API调用失败:", error);
  }
};

onMounted(async () => {
  await nextTick();
  await nextTick();

  // 初始化固定词云
  initWordCloud();
});
</script>

<style scoped lang="scss">
#container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

/* 顶部导航栏 */
#header {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-content h1 {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin: 0;
  text-align: center;
}

/* 主体内容区域 */
#main-content {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

/* 搜索区域 */
.search-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.search-box {
  display: flex;
  align-items: center;
}

#search-input {
  width: 300px;
  height: 36px;
  padding: 0 12px;
  border: 1px solid #ddd;
  border-radius: 4px 0 0 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
}

#search-input:focus {
  border-color: #249e92;
}

.search-btn {
  height: 36px;
  padding: 0 20px;
  background-color: #249e92;
  color: #fff;
  border: none;
  border-radius: 0 4px 4px 0;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background-color: #1a7f75;
}

/* 图表区域 */
.charts-area {
  display: flex;
  gap: 20px;
  flex: 1;
  min-height: 0;
}

.chart-box {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.graph-box {
  flex: 2;
}

.wordcloud-box {
  flex: 1;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
  text-align: center;
  flex-shrink: 0;
}

.chart-box > div {
  flex: 1;
  min-height: 0;
}

/* 页脚 */
#footer {
  background-color: #fff;
  border-top: 1px solid #e0e0e0;
  padding: 12px 20px;
  text-align: center;
}

#footer p {
  font-size: 12px;
  color: #999;
  margin: 0;
}

.search-section-input {
  ::v-deep .el-input__wrapper {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
}

.search-section-button {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
</style>
