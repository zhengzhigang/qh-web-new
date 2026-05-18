<template>
  <div id="container">
    <!-- 顶部导航栏 -->
    <kgqa-header />

    <!-- 主体内容区域 -->
    <main id="main-content" style="margin-top: 60px">
      <!-- 控制区域 -->
      <div class="control-section">
        <div class="section-title">查看四大家族族谱</div>
        <div class="control-group">
          <el-select
            v-model="selectedFamily"
            @change="filterByFamily"
            placeholder="请选择家族"
            style="width: 200px"
          >
            <el-option label="全部家族" value="all" />
            <el-option label="贾家荣国府" value="0" />
            <el-option label="贾家宁国府" value="1" />
            <el-option label="王家" value="2" />
            <el-option label="史家" value="3" />
            <el-option label="薛家" value="4" />
            <el-option label="其他" value="5" />
            <el-option label="林家" value="6" />
          </el-select>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="chart-area">
        <div
          ref="chartContainer"
          id="relation-chart"
          class="chart-container"
        ></div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer id="footer">
      <p>Copyright© 2018 林智敏 | All Rights Reserved</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import * as echarts from "echarts";
import KgqaHeader from "@/components/kgqa-header.vue";
import allRelation from "./static/data.json";

const chartContainer = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
const selectedFamily = ref("all");
const allCharacters = ref<any[]>([]);
const allRelations = ref<any[]>([]);

// 图表配置
const getChartOption = (nodes: any[], links: any[]) => {
  return {
    title: {
      text: "红楼梦人物关系图",
      textStyle: {
        fontWeight: "lighter",
        fontSize: 18,
      },
      left: "center",
      top: 10,
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: "quinticInOut",
    legend: {
      x: "center",
      show: true,
      data: [
        "贾家荣国府",
        "贾家宁国府",
        "王家",
        "史家",
        "薛家",
        "其他",
        "林家",
      ],
      bottom: 10,
      textStyle: {
        fontSize: 12,
      },
    },
    series: [
      {
        type: "graph",
        layout: "force",
        symbolSize: 45,
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
        nodes: nodes,
        links: links,
      },
    ],
  };
};

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) return;

  // 确保容器有高度
  const container = chartContainer.value;
  const rect = container.getBoundingClientRect();
  console.log("Chart container size:", rect.width, "x", rect.height);

  if (rect.width === 0 || rect.height === 0) {
    console.warn("Chart container has no size, retrying...");
    setTimeout(initChart, 100);
    return;
  }

  // 清理旧实例
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }

  // 创建新实例
  chartInstance = echarts.init(container);
  chartInstance.setOption(
    getChartOption(allCharacters.value, allRelations.value)
  );

  // 添加resize监听
  window.addEventListener("resize", handleResize);
};

// 处理resize
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

// 筛选并更新图表
const filterByFamily = () => {
  if (!chartInstance) return;

  let filteredNodes = allCharacters.value;
  let filteredLinks = allRelations.value;

  if (selectedFamily.value !== "all") {
    const category = parseInt(selectedFamily.value);
    const familyMemberNames = allCharacters.value
      .filter((node) => node.category === category)
      .map((node) => node.name);

    const relatedNames = new Set<string>();
    familyMemberNames.forEach((name) => {
      relatedNames.add(name);
      allRelations.value.forEach((link) => {
        if (link.source === name || link.target === name) {
          relatedNames.add(link.source);
          relatedNames.add(link.target);
        }
      });
    });

    filteredNodes = allCharacters.value.filter((node) =>
      relatedNames.has(node.name)
    );
    filteredLinks = allRelations.value.filter(
      (link) => relatedNames.has(link.source) && relatedNames.has(link.target)
    );
  }

  chartInstance.setOption(getChartOption(filteredNodes, filteredLinks), true);
};

// 加载数据
const loadData = async () => {
  allCharacters.value = allRelation.data || [];
  allRelations.value = allRelation.links || [];

  await nextTick();
  await nextTick();
  initChart();
};

// 生命周期
onMounted(async () => {
  await loadData();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }
});
</script>

<style scoped>
#container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部导航栏 */
#header {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  padding: 15px 20px;
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

/* 控制区域 */
.control-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.family-select {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  cursor: pointer;
}

.family-select:focus {
  border-color: #249e92;
}

.select-btn {
  padding: 8px 20px;
  background-color: #249e92;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.select-btn:hover {
  background-color: #1a7f75;
}

/* 图表区域 */
.chart-area {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
  min-height: 500px;
}

.chart-container {
  width: 100%;
  height: 100%;
  min-height: 500px;
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
</style>
