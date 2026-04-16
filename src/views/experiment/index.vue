<template>
  <div class="experiment-page">
    <!-- 顶部标题栏 -->
    <div class="experiment-page__header">
      <div class="experiment-page__header-content">
        <div class="experiment-page__header-title">课时实验</div>
        <div class="experiment-page__header-subtitle">实验一</div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="experiment-page__content">
      <div class="experiment-page__container">
        <!-- 左侧菜单 -->
        <el-card
          class="experiment-page__sidebar"
          :body-style="{ padding: '0' }"
        >
          <div class="experiment-page__sidebar-title">实验列表</div>
          <el-menu
            :default-active="currentExperimentId"
            class="experiment-page__sidebar-menu"
            @select="selectExperiment"
          >
            <el-menu-item
              v-for="index in 5"
              :key="index"
              :index="index.toString()"
              class="experiment-page__sidebar-menu-item"
            >
              <span
                class="experiment-page__sidebar-menu-item-step"
                :class="getStepStatus(index)"
              >
                {{ index }}
              </span>
              实验{{
                index === 1
                  ? "一"
                  : index === 2
                  ? "二"
                  : index === 3
                  ? "三"
                  : index === 4
                  ? "四"
                  : "五"
              }}
            </el-menu-item>
          </el-menu>
          <div class="experiment-page__sidebar-progress">
            <div class="experiment-page__sidebar-progress-label">实验进度</div>
            <el-progress
              :percentage="progress"
              :stroke-width="8"
              :color="'#a81c1c'"
            />
          </div>
        </el-card>

        <!-- 右侧内容 -->
        <el-card class="experiment-page__main" :body-style="{ padding: '0' }">
          <div class="experiment-page__main-header">
            <div class="experiment-page__main-title">
              {{ currentExperiment.title }}
            </div>
            <div class="experiment-page__main-nav">
              <el-button
                type="primary"
                plain
                @click="previousExperiment"
                :disabled="currentExperimentId === '1'"
              >
                上一实验
              </el-button>
              <el-button
                type="primary"
                @click="nextExperiment"
                :disabled="currentExperimentId === '5'"
              >
                下一实验
              </el-button>
            </div>
          </div>

          <div class="experiment-page__main-content">
            <div
              class="experiment-page__markdown markdown-body"
              v-html="markdownContent"
            ></div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 页脚 -->
    <div class="experiment-page__footer">
      <div class="experiment-page__footer-content text-center">
        <p>© 2024 中央民族大学在线教学实验平台 · 版权所有</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from "vue";
import { marked } from "marked";

// 配置 marked 选项
marked.setOptions({
  breaks: true, // 支持 GitHub 风格的换行
  gfm: true, // 支持 GitHub 风格的 Markdown
});

// 当前实验ID
const currentExperimentId = ref("1");

// 实验数据
interface Experiment {
  id: string;
  title: string;
  content: string;
}

const experiments = reactive<Record<string, Experiment>>({
  "1": {
    id: "1",
    title: "实验一：网络基础配置实验",
    content: `# 实验一：网络基础配置实验

## 实验目的
1. 掌握网络基础概念和 TCP/IP 协议栈
2. 学习 IP 地址的分类和子网划分
3. 掌握基本网络命令的使用方法

## 实验环境
- **操作系统**：Windows 10 / Ubuntu 22.04 LTS
- **网络工具**：ping, ipconfig/ifconfig, netstat, traceroute
- **实验设备**：一台连接到网络的计算机

## 实验原理
网络基础配置是网络管理的核心内容。IP 地址是网络设备的唯一标识，分为 A、B、C、D、E 五类。子网掩码用于划分网络地址和主机地址。

### 常用网络命令
\`\`\`bash
# 查看网络配置
ipconfig /all        # Windows
ifconfig            # Linux

# 测试网络连通性
ping 8.8.8.8

# 查看路由追踪
tracert google.com  # Windows
traceroute google.com # Linux
\`\`\`

## 实验步骤
1. 使用 \`ipconfig\` 查看本机 IP 配置
2. 使用 \`ping\` 测试与网关的连通性
3. 使用 \`tracert\` 追踪到目标主机的路由

> **提示**：在 Linux 系统中，部分命令需要 \`sudo\` 权限

## 实验结果
记录本机的 IP 地址、子网掩码和默认网关信息。`,
  },
  "2": {
    id: "2",
    title: "实验二：网络协议分析实验",
    content: `# 实验二：网络协议分析实验

## 实验目的
通过本实验，掌握网络协议分析工具的使用方法，理解 TCP/IP 协议栈的工作原理。

## 实验环境
- **操作系统**：Windows 10 / Ubuntu 22.04 LTS
- **工具**：Wireshark
- **实验设备**：一台计算机，连接到网络

## 实验原理
网络协议分析是通过捕获和分析网络数据包来了解网络通信过程的技术。Wireshark 是一款功能强大的网络协议分析工具，可以捕获和分析各种网络协议的数据包。

### 主要协议分析
#### ARP 协议
地址解析协议，用于将 IP 地址转换为 MAC 地址

#### TCP 三次握手
1. Client 发送 SYN
2. Server 回复 SYN-ACK
3. Client 发送 ACK

## 实验步骤
1. 启动 Wireshark 并选择网络接口
2. 开始捕获数据包
3. 访问网站并停止捕获
4. 分析捕获到的 TCP 和 HTTP 数据包

## 实验结果
提交捕获的数据包截图和分析报告。`,
  },
  "3": {
    id: "3",
    title: "实验三：网络安全实验",
    content: `# 实验三：网络安全实验

## 实验目的
了解网络安全的基本概念和常见的网络攻击手段，掌握基本的网络安全防护措施。

## 实验环境
- **操作系统**：Windows 10 / Ubuntu 22.04 LTS
- **工具**：Nmap, Wireshark
- **实验设备**：两台虚拟机，一台作为攻击机，一台作为目标机

## 实验原理
网络安全是指保护网络系统免受未经授权的访问、使用、披露、修改或破坏。

### 常见攻击类型
- **端口扫描**：探测目标主机开放的服务端口
- **DoS 攻击**：耗尽目标系统资源
- **中间人攻击**：拦截并篡改通信数据

## 防护措施
1. 使用防火墙限制不必要的端口
2. 及时更新系统和软件补丁
3. 使用强密码和加密通信

## 实验步骤
1. 配置防火墙规则
2. 使用 Nmap 扫描本地端口
3. 分析扫描结果
4. 配置防护策略

> **注意**：本实验仅在虚拟环境中进行，请勿在真实网络环境中测试。`,
  },
  "4": {
    id: "4",
    title: "实验四：网络服务配置实验",
    content: `# 实验四：网络服务配置实验

## 实验目的
掌握常见网络服务的配置方法，包括 Web 服务、FTP 服务、DNS 服务等。

## 实验环境
- **操作系统**：Ubuntu 22.04 LTS
- **工具**：Apache2, vsftpd, BIND9
- **实验设备**：一台虚拟机

## 实验原理
网络服务是指在网络上提供的各种功能，如 Web 服务用于提供网页访问，FTP 服务用于文件传输，DNS 服务用于域名解析。

### Web 服务配置 (Apache)
\`\`\`bash
# 安装 Apache
sudo apt update
sudo apt install apache2

# 启动服务
sudo systemctl start apache2
sudo systemctl enable apache2

# 配置文件位置
/etc/apache2/sites-available/
\`\`\`

### FTP 服务配置 (vsftpd)
\`\`\`bash
# 安装 vsftpd
sudo apt install vsftpd

# 配置文件
sudo nano /etc/vsftpd.conf
\`\`\`

## 实验步骤
1. 安装和配置 Apache Web 服务器
2. 创建测试网页
3. 安装和配置 FTP 服务器
4. 测试服务功能

## 实验结果
提交服务配置文件和访问测试截图。`,
  },
  "5": {
    id: "5",
    title: "实验五：网络综合实验",
    content: `# 实验五：网络综合实验

## 实验目的
综合运用所学的网络知识，构建一个完整的网络环境，实现各种网络服务的配置和管理。

## 实验环境
- **操作系统**：Ubuntu 22.04 LTS
- **工具**：Docker, Nginx, MySQL
- **实验设备**：多台虚拟机或 Docker 容器

## 实验拓扑
\`\`\`
[客户端] ---> [防火墙] ---> [Web服务器]
                      |
                      +---> [数据库服务器]
\`\`\`

## 实验步骤

### 1. 网络规划
- IP 地址段：192.168.1.0/24
- 网关：192.168.1.1
- DNS：8.8.8.8

### 2. 服务部署
使用 Docker Compose 部署服务：

\`\`\`yaml
version: '3'
services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    networks:
      - webnet
  
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: root123
    networks:
      - webnet

networks:
  webnet:
    driver: bridge
\`\`\`

### 3. 配置负载均衡
使用 Nginx 作为反向代理和负载均衡器。

## 验证方法
1. 访问 Web 服务测试页面
2. 检查数据库连接
3. 测试负载均衡效果

## 实验结果
提交网络拓扑图、配置文件截图和功能测试报告。`,
  },
});

// 计算属性
const currentExperiment = computed(() => {
  return experiments[currentExperimentId.value];
});

const markdownContent = computed(() => {
  try {
    return marked.parse(currentExperiment.value.content);
  } catch (error) {
    console.error("Markdown 解析错误:", error);
    return "<p>内容加载失败</p>";
  }
});

const progress = computed(() => {
  const currentId = parseInt(currentExperimentId.value);
  if (isNaN(currentId)) return 0;
  return Math.round((currentId / Object.keys(experiments).length) * 100);
});

// 方法
const selectExperiment = (id: string) => {
  currentExperimentId.value = id;
  // 滚动到顶部
  const contentElement = document.querySelector(
    ".experiment-page__main-content"
  );
  if (contentElement) {
    contentElement.scrollTop = 0;
  }
};

const nextExperiment = () => {
  const nextId = parseInt(currentExperimentId.value) + 1;
  if (nextId <= Object.keys(experiments).length) {
    selectExperiment(nextId.toString());
  }
};

const previousExperiment = () => {
  const prevId = parseInt(currentExperimentId.value) - 1;
  if (prevId >= 1) {
    selectExperiment(prevId.toString());
  }
};

const getStepStatus = (index: number) => {
  const currentId = parseInt(currentExperimentId.value);
  if (index < currentId) return "completed";
  if (index === currentId) return "current";
  return "pending";
};

// 模拟从后端获取数据
onMounted(() => {
  console.log("从后端获取实验数据");
});
</script>

<style lang="less">
/* 全局样式 - 不使用 scoped 以便更好地控制 */
.experiment-page {
  &__header {
    color: white;
    padding: 10px 20px;
    background: linear-gradient(
      to right,
      rgba(92, 0, 0, 1),
      rgba(139, 0, 0, 1)
    );

    &-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    &-title {
      font-size: 18px;
      font-weight: bold;
    }

    &-subtitle {
      font-size: 16px;
      color: rgba(232, 201, 106, 1);
    }
  }

  &__content {
    background: #f5f5f5;
    padding: 20px;
    overflow-x: hidden;
    min-height: calc(100vh - 87px);
  }

  &__container {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    max-width: 1200px;
    margin: 0 auto;
  }

  &__sidebar {
    width: 260px;
    border-radius: 4px;

    .el-card__body {
      padding: 0;
    }

    &-title {
      background: #a81c1c;
      color: white;
      font-size: 16px;
      font-weight: bold;
      padding: 12px 15px;
      margin: 0;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }

    &-menu {
      .el-menu {
        border-right: none;
      }

      .el-menu-item {
        height: 48px;
        line-height: 48px;
        padding: 0 15px;
        border-bottom: 1px solid #f1f1f1;
        display: flex;
        align-items: center;
        gap: 10px;

        &:hover {
          background: rgba(168, 28, 28, 0.05);
        }

        &.is-active {
          background: rgba(168, 28, 28, 0.1);
          font-weight: bold;
          border-left: 3px solid #d4af37;
        }
      }
    }

    &-menu-item-step {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: bold;
      margin-right: 10px;

      &.completed {
        background: #a81c1c;
        color: white;
      }

      &.current {
        background: #d4af37;
        color: #333;
      }

      &.pending {
        border: 1px solid #ccc;
        background: white;
        color: #666;
      }
    }

    &-progress {
      padding: 20px 15px;
      border-top: 1px solid #f1f1f1;

      &-label {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #333;
      }
    }
  }

  &__main {
    flex: 1;
    border-radius: 4px;
    min-width: 0; /* 防止 flex 溢出 */

    .el-card__body {
      padding: 0;
    }

    &-header {
      background: #f9f9f9;
      padding: 12px 20px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      border-bottom: 2px solid #d4af37;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }

    &-title {
      font-size: 18px;
      font-weight: bold;
      color: #a81c1c;
    }

    &-nav {
      display: flex;
      gap: 10px;

      .el-button {
        --el-button-bg-color: #a81c1c;
        --el-button-border-color: #a81c1c;
        --el-button-hover-bg-color: #8b1c1c;
        --el-button-hover-border-color: #8b1c1c;
      }

      .el-button.is-disabled {
        --el-button-bg-color: #d9d9d9;
        --el-button-border-color: #d9d9d9;
        --el-button-text-color: #999;
      }
    }

    &-content {
      padding: 20px;
      max-height: calc(100vh - 190px);
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: #ccc;
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: #999;
      }
    }
  }

  /* Markdown 样式 - 完全自定义，不依赖外部库 */
  &__markdown {
    color: #24292e;
    font-size: 14px;
    line-height: 1.6;

    /* 标题样式 */
    h1 {
      font-size: 2em;
      font-weight: bold;
      margin: 0.67em 0;
      padding-bottom: 0.3em;
      border-bottom: 1px solid #eaecef;
      color: #a81c1c;
    }

    h2 {
      font-size: 1.5em;
      font-weight: bold;
      margin: 1em 0 0.5em;
      padding-bottom: 0.3em;
      border-bottom: 1px solid #eaecef;
      color: #a81c1c;
    }

    h3 {
      font-size: 1.25em;
      font-weight: bold;
      margin: 1em 0 0.5em;
      color: #a81c1c;
    }

    h4 {
      font-size: 1em;
      font-weight: bold;
      margin: 1em 0 0.5em;
      color: #a81c1c;
    }

    /* 段落样式 */
    p {
      margin: 1em 0;
      line-height: 1.6;
    }

    /* 列表样式 */
    ul,
    ol {
      margin: 1em 0;
      padding-left: 2em;

      li {
        margin: 0.5em 0;
        line-height: 1.6;
      }
    }

    /* 嵌套列表 */
    ul ul,
    ul ol,
    ol ul,
    ol ol {
      margin: 0.5em 0;
    }

    /* 代码样式 */
    code {
      background-color: #f6f8fa;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas,
        "Courier New", monospace;
      font-size: 85%;
      color: #e83e8c;
    }

    pre {
      background-color: #f6f8fa;
      padding: 16px;
      border-radius: 6px;
      overflow: auto;
      line-height: 1.45;

      code {
        background: none;
        padding: 0;
        color: inherit;
        font-size: 100%;
      }
    }

    /* 引用样式 */
    blockquote {
      margin: 1em 0;
      padding: 0 1em;
      border-left: 4px solid #dfe2e5;
      color: #6a737d;

      p {
        margin: 0.5em 0;
      }
    }

    /* 表格样式 */
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;

      th,
      td {
        border: 1px solid #dfe2e5;
        padding: 6px 13px;
      }

      th {
        background-color: #f6f8fa;
        font-weight: 600;
      }

      tr:nth-child(2n) {
        background-color: #f6f8fa;
      }
    }

    /* 链接样式 */
    a {
      color: #a81c1c;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    /* 强调样式 */
    strong {
      font-weight: bold;
    }

    em {
      font-style: italic;
    }

    /* 分割线 */
    hr {
      height: 0.25em;
      padding: 0;
      margin: 24px 0;
      background-color: #e1e4e8;
      border: 0;
    }

    /* 图片样式 */
    img {
      max-width: 100%;
      box-sizing: content-box;
    }
  }

  &__footer {
    color: white;
    padding: 10px 20px;
    height: 40px;
    font-size: 12px;
    background: linear-gradient(
      to right,
      rgba(92, 0, 0, 1),
      rgba(139, 0, 0, 1)
    );

    &-content {
      line-height: 20px;
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
    }
  }
}
</style>