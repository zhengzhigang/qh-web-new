<template>
  <div id="container">
    <!-- 顶部导航栏 -->
    <kgqa-header />

    <!-- 主体内容区域 -->
    <main id="main-content" style="margin-top: 60px">
      <!-- 问答输入区域 -->
      <div class="search-section">
        <div class="section-title">问答系统</div>
        <div class="search-box">
          <el-input
            v-model="searchQuery"
            placeholder="请输入你的问题(eg.贾宝玉的爸爸是谁？)"
            @keyup.enter="search"
            size="large"
          />
          <el-button type="primary" @click="search" size="large"
            >搜索</el-button
          >
        </div>
      </div>

      <!-- 结果展示区域 -->
      <div class="result-area">
        <!-- 左侧人物关系链 -->
        <div class="relation-chart">
          <h3 class="chart-title">人物关系链</h3>
          <div
            ref="chartContainer"
            id="chain-chart"
            class="chart-container"
          ></div>
        </div>

        <!-- 右侧结果人物信息 -->
        <div class="result-panel">
          <h3 class="panel-title">结果人物</h3>

          <!-- 人物图片 -->
          <div class="picture-container" v-if="showPicture">
            <img
              :src="pictureSrc"
              :alt="currentCharacter"
              class="character-picture"
            />
          </div>
          <div class="picture-container placeholder" v-else>
            <div class="no-image">暂无图片</div>
          </div>

          <!-- 人物信息 -->
          <div class="info-panel">
            <div class="character-name" v-if="currentCharacter">
              {{ currentCharacter }}
            </div>
            <div class="profile-content" v-html="profile"></div>
          </div>
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
import { ref, onMounted, onUnmounted, reactive } from "vue";
import * as echarts from "echarts";
import { ElInput, ElButton } from "element-plus";
import { kgqaAnswer, getProfile } from "@/api/kgqa";
import KgqaHeader from "@/components/kgqa-header.vue";

const chartContainer = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
const searchQuery = ref("");
const profile = ref("");
const pictureSrc = ref("");
const showPicture = ref(false);
const currentCharacter = ref("");

// Mock数据
const mockAnswers: Record<string, any> = {
  贾宝玉的爸爸是谁: {
    nodes: [
      { name: "贾宝玉", category: 0, symbolSize: 60 },
      { name: "贾政", category: 0, symbolSize: 55 },
    ],
    links: [{ source: "贾宝玉", target: "贾政", value: "父子" }],
    profile:
      "<dl><dt>中文名</dt><dd>贾政</dd><dt>身份</dt><dd>荣国府二老爷</dd><dt>官职</dt><dd>工部员外郎</dd><dt>性格</dt><dd>为人正直，古板严肃</dd></dl>",
    picture: null,
  },
  林黛玉的母亲是谁: {
    nodes: [
      { name: "林黛玉", category: 6, symbolSize: 60 },
      { name: "贾敏", category: 6, symbolSize: 55 },
      { name: "贾母", category: 0, symbolSize: 50 },
    ],
    links: [
      { source: "林黛玉", target: "贾敏", value: "母女" },
      { source: "贾敏", target: "贾母", value: "母女" },
    ],
    profile:
      "<dl><dt>中文名</dt><dd>贾敏</dd><dt>身份</dt><dd>林如海之妻</dd><dt>家世</dt><dd>贾府千金</dd><dt>子女</dt><dd>林黛玉</dd></dl>",
    picture: null,
  },
  薛宝钗的哥哥是谁: {
    nodes: [
      { name: "薛宝钗", category: 4, symbolSize: 60 },
      { name: "薛蟠", category: 4, symbolSize: 55 },
    ],
    links: [{ source: "薛宝钗", target: "薛蟠", value: "兄妹" }],
    profile:
      "<dl><dt>中文名</dt><dd>薛蟠</dd><dt>身份</dt><dd>薛家长子</dd><dt>性格</dt><dd>纨绔子弟，性情骄纵</dd><dt>绰号</dt><dd>呆霸王</dd></dl>",
    picture: null,
  },
  王熙凤的丈夫是谁: {
    nodes: [
      { name: "王熙凤", category: 2, symbolSize: 60 },
      { name: "贾琏", category: 0, symbolSize: 55 },
    ],
    links: [{ source: "王熙凤", target: "贾琏", value: "夫妻" }],
    profile:
      "<dl><dt>中文名</dt><dd>贾琏</dd><dt>身份</dt><dd>荣国府管家</dd><dt>性格</dt><dd>风流成性，贪图享乐</dd></dl>",
    picture: null,
  },
  贾母的孙子是谁: {
    nodes: [
      { name: "贾母", category: 0, symbolSize: 65 },
      { name: "贾政", category: 0, symbolSize: 50 },
      { name: "贾宝玉", category: 0, symbolSize: 60 },
    ],
    links: [
      { source: "贾母", target: "贾政", value: "母子" },
      { source: "贾政", target: "贾宝玉", value: "父子" },
    ],
    profile:
      "<dl><dt>中文名</dt><dd>贾宝玉</dd><dt>身份</dt><dd>荣国府嫡孙</dd><dt>性格</dt><dd>叛逆多情，厌恶仕途</dd><dt>别称</dt><dd>宝二爷</dd></dl>",
    picture: null,
  },
  秦可卿是谁: {
    nodes: [
      { name: "秦可卿", category: 5, symbolSize: 60 },
      { name: "贾蓉", category: 1, symbolSize: 55 },
      { name: "贾珍", category: 1, symbolSize: 50 },
    ],
    links: [
      { source: "秦可卿", target: "贾蓉", value: "夫妻" },
      { source: "贾蓉", target: "贾珍", value: "父子" },
    ],
    profile:
      "<dl><dt>中文名</dt><dd>秦可卿</dd><dt>外文名称</dt><dd>Qin Keqing</dd><dt>其他名称</dt><dd>秦氏、蓉大奶奶</dd><dt>身份</dt><dd>宁国府重孙媳妇，贾蓉之妻</dd><dt>排名</dt><dd>金陵十二钗正册第十二位</dd></dl>",
    picture: null,
  },
};

// 默认图表配置
const getChartOption = (nodes: any[], links: any[]) => {
  return {
    title: {
      show: false,
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
        symbolSize: 50,
        edgeSymbol: ["circle", "arrow"],
        edgeSymbolSize: [4, 6],
        edgeLabel: {
          normal: {
            show: true,
            textStyle: {
              fontSize: 12,
              fontWeight: "bold",
            },
            formatter: "{c}",
          },
        },
        force: {
          repulsion: 2000,
          edgeLength: [50, 150],
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
              fontSize: 14,
              fontWeight: "bold",
              color: "#333",
            },
          },
        },
        tooltip: {
          formatter: function (node: any) {
            return node.data.name;
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

  const container = chartContainer.value;
  const rect = container.getBoundingClientRect();

  if (rect.width === 0 || rect.height === 0) {
    setTimeout(initChart, 100);
    return;
  }

  if (chartInstance) {
    chartInstance.dispose();
    chartInstance = null;
  }

  chartInstance = echarts.init(container);
  chartInstance.setOption(getChartOption([], []));

  window.addEventListener("resize", handleResize);
};

// 处理resize
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize();
  }
};

// 搜索问答
const search = async () => {
  if (!searchQuery.value.trim()) return;

  try {
    // 先尝试使用Mock数据
    const mockData = mockAnswers[searchQuery.value.trim()];

    if (mockData) {
      displayResult(mockData);
      return;
    }

    // 尝试API调用
    const response = await kgqaAnswer({ name: searchQuery.value });
    const json = response.data;

    if (json && Array.isArray(json) && json.length >= 3) {
      const resultData = {
        nodes: json[0]?.data || [],
        links: json[0]?.links || [],
        profile: json[1] || "",
        picture: json[2] || null,
      };
      displayResult(resultData);
    } else {
      // 使用默认mock数据
      displayResult({
        nodes: [
          { name: "贾宝玉", category: 0, symbolSize: 60 },
          { name: "林黛玉", category: 6, symbolSize: 60 },
        ],
        links: [{ source: "贾宝玉", target: "林黛玉", value: "表兄妹" }],
        profile:
          "<dl><dt>提示</dt><dd>未找到相关答案，请尝试其他问题</dd></dl>",
        picture: null,
      });
    }
  } catch (error) {
    console.error("搜索失败:", error);
    // 使用默认mock数据
    displayResult({
      nodes: [
        { name: "贾宝玉", category: 0, symbolSize: 60 },
        { name: "林黛玉", category: 6, symbolSize: 60 },
        { name: "薛宝钗", category: 4, symbolSize: 60 },
      ],
      links: [
        { source: "贾宝玉", target: "林黛玉", value: "表兄妹" },
        { source: "贾宝玉", target: "薛宝钗", value: "表姐弟" },
      ],
      profile: "<dl><dt>提示</dt><dd>网络异常，已使用本地数据</dd></dl>",
      picture: null,
    });
  }
};

// 显示结果
const displayResult = (data: {
  nodes: any[];
  links: any[];
  profile: string;
  picture: string | null;
}) => {
  // 更新图表
  if (chartInstance) {
    chartInstance.setOption(getChartOption(data.nodes, data.links), true);
  }

  // 更新人物信息
  profile.value = data.profile;

  // 更新图片
  if (data.picture) {
    pictureSrc.value = "data:image/jpg;base64," + data.picture;
    showPicture.value = true;
  } else {
    showPicture.value = false;
    pictureSrc.value = "";
  }

  // 更新当前人物名称
  if (data.nodes.length > 0) {
    currentCharacter.value = data.nodes[0].name;
  }
};

// 生命周期
onMounted(() => {
  initChart();
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

/* 搜索区域 */
.search-section {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
}

.search-box {
  display: flex;
  gap: 12px;
}

.search-input {
  flex: 1;
  padding: 12px 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s;
}

.search-input:focus {
  border-color: #249e92;
}

.search-btn {
  padding: 12px 30px;
  background-color: #249e92;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background-color: #1a7f75;
}

/* 结果展示区域 */
.result-area {
  flex: 1;
  display: flex;
  gap: 20px;
  min-height: 400px;
}

/* 左侧关系链图表 */
.relation-chart {
  flex: 2;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
}

.chart-container {
  flex: 1;
  min-height: 350px;
}

/* 右侧结果面板 */
.result-panel {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 15px 0;
}

/* 人物图片 */
.picture-container {
  width: 200px;
  height: 200px;
  margin: 0 auto 20px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e0e0e0;
}

.picture-container.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.no-image {
  color: #999;
  font-size: 14px;
}

.character-picture {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 人物信息 */
.info-panel {
  flex: 1;
  overflow-y: auto;
}

.character-name {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.profile-content {
  font-size: 14px;
  color: #666;
}

.profile-content dl {
  margin: 0;
}

.profile-content dt {
  float: left;
  width: 80px;
  font-weight: bold;
  color: #333;
  clear: left;
}

.profile-content dd {
  margin-left: 90px;
  margin-bottom: 8px;
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
