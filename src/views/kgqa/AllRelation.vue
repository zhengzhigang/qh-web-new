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
      <!-- 控制区域 -->
      <div class="control-section">
        <div class="section-title">查看四大家族族谱</div>
        <div class="control-group">
          <el-select v-model="selectedFamily" @change="filterByFamily" placeholder="请选择家族" style="width: 200px;">
            <el-option label="全部家族" value="all" />
            <el-option label="贾家荣国府" value="0" />
            <el-option label="贾家宁国府" value="1" />
            <el-option label="王家" value="2" />
            <el-option label="史家" value="3" />
            <el-option label="薛家" value="4" />
            <el-option label="其他" value="5" />
            <el-option label="林家" value="6" />
          </el-select>
          <el-button type="primary" @click="filterByFamily" size="large">选择</el-button>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="chart-area">
        <div ref="chartContainer" id="relation-chart" class="chart-container"></div>
      </div>
    </main>

    <!-- 页脚 -->
    <footer id="footer">
      <p>Copyright© 2018 林智敏 | All Rights Reserved</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import * as echarts from 'echarts';
import { ElSelect, ElOption, ElButton } from 'element-plus';

const chartContainer = ref<HTMLElement | null>(null);
let chartInstance: echarts.ECharts | null = null;
const selectedFamily = ref('all');

// 图表配置
const getChartOption = (nodes: any[], links: any[]) => {
  return {
    title: {
      text: '红楼梦人物关系图',
      textStyle: {
        fontWeight: 'lighter',
        fontSize: 18,
      },
      left: 'center',
      top: 10,
    },
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    legend: {
      x: 'center',
      show: true,
      data: ['贾家荣国府', '贾家宁国府', '王家', '史家', '薛家', '其他', '林家'],
      bottom: 10,
      textStyle: {
        fontSize: 12,
      },
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        symbolSize: 45,
        edgeSymbol: ['circle', 'arrow'],
        edgeSymbolSize: [4, 4],
        edgeLabel: {
          normal: {
            show: true,
            textStyle: {
              fontSize: 10,
            },
            formatter: '{c}',
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
          { name: '贾家荣国府', itemStyle: { color: '#d9363e' } },
          { name: '贾家宁国府', itemStyle: { color: '#2d50a7' } },
          { name: '王家', itemStyle: { color: '#2387c4' } },
          { name: '史家', itemStyle: { color: '#e17b36' } },
          { name: '薛家', itemStyle: { color: '#4aaf5c' } },
          { name: '其他', itemStyle: { color: '#7a5d9e' } },
          { name: '林家', itemStyle: { color: '#c2823a' } },
        ],
        label: {
          normal: {
            show: true,
            textStyle: {
              fontSize: 12,
              fontWeight: 'bold',
              color: '#333',
            },
          },
        },
        tooltip: {
          formatter: function (node: any) {
            if (!node.value) {
              return node.data.name;
            } else {
              return node.data.name + ':' + node.data.showNum;
            }
          },
        },
        lineStyle: {
          normal: {
            color: '#999',
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

// 所有人物数据（mock数据）
const allCharacters = [
  // 贾家荣国府
  { name: '贾宝玉', category: 0, symbolSize: 70 },
  { name: '贾政', category: 0, symbolSize: 55 },
  { name: '王夫人', category: 2, symbolSize: 50 },
  { name: '贾母', category: 0, symbolSize: 60 },
  { name: '贾珠', category: 0, symbolSize: 45 },
  { name: '贾环', category: 0, symbolSize: 40 },
  { name: '贾元春', category: 0, symbolSize: 55 },
  { name: '贾探春', category: 0, symbolSize: 50 },
  { name: '贾迎春', category: 0, symbolSize: 45 },
  { name: '贾惜春', category: 0, symbolSize: 45 },
  { name: '贾赦', category: 0, symbolSize: 50 },
  { name: '贾琏', category: 0, symbolSize: 55 },
  { name: '王熙凤', category: 2, symbolSize: 55 },
  { name: '巧姐', category: 0, symbolSize: 40 },
  // 贾家宁国府
  { name: '贾珍', category: 1, symbolSize: 50 },
  { name: '贾敬', category: 1, symbolSize: 45 },
  { name: '贾蓉', category: 1, symbolSize: 40 },
  { name: '贾兰', category: 1, symbolSize: 35 },
  // 王家
  { name: '王子腾', category: 2, symbolSize: 45 },
  // 史家
  { name: '史湘云', category: 3, symbolSize: 55 },
  // 薛家
  { name: '薛宝钗', category: 4, symbolSize: 60 },
  { name: '薛姨妈', category: 4, symbolSize: 50 },
  { name: '薛蟠', category: 4, symbolSize: 45 },
  { name: '薛宝琴', category: 4, symbolSize: 40 },
  // 林家
  { name: '林黛玉', category: 6, symbolSize: 65 },
  { name: '林如海', category: 6, symbolSize: 45 },
  { name: '贾敏', category: 6, symbolSize: 40 },
  // 其他
  { name: '袭人', category: 5, symbolSize: 45 },
  { name: '紫鹃', category: 5, symbolSize: 40 },
  { name: '鸳鸯', category: 5, symbolSize: 35 },
  { name: '平儿', category: 5, symbolSize: 35 },
  { name: '晴雯', category: 5, symbolSize: 35 },
  { name: '妙玉', category: 5, symbolSize: 40 },
  { name: '香菱', category: 5, symbolSize: 35 },
];

// 所有关系数据（mock数据）
const allRelations = [
  // 贾宝玉相关
  { source: '贾宝玉', target: '贾政', value: '父子' },
  { source: '贾宝玉', target: '王夫人', value: '母子' },
  { source: '贾宝玉', target: '贾母', value: '祖孙' },
  { source: '贾宝玉', target: '贾珠', value: '兄弟' },
  { source: '贾宝玉', target: '贾环', value: '兄弟' },
  { source: '贾宝玉', target: '贾元春', value: '姐弟' },
  { source: '贾宝玉', target: '贾探春', value: '兄妹' },
  { source: '贾宝玉', target: '林黛玉', value: '表兄妹' },
  { source: '贾宝玉', target: '薛宝钗', value: '表姐弟' },
  { source: '贾宝玉', target: '袭人', value: '主仆' },
  // 贾政相关
  { source: '贾政', target: '贾母', value: '母子' },
  { source: '贾政', target: '贾赦', value: '兄弟' },
  { source: '贾政', target: '贾敏', value: '兄妹' },
  // 王夫人相关
  { source: '王夫人', target: '王熙凤', value: '姑侄' },
  // 贾母相关
  { source: '贾母', target: '贾赦', value: '母子' },
  { source: '贾母', target: '史湘云', value: '姑祖母' },
  // 贾琏相关
  { source: '贾琏', target: '王熙凤', value: '夫妻' },
  { source: '贾琏', target: '巧姐', value: '父女' },
  { source: '贾琏', target: '贾赦', value: '父子' },
  // 贾珍相关
  { source: '贾珍', target: '贾敬', value: '父子' },
  { source: '贾珍', target: '贾蓉', value: '父子' },
  // 薛宝钗相关
  { source: '薛宝钗', target: '薛姨妈', value: '母女' },
  { source: '薛宝钗', target: '薛蟠', value: '姐弟' },
  { source: '薛宝钗', target: '薛宝琴', value: '堂妹' },
  // 林黛玉相关
  { source: '林黛玉', target: '林如海', value: '父女' },
  { source: '林黛玉', target: '贾敏', value: '母女' },
  { source: '林黛玉', target: '紫鹃', value: '主仆' },
  { source: '林黛玉', target: '薛宝钗', value: '姐妹' },
  // 史湘云相关
  { source: '史湘云', target: '贾母', value: '姑祖母' },
  // 其他关系
  { source: '贾宝玉', target: '史湘云', value: '表兄妹' },
  { source: '贾宝玉', target: '妙玉', value: '朋友' },
  { source: '王熙凤', target: '平儿', value: '主仆' },
  { source: '贾母', target: '鸳鸯', value: '主仆' },
  { source: '薛蟠', target: '香菱', value: '妾' },
];

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) return;

  // 确保容器有高度
  const container = chartContainer.value;
  const rect = container.getBoundingClientRect();
  console.log('Chart container size:', rect.width, 'x', rect.height);

  if (rect.width === 0 || rect.height === 0) {
    console.warn('Chart container has no size, retrying...');
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
  chartInstance.setOption(getChartOption(allCharacters, allRelations));

  // 添加resize监听
  window.addEventListener('resize', handleResize);
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

  let filteredNodes = allCharacters;
  let filteredLinks = allRelations;

  if (selectedFamily.value !== 'all') {
    const category = parseInt(selectedFamily.value);
    const familyMemberNames = allCharacters
      .filter((node) => node.category === category)
      .map((node) => node.name);

    const relatedNames = new Set<string>();
    familyMemberNames.forEach((name) => {
      relatedNames.add(name);
      allRelations.forEach((link) => {
        if (link.source === name || link.target === name) {
          relatedNames.add(link.source);
          relatedNames.add(link.target);
        }
      });
    });

    filteredNodes = allCharacters.filter((node) => relatedNames.has(node.name));
    filteredLinks = allRelations.filter(
      (link) => relatedNames.has(link.source) && relatedNames.has(link.target)
    );
  }

  chartInstance.setOption(getChartOption(filteredNodes, filteredLinks), true);
};

// 生命周期
onMounted(async () => {
  await nextTick();
  await nextTick();
  initChart();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
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
