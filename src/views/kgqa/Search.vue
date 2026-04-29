<template>
  <div id="container">
    <!-- 顶部导航栏 -->
    <header id="header">
      <div class="header-content">
        <h1>基于知识图谱的《红楼梦》人物关系可视化及问答系统</h1>
      </div>
    </header>

    <!-- 主体内容区域 -->
    <main id="main-content">
      <!-- 搜索区域 -->
      <div class="search-section">
        <h2 class="section-title">人物关系可视化</h2>
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            id="search-input"
            placeholder="请输入你要检索的名字..."
            @keyup.enter="search"
          >
          <button class="search-btn" @click="search">搜索</button>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="charts-area">
        <!-- 关系图 -->
        <div class="chart-box graph-box">
          <h3 class="chart-title">人物关系图</h3>
          <v-chart ref="graphRef" :option="graphOption" style="width: 100%; height: 100%;" autoresize />
        </div>

        <!-- 词云图 -->
        <div class="chart-box wordcloud-box">
          <h3 class="chart-title">人物词云</h3>
          <v-chart ref="wordCloudRef" :option="wordCloudOption" style="width: 100%; height: 100%;" autoresize @click="onWordCloudClick" />
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

import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  TitleComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import { GraphChart } from 'echarts/charts';
import 'echarts-wordcloud';
import { searchName } from '@/api/kgqa';

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
const searchQuery = ref('');

// 词云图配置
const wordCloudOption = ref<any>({
  tooltip: {
    show: true,
    formatter: (params: any) => {
      return `${params.name}: ${params.value}次`;
    }
  },
  series: [{
    type: 'wordCloud',
    shape: 'circle',
    left: 'center',
    top: 'center',
    width: '90%',
    height: '90%',
    sizeRange: [14, 60],
    rotationRange: [-45, 45],
    rotationStep: 15,
    gridSize: 8,
    drawOutOfBound: false,
    keepAspect: true,
    animation: true,
    animationDuration: 3000,
    animationEasing: 'sinusoidalInOut',
    textStyle: {
      fontFamily: 'sans-serif',
      fontWeight: 'bold',
      color: () => {
        const colorList = ['#d9363e', '#2d50a7', '#2387c4', '#e17b36', '#4aaf5c', '#7a5d9e', '#c2823a'];
        return colorList[Math.floor(Math.random() * colorList.length)];
      }
    },
    emphasis: {
      textStyle: {
        shadowBlur: 10,
        shadowColor: '#333'
      }
    },
    data: []
  }]
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
    text: '',
    textStyle: {
      fontWeight: 'normal',
    }
  },
  animationDurationUpdate: 1500,
  animationEasingUpdate: 'quinticInOut',
  legend: {
    x: "center",
    show: true,
    data: ["贾家荣国府", "贾家宁国府", "王家", "史家", "薛家", "其他", "林家"],
    bottom: 10,
    textStyle: {
      fontSize: 12
    }
  },
  series: [
    {
      type: 'graph',
      layout: 'force',
      symbolSize: 50,
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 4],
      edgeLabel: {
        normal: {
          show: true,
          textStyle: {
            fontSize: 10
          },
          formatter: "{c}"
        }
      },
      force: {
        repulsion: 2500,
        edgeLength: [10, 100]
      },
      focusNodeAdjacency: true,
      draggable: true,
      roam: true,
      categories: [
        { name: '贾家荣国府', itemStyle: { color: '#d9363e' } },
        { name: '贾家宁国府', itemStyle: { color: '#2d50a7' } },
        { name: '王家', itemStyle: { color: '#2387c4' } },
        { name: '史家', itemStyle: { color: '#e17b36' } },
        { name: '薛家', itemStyle: { color: '#4aaf5c' } },
        { name: '其他', itemStyle: { color: '#7a5d9e' } },
        { name: '林家', itemStyle: { color: '#c2823a' } }
      ],
      label: {
        normal: {
          show: true,
          textStyle: {
            fontSize: 12,
            fontWeight: 'bold',
            color: '#333'
          },
        }
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
          color: '#999',
          opacity: 0.8,
          width: 2,
          curveness: 0.2
        }
      },
      nodes: [],
      links: []
    }
  ]
});

const characters = [
  "贾宝玉", "林黛玉", "薛宝钗", "王熙凤", "贾政", "贾母",
  "贾赦", "贾琏", "贾珍", "王夫人", "贾探春", "贾迎春",
  "贾惜春", "贾环", "巧姐", "袭人", "贾敬", "贾蓉",
  "贾兰", "史湘云"
];

// Mock数据 - 人物关系
const mockData: Record<string, { data: any[]; links: any[] }> = {
  "贾宝玉": {
    data: [
      { name: "贾宝玉", category: 0, symbolSize: 70 },
      { name: "贾政", category: 0, symbolSize: 50 },
      { name: "王夫人", category: 2, symbolSize: 50 },
      { name: "贾母", category: 0, symbolSize: 55 },
      { name: "林黛玉", category: 6, symbolSize: 60 },
      { name: "薛宝钗", category: 4, symbolSize: 55 },
      { name: "贾珠", category: 0, symbolSize: 45 },
      { name: "贾环", category: 0, symbolSize: 40 },
      { name: "贾元春", category: 0, symbolSize: 50 },
      { name: "贾探春", category: 0, symbolSize: 45 },
      { name: "袭人", category: 5, symbolSize: 40 },
      { name: "史湘云", category: 3, symbolSize: 50 },
    ],
    links: [
      { source: "贾宝玉", target: "贾政", value: "父子" },
      { source: "贾宝玉", target: "王夫人", value: "母子" },
      { source: "贾宝玉", target: "贾母", value: "祖孙" },
      { source: "贾宝玉", target: "林黛玉", value: "表兄妹" },
      { source: "贾宝玉", target: "薛宝钗", value: "表姐弟" },
      { source: "贾宝玉", target: "贾珠", value: "兄弟" },
      { source: "贾宝玉", target: "贾环", value: "兄弟" },
      { source: "贾宝玉", target: "贾元春", value: "姐弟" },
      { source: "贾宝玉", target: "贾探春", value: "兄妹" },
      { source: "贾宝玉", target: "袭人", value: "主仆" },
      { source: "贾宝玉", target: "史湘云", value: "表兄妹" },
    ]
  },
  "林黛玉": {
    data: [
      { name: "林黛玉", category: 6, symbolSize: 70 },
      { name: "贾宝玉", category: 0, symbolSize: 60 },
      { name: "贾母", category: 0, symbolSize: 55 },
      { name: "薛宝钗", category: 4, symbolSize: 55 },
      { name: "史湘云", category: 3, symbolSize: 50 },
      { name: "贾迎春", category: 0, symbolSize: 45 },
      { name: "贾惜春", category: 0, symbolSize: 45 },
      { name: "紫鹃", category: 5, symbolSize: 40 },
    ],
    links: [
      { source: "林黛玉", target: "贾宝玉", value: "表兄妹" },
      { source: "林黛玉", target: "贾母", value: "祖孙" },
      { source: "林黛玉", target: "薛宝钗", value: "姐妹" },
      { source: "林黛玉", target: "史湘云", value: "姐妹" },
      { source: "林黛玉", target: "贾迎春", value: "姐妹" },
      { source: "林黛玉", target: "贾惜春", value: "姐妹" },
      { source: "林黛玉", target: "紫鹃", value: "主仆" },
    ]
  },
  "薛宝钗": {
    data: [
      { name: "薛宝钗", category: 4, symbolSize: 70 },
      { name: "贾宝玉", category: 0, symbolSize: 60 },
      { name: "林黛玉", category: 6, symbolSize: 60 },
      { name: "薛姨妈", category: 4, symbolSize: 50 },
      { name: "薛蟠", category: 4, symbolSize: 45 },
      { name: "贾母", category: 0, symbolSize: 50 },
      { name: "王夫人", category: 2, symbolSize: 50 },
    ],
    links: [
      { source: "薛宝钗", target: "贾宝玉", value: "表姐弟" },
      { source: "薛宝钗", target: "林黛玉", value: "姐妹" },
      { source: "薛宝钗", target: "薛姨妈", value: "母女" },
      { source: "薛宝钗", target: "薛蟠", value: "姐弟" },
      { source: "薛宝钗", target: "贾母", value: "亲戚" },
      { source: "薛宝钗", target: "王夫人", value: "姨甥" },
    ]
  },
  "王熙凤": {
    data: [
      { name: "王熙凤", category: 2, symbolSize: 70 },
      { name: "贾琏", category: 0, symbolSize: 55 },
      { name: "贾政", category: 0, symbolSize: 50 },
      { name: "王夫人", category: 2, symbolSize: 50 },
      { name: "贾母", category: 0, symbolSize: 55 },
      { name: "巧姐", category: 0, symbolSize: 40 },
      { name: "贾蓉", category: 1, symbolSize: 45 },
    ],
    links: [
      { source: "王熙凤", target: "贾琏", value: "夫妻" },
      { source: "王熙凤", target: "贾政", value: "叔侄媳" },
      { source: "王熙凤", target: "王夫人", value: "姑侄" },
      { source: "王熙凤", target: "贾母", value: "婆媳" },
      { source: "王熙凤", target: "巧姐", value: "母女" },
      { source: "王熙凤", target: "贾蓉", value: "婶侄" },
    ]
  },
  "贾政": {
    data: [
      { name: "贾政", category: 0, symbolSize: 70 },
      { name: "贾宝玉", category: 0, symbolSize: 60 },
      { name: "贾珠", category: 0, symbolSize: 50 },
      { name: "贾环", category: 0, symbolSize: 45 },
      { name: "贾元春", category: 0, symbolSize: 50 },
      { name: "贾探春", category: 0, symbolSize: 45 },
      { name: "王夫人", category: 2, symbolSize: 50 },
      { name: "贾母", category: 0, symbolSize: 55 },
      { name: "贾赦", category: 0, symbolSize: 50 },
    ],
    links: [
      { source: "贾政", target: "贾宝玉", value: "父子" },
      { source: "贾政", target: "贾珠", value: "父子" },
      { source: "贾政", target: "贾环", value: "父子" },
      { source: "贾政", target: "贾元春", value: "父女" },
      { source: "贾政", target: "贾探春", value: "父女" },
      { source: "贾政", target: "王夫人", value: "夫妻" },
      { source: "贾政", target: "贾母", value: "母子" },
      { source: "贾政", target: "贾赦", value: "兄弟" },
    ]
  },
  "贾母": {
    data: [
      { name: "贾母", category: 0, symbolSize: 75 },
      { name: "贾宝玉", category: 0, symbolSize: 60 },
      { name: "林黛玉", category: 6, symbolSize: 60 },
      { name: "贾政", category: 0, symbolSize: 50 },
      { name: "贾赦", category: 0, symbolSize: 50 },
      { name: "贾敏", category: 6, symbolSize: 45 },
      { name: "史湘云", category: 3, symbolSize: 50 },
      { name: "王熙凤", category: 2, symbolSize: 50 },
    ],
    links: [
      { source: "贾母", target: "贾宝玉", value: "祖孙" },
      { source: "贾母", target: "林黛玉", value: "祖孙" },
      { source: "贾母", target: "贾政", value: "母子" },
      { source: "贾母", target: "贾赦", value: "母子" },
      { source: "贾母", target: "贾敏", value: "母女" },
      { source: "贾母", target: "史湘云", value: "姑祖孙" },
      { source: "贾母", target: "王熙凤", value: "婆媳" },
    ]
  },
  "史湘云": {
    data: [
      { name: "史湘云", category: 3, symbolSize: 70 },
      { name: "贾宝玉", category: 0, symbolSize: 60 },
      { name: "林黛玉", category: 6, symbolSize: 60 },
      { name: "薛宝钗", category: 4, symbolSize: 55 },
      { name: "贾母", category: 0, symbolSize: 55 },
    ],
    links: [
      { source: "史湘云", target: "贾宝玉", value: "表兄妹" },
      { source: "史湘云", target: "林黛玉", value: "姐妹" },
      { source: "史湘云", target: "薛宝钗", value: "姐妹" },
      { source: "史湘云", target: "贾母", value: "姑祖孙" },
    ]
  }
};

// 获取Mock数据
const getMockData = (name: string) => {
  return mockData[name] || mockData["贾宝玉"];
};

// 固定词云数据
const fixedWordCloudData = [
  { name: '贾宝玉', value: 700 },
  { name: '林黛玉', value: 600 },
  { name: '薛宝钗', value: 550 },
  { name: '王熙凤', value: 500 },
  { name: '贾母', value: 480 },
  { name: '贾政', value: 450 },
  { name: '史湘云', value: 420 },
  { name: '贾琏', value: 400 },
  { name: '贾迎春', value: 380 },
  { name: '贾探春', value: 380 },
  { name: '贾惜春', value: 370 },
  { name: '袭人', value: 350 },
  { name: '贾元春', value: 340 },
  { name: '贾珠', value: 330 },
  { name: '贾环', value: 320 },
  { name: '王夫人', value: 310 },
  { name: '贾赦', value: 300 },
  { name: '巧姐', value: 290 },
  { name: '贾珍', value: 280 },
  { name: '贾蓉', value: 270 },
  { name: '紫鹃', value: 260 },
  { name: '贾兰', value: 250 },
  { name: '薛蟠', value: 240 },
  { name: '贾敬', value: 230 },
  { name: '薛姨妈', value: 220 },
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
  graphOption.value.series[0].nodes = data;
  graphOption.value.series[0].links = links;

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
      const data = response.data.data || [];
      const links = response.data.links || [];

      await nextTick();
      updateGraph(data, links);
    } else {
      throw new Error('响应数据为空');
    }
  } catch (error) {
    console.warn('API调用失败，使用Mock数据:', error);
    const mock = mockData[queryName];
    if (mock) {
      await nextTick();
      updateGraph(mock.data, mock.links);
    } else {
      const matchedKey = Object.keys(mockData).find(key =>
        key.includes(queryName) || queryName.includes(key)
      );
      if (matchedKey) {
        const matchedMock = mockData[matchedKey];
        await nextTick();
        updateGraph(matchedMock.data, matchedMock.links);
      } else {
        const defaultMock = mockData["贾宝玉"];
        await nextTick();
        updateGraph(defaultMock.data, defaultMock.links);
      }
    }
  }
};

const searchByName = async (name: string) => {
  searchQuery.value = name;
  try {
    const response = await searchName({ name });

    if (response.data) {
      const data = response.data.data || [];
      const links = response.data.links || [];

      await nextTick();
      updateGraph(data, links);
    } else {
      throw new Error('响应数据为空');
    }
  } catch (error) {
    console.warn('API调用失败，使用Mock数据:', error);
    const mock = mockData[name];
    if (mock) {
      await nextTick();
      updateGraph(mock.data, mock.links);
    } else {
      const defaultMock = mockData["贾宝玉"];
      await nextTick();
      updateGraph(defaultMock.data, defaultMock.links);
    }
  }
};

onMounted(async () => {
  await nextTick();
  await nextTick();

  // 初始化固定词云
  initWordCloud();

  // 默认加载贾宝玉的关系图
  const defaultMock = mockData["贾宝玉"];
  updateGraph(defaultMock.data, defaultMock.links);
});
</script>

<style scoped>
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
  font-size: 16px;
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
  margin-bottom: 20px;
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
  font-size: 14px;
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
</style>