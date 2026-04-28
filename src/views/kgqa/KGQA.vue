<template>
  <div id="container" class="effect aside-float aside-bright mainnav-lg">
    <!-- 导航栏 -->
    <header id="navbar">
      <div id="navbar-container" class="boxed">
        <div class="navbar-header">
          <a href="#" @click="navigateToWelcome" class="navbar-brand">
            <img src="../../assets/logo.png" alt="Logo" class="brand-icon">
            <div class="brand-title">
              <span class="brand-text">林智敏毕设</span>
            </div>
          </a>
        </div>
        <div class="navbar-content clearfix">
          <ul class="nav navbar-top-links pull-left">
            <li class="tgl-menu-btn">
              <a class="mainnav-toggle" href="#">
                <i class="demo-pli-view-list"></i>
              </a>
            </li>
          </ul>
          <ul class="nav navbar-top-links pull-left">
            <h4>基于知识图谱的《红楼梦》人物关系可视化及问答系统</h4>
          </ul>
        </div>
      </div>
    </header>

    <div class="boxed">
      <!-- 内容容器 -->
      <div id="content-container">
        <div id="page-content">
          <h4 class="text-main pad-btm bord-btm">问答系统</h4>
          
          <div class="row">
            <div class="col-lg-6">
              <div class="input-group">
                <input type="text" id="search" v-model="searchQuery" class="form-control input-lg" placeholder="请输入你的问题(eg.贾宝玉的爸爸是谁？)">
                <span class="input-group-addon btn btn-primary" @click="search">搜索</span>
              </div>
            </div>
          </div>
          
          <div class="row" style="height: 40px;"></div>
          
          <div class="row">
            <div class="col-lg-6" style="height: 400px;">
              <v-chart ref="chartRef" :option="chartOption" @click="handleChartClick" />
            </div>
            <div class="col-lg-1"></div>
            <div class="col-lg-4">
              <div class="row" style="width:200px;height:200px;">
                <img id="picture" v-if="showPicture" :style="{display: 'block', width: '200px', height: '200px'}" :src="pictureSrc" >
              </div>
              <div class="row">
                <div class="basic-info">
                  <dl class="basicInfo-block basicInfo-left" id="profile" v-html="profile"></dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 侧边导航 -->
      <nav id="mainnav-container">
        <div id="mainnav">
          <div id="mainnav-menu-wrap">
            <div class="nano">
              <div class="nano-content">
                <ul id="mainnav-menu" class="list-group">
                  <li class="list-header">人物关系可视化</li>
                  <li>
                    <a href="#" @click="navigateToSearch">
                      <i class="fa fa-search" style="width:24px"></i>
                      <span class="menu-title">
                        <strong>检索人物关系</strong>
                      </span>
                    </a>
                  </li>
                  <li>
                    <a href="#" @click="navigateToAllRelation">
                      <i class="fa fa-pie-chart" style="width:24px"></i>
                      <span class="menu-title">
                        <strong>红楼梦人物关系全貌</strong>
                      </span>
                    </a>
                  </li>
                  <li class="list-divider"></li>
                  <li class="list-header">问答系统</li>
                  <li>
                    <a href="#" @click="navigateToKGQA">
                      <i class="fa fa-question-circle" style="width:24px"></i>
                      <span class="menu-title">人物关系问答</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>

    <!-- 页脚 -->
    <footer id="footer">
      <p class="pad-lft">Copyright&#169; 2018 林智敏 &nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;All Rights Reserved</p>
    </footer>

    <!-- 回到顶部按钮 -->
    <button class="scroll-top btn">
      <i class="pci-chevron chevron-up"></i>
    </button>
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
  GraphComponent
} from 'echarts/components';
import { kgqaAnswer, getProfile } from '@/api/kgqa';

// 注册必要的组件
use([
  CanvasRenderer,
  TitleComponent,
  LegendComponent,
  TooltipComponent,
  GraphComponent
]);

const router = useRouter();
const chartRef = ref();
const searchQuery = ref('');
const profile = ref('');
const pictureSrc = ref('');
const showPicture = ref(false);

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
    data: ["贾家荣国府", "贾家宁国府", "王家", "史家", "薛家", "其他", "林家"]
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
        { name: '贾家荣国府' },
        { name: '贾家宁国府' },
        { name: '王家' },
        { name: '史家' },
        { name: '薛家' },
        { name: '其他' },
        { name: '林家' }
      ],
      label: {
        normal: {
          show: true,
          textStyle: {
            fontSize: 10
          },
        }
      },
      force: {
        repulsion: 1000
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
          opacity: 0.9,
          width: 1,
          curveness: 0.3
        }
      },
      nodes: [],
      links: []
    }
  ]
});

const navigateToWelcome = () => {
  router.push('/kgqa/welcome');
};

const navigateToSearch = () => {
  router.push('/kgqa/search');
};

const navigateToAllRelation = () => {
  router.push('/kgqa/all-relation');
};

const navigateToKGQA = () => {
  router.push('/kgqa/qa');
};

const search = async () => {
  if (!searchQuery.value) return;
  
  try {
    const response = await kgqaAnswer({ name: searchQuery.value });
    
    const json = response.data;
    
    // 检查数据格式是否正确
    if (json && Array.isArray(json) && json.length >= 3) {
      if (json[0] && json[0].data) {
        chartOption.series[0].nodes = json[0].data.map((node: any, idx: number) => {
          node.id = idx;
          return node;
        });
        chartOption.series[0].links = json[0].links || [];
      }
      
      profile.value = json[1] || '';
      if (json[2]) {
        pictureSrc.value = "data:image/jpg;base64," + json[2];
        showPicture.value = true;
      } else {
        showPicture.value = false;
      }
    } else {
      console.error('返回数据格式不正确:', json);
    }
  } catch (error) {
    console.error('搜索失败:', error);
  }
};

const handleChartClick = async (params: any) => {
  if (params.name) {
    try {
      const response = await getProfile({ character_name: params.name });
      
      const data = response.data;
      // 检查数据格式是否正确
      if (data && Array.isArray(data) && data.length >= 2) {
        profile.value = data[0] || '';
        if (data[1]) {
          pictureSrc.value = "data:image/jpg;base64," + data[1];
          showPicture.value = true;
        } else {
          showPicture.value = false;
        }
      } else {
        console.error('返回数据格式不正确:', data);
        showPicture.value = false;
      }
    } catch (error) {
      console.error('获取人物信息失败:', error);
    }
  }
};

// 回车键事件
const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    search();
  }
};

onMounted(() => {
  window.addEventListener('keypress', handleKeyPress);
});
</script>

<style scoped>
/* 导航栏样式 */
#navbar {
  background-color: #fff;
  border-bottom: 1px solid #e5e5e5;
}

.brand-icon {
  width: 32px;
  height: 32px;
}

.brand-text {
  font-size: 18px;
  font-weight: bold;
}

/* 侧边栏样式 */
#mainnav-container {
  background-color: #f5f5f5;
  border-right: 1px solid #e5e5e5;
}

.list-header {
  padding: 10px 15px;
  font-weight: bold;
  color: #666;
  background-color: #f0f0f0;
}

.menu-title {
  font-size: 14px;
}

/* 页脚样式 */
#footer {
  background-color: #f5f5f5;
  border-top: 1px solid #e5e5e5;
  padding: 10px 0;
  text-align: center;
  font-size: 14px;
  color: #666;
}

/* 回到顶部按钮 */
.scroll-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #249e92;
  color: #fff;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-top:hover {
  background-color: #1a7f75;
}

/* 人物信息样式 */
.basic-info {
  margin-top: 20px;
}

.basicInfo-block {
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 5px;
}

.basicInfo-block dt {
  font-weight: bold;
  margin-bottom: 5px;
}

.basicInfo-block dd {
  margin-bottom: 10px;
  color: #666;
}
</style>