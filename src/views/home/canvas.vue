<template>
  <div v-if="datas.hasRelationData">
    <div
      style="
        height: 110px;
        padding-top: 6px;
        border-bottom: #efefef solid 1px;
        color: #555555;
        font-size: 12px;
      "
    >
      <div style="">
        <div style="line-height: 20px">方向筛选：</div>
        <el-radio-group
          v-model="datas.checked_role_type"
          size="mini"
          @change="doFilterRoleType"
        >
          <el-radio-button label="A">主动方向</el-radio-button>
          <el-radio-button label="P">被动方向</el-radio-button>
        </el-radio-group>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-select
          v-model="datas.rel_checkList"
          multiple
          collapse-tags
          default-first-option
          :reserve-keyword="false"
          placeholder="选择关系"
          style="width: 320px"
          size="mini"
        >
          <el-option
            v-for="item in datas.all_rel_type"
            :key="item.assocCode"
            :label="`${item.assocDescChn}(${item.num})`"
            :value="item.assocCode"
          />
        </el-select>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <el-button @click="doFilterNode">查询</el-button>
      </div>
    </div>
    <div
      class="myPage"
      @click="datas.isShowNodeMenuPanel = false"
      style="
        border: #efefef solid 1px;
        height: calc(100vh - 400px);
        width: 100%;
      "
    >
      <relation-graph
        ref="relationGraph$"
        :options="options"
        :on-node-click="onNodeClick"
      >
        <template #node="{ node }">
          <div
            style="
              height: 10px;
              line-height: 50px;
              border-radius: 50%;
              cursor: pointer;
            "
            @contextmenu.prevent.stop="showNodeMenus(node, $event)"
          >
            <i style="font-size: 12px">{{ node["text"] }}</i>
          </div>
        </template>
      </relation-graph>
    </div>
  </div>
</template>

  <script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import RelationGraph, { RGJsonData } from "relation-graph/vue3";
import { listPersonAssocCode, listPersonByRelation } from "@/api/common";
const { currentRoute } = useRouter();
const router = useRouter();
const route = currentRoute.value;
const relationGraph$ = ref<RelationGraph>();
const graphJsonData = ref<RGJsonData>({
  rootId: "",
  nodes: [],
  lines: [],
});
const datas = reactive({
  checked_role_type: "A",
  rel_checkList: [],
  all_rel_type: [],
  isShowCodePanel: false,
  isShowNodeMenuPanel: false,
  nodeMenuPanelPosition: { x: 0, y: 0 },
  currentNode: null,
  hasRelationData: false,
});
const props = defineProps({
  personId: String,
});
const options = {
  debug: false,
  defaultNodeBorderWidth: 0,
  defaultNodeColor: "rgba(238, 178, 94, 1)",
  allowSwitchLineShape: true,
  allowSwitchJunctionPoint: true,
  defaultLineShape: 1,
  layouts: [
    {
      label: "自动布局",
      layoutName: "force",
      layoutClassName: "seeks-layout-force",
    },
  ],
  defaultJunctionPoint: "border",
};
watch(
  () => props.personId,
  (newVal, oldVal) => {
    console.log("newVal:", newVal);
    console.log("oldVal:", oldVal);
    if (newVal != oldVal) {
      listPersonAssocCode({
        personId: props.personId,
        roleType: datas.checked_role_type,
      }).then((res) => {
        console.log(res);
        datas.all_rel_type = res.data;

        let selectNum = 0; //只取200个
        if (datas.all_rel_type.length == 1) {
          datas.rel_checkList.push(datas.all_rel_type[0].assocCode);
          selectNum = selectNum + datas.all_rel_type[0].num;
        } else {
          for (let i = 0; i < datas.all_rel_type.length; i++) {
            if (selectNum >= 100) {
              break;
            }
            if (
              datas.all_rel_type[i].num <= 100 &&
              datas.all_rel_type[i].num > 0
            ) {
              datas.rel_checkList.push(datas.all_rel_type[i].assocCode);
              selectNum = selectNum + datas.all_rel_type[i].num;
            }
          }
        }

        if (datas.rel_checkList.length == 0) {
          // ElMessage.error('当前关系类型下没有关系图谱.')
          datas.hasRelationData = false;
          return;
        } else {
          datas.hasRelationData = true;
          listPersonByRelation({
            personId: props.personId,
            assocCodes: datas.rel_checkList,
          }).then((res) => {
            console.log(res);
            graphJsonData.value.rootId = props.personId;
            if (
              res.data == null ||
              res.data.customNodes == null ||
              res.data.customNodes.length == 0
            ) {
              // ElMessage.error('当前关系类型下没有关系图谱.')
              return;
            }
            graphJsonData.value.nodes = res.data.customNodes;
            graphJsonData.value.lines = res.data.personLinks;
            relationGraph$.value.setJsonData(graphJsonData.value, () => {
              console.log("relationGraph ready!");
            });
          });
        }
      });
    }
  }
);

const doFilterRoleType = () => {
  listPersonAssocCode({
    personId: props.personId,
    roleType: datas.checked_role_type,
  }).then((res) => {
    datas.rel_checkList = [] as any;
    datas.all_rel_type = res.data;
  });
};
const doFilterNode = () => {
  console.log(datas.rel_checkList);
  listPersonByRelation({
    personId: props.personId,
    assocCodes: datas.rel_checkList,
    initPage: 0,
  }).then((res) => {
    console.log(res);
    if (
      res.data == null ||
      res.data.customNodes == null ||
      res.data.customNodes.length == 0
    ) {
      ElMessage.error("当前关系类型下没有数据.");
    }
    graphJsonData.value.rootId = props.personId;
    graphJsonData.value.nodes = res.data.customNodes;
    graphJsonData.value.lines = res.data.personLinks;
    relationGraph$.value.setJsonData(graphJsonData.value, () => {
      console.log("relationGraph ready!");
    });
    relationGraph$.value.updateView();
  });
};
const showNodeMenus = (nodeObject, $event) => {
  datas.currentNode = nodeObject;
  let _base_position = document
    .getElementsByClassName("myPage")[0]
    .getBoundingClientRect();
  console.log("showNodeMenus:", $event, _base_position);
  datas.isShowNodeMenuPanel = true;
  datas.nodeMenuPanelPosition.x = $event.clientX - _base_position.x;
  datas.nodeMenuPanelPosition.y = $event.clientY - _base_position.y + 100;
};
const onNodeClick = (nodeObject, $event) => {
  console.log("onNodeClick:", nodeObject);
  const to = router.resolve({
    name: "home", //这里是跳转页面的name，要与路由设置保持一致
    query: { personId: nodeObject.id },
  });
  window.open(to.href, "_blank");
  return true;
};
</script>
  <style lang="less">
.c-mb-button svg {
  display: inline !important;
  vertical-align: baseline;
}
.c-node-menu-item {
  line-height: 30px;
  padding-left: 10px;
  cursor: pointer;
  color: #444444;
  font-size: 14px;
  border-top: #efefef solid 1px;
}
.c-node-menu-item:hover {
  background-color: rgba(66, 187, 66, 0.2);
}
</style>