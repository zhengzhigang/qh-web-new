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

      <!-- 图表和人物列表区域 -->
      <div class="content-area">
        <!-- 图表区域 -->
        <div class="chart-container">
          <v-chart ref="chartRef" :option="chartOption" style="width: 100%; height: 100%;" />
        </div>

        <!-- 人物标签列表 -->
        <div class="character-list">
          <div 
            v-for="character in characters" 
            :key="character" 
            class="character-tag"
            @click="searchByName(character)"
          >
            {{ character }}
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
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import VChart from 'vue-echarts';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import {
  TitleComponent,
  LegendComponent,
  TooltipComponent,
} from 'echarts/components';
import { searchName } from '@/api/kgqa';

// 注册必要的组件
use([
  CanvasRenderer,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
]);

const router = useRouter();
const chartRef = ref();
const searchQuery = ref('');
const chartOption = reactive({
  title: {
    textStyle: {
      fontWeight: "lighter",
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
          opacity: 0.6,
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

const navigateToWelcome = () => {
  router.push('/kgqa/welcome');
};

const search = async () => {
  if (!searchQuery.value) return;
  
  try {
    const response = await searchName({ name: searchQuery.value });
    
    chartOption.series[0].nodes = response.data.data.map((node: any, idx: number) => {
      node.id = idx;
      return node;
    });
    chartOption.series[0].links = response.data.links;
  } catch (error) {
    console.error('搜索失败:', error);
  }
};

const searchByName = async (name: string) => {
  searchQuery.value = name;
  try {
    const response = await searchName({ name });
    
    chartOption.series[0].nodes = response.data.data.map((node: any, idx: number) => {
      node.id = idx;
      return node;
    });
    chartOption.series[0].links = response.data.links;
  } catch (error) {
    console.error('搜索失败:', error);
  }
};

onMounted(() => {
  // 默认加载贾宝玉的关系图
  searchByName('贾宝玉');
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

/* 内容区域 */
.content-area {
  flex: 1;
  display: flex;
  gap: 20px;
  min-height: 500px;
}

/* 图表区域 */
.chart-container {
  flex: 1;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 20px;
}

/* 人物标签列表 */
.character-list {
  width: 200px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-content: flex-start;
}

.character-tag {
  padding: 6px 12px;
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.character-tag:hover {
  background-color: #249e92;
  color: #fff;
  border-color: #249e92;
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