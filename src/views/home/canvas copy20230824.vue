<template>
    <div>
    <div style="height:110px;padding-top:6px;padding-left: 30px;padding-right:30px;border-bottom: #efefef solid 1px;color: #555555;font-size: 12px;">
      <div style="">
        <div style="line-height: 20px;">方向筛选：</div>
        <el-radio-group v-model="datas.checked_role_type" size="mini" @change="doFilterRoleType">
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
      <div>

        <!-- <el-checkbox-group v-model="datas.rel_checkList" @change="doFilter">
          <el-checkbox v-for="thisItem in datas.all_rel_type" :key="thisItem.assocCode" :label="thisItem.assocDescChn" />
        </el-checkbox-group> -->
      </div>
    </div>
        <div style="border: #efefef solid 1px; height: calc(100vh - 400px);width: 100%;">
            <relation-graph ref="relationGraph$" :options="options" :on-node-click="onNodeClick">
                <template #node="{node}">
                    <div>
                    <div
                        style="height:80px;line-height: 80px;border-radius: 50%;cursor: pointer;"
                        @click="showNodeMenus(node, $event)"
                        @contextmenu.prevent.stop="showNodeMenus(node, $event)"
                    >
                        <i style="font-size: 30px;" :class="node.data.myicon" />
                    </div>
                    <div style="color: forestgreen;font-size: 16px;position: absolute;width: 160px;height:25px;line-height: 25px;margin-top:5px;margin-left:-48px;text-align: center;background-color: rgba(66,187,66,0.2);">
                        {{ node.data.myicon }}
                    </div>
                </div>
               </template>

            </relation-graph>
        </div>
        <div v-show="datas.isShowNodeMenuPanel" :style="{left: datas.nodeMenuPanelPosition.x + 'px', top: datas.nodeMenuPanelPosition.y + 'px' }" style="z-index: 999;padding:10px;background-color: #ffffff;border:#eeeeee solid 1px;box-shadow: 0px 0px 8px #cccccc;position: absolute;">
        <div style="line-height: 25px;padding-left: 10px;color: #888888;font-size: 12px;">对这个节点进行操作：</div>
        <div class="c-node-menu-item" @click.stop="doAction('操作1')">操作1</div>
        <div class="c-node-menu-item" @click.stop="doAction('操作1')">操作2</div>
        <div class="c-node-menu-item" @click.stop="doAction('操作1')">操作3</div>
        <div class="c-node-menu-item" @click.stop="doAction('操作1')">操作4</div>
    </div>
    </div>
  </template>

  <script setup lang="ts">
  import { onMounted, reactive, ref,watch} from 'vue'
  import { ElMessage } from 'element-plus'
  import RelationGraph, {RGJsonData} from 'relation-graph/vue3'
  import { listPersonAssocCode,listPersonByRelation} from '@/api/common'
  const relationGraph$ = ref<RelationGraph>()
  const graphJsonData = ref<RGJsonData>({
    rootId:'',
    nodes:[],
    lines:[]
  })
  const datas = reactive({
    checked_role_type: 'A',
    rel_checkList: [],
    all_rel_type:[],
    isShowCodePanel: false,
    isShowNodeMenuPanel: false,
    nodeMenuPanelPosition: { x: 0, y: 0 },
  })
  const props = defineProps({
        personId:String,
    })
  const options = {
        debug: false,
        defaultNodeBorderWidth: 0,
        defaultNodeColor: 'rgba(238, 178, 94, 1)',
        allowSwitchLineShape: true,
        allowSwitchJunctionPoint: true,
        defaultLineShape: 1,
        'layouts': [
          {
            'label': '自动布局',
            'layoutName': 'force',
            'layoutClassName': 'seeks-layout-force'
          }
        ],
        defaultJunctionPoint: 'border'
  }
 watch(() => props.personId, (newVal, oldVal) => {
    console.log('newVal:', newVal);
    console.log('oldVal:', oldVal);
    if(newVal != oldVal){
        listPersonAssocCode({"personId":props.personId,"roleType":datas.checked_role_type}).then(res=>{
            console.log(res);
            datas.all_rel_type = res.data
            let selectRel = 0;//只取头5个
            let selectNum = 0;//只取200个
            for(let i=0;i<datas.all_rel_type.length;i++){
                if(selectRel >=5 || selectNum > 200) {
                    break;
                }
                if(datas.all_rel_type[i].num < 100 || datas.all_rel_type[i].num ==0){
                    datas.rel_checkList.push(datas.all_rel_type[i].assocCode)
                    selectRel++
                    selectNum = selectNum + datas.all_rel_type[i].num
                }
            }
            if(datas.rel_checkList.length==0){
                ElMessage.error('当前关系类型下没有关系图谱.')
                return
            }
            listPersonByRelation({"personId":props.personId,"assocCodes":datas.rel_checkList}).then(res=>{
                console.log(res);
                graphJsonData.value.rootId = props.personId
                if(res.data == null || res.data.customNodes == null ||res.data.customNodes.length==0){
                    ElMessage.error('当前关系类型下没有关系图谱.')
                    return
                }
                graphJsonData.value.nodes = res.data.customNodes
                graphJsonData.value.lines = res.data.personLinks
                relationGraph$.value.setJsonData(graphJsonData.value, () => {
                    console.log('relationGraph ready!');
                })
            })
        })
    }
  })

  const doFilterRoleType = () => {
    listPersonAssocCode({"personId":props.personId,"roleType":datas.checked_role_type}).then(res=>{
            datas.rel_checkList = [] as any
            datas.all_rel_type = res.data
        })
  }
  const doFilterNode = () => {
    console.log(datas.rel_checkList);
    listPersonByRelation({"personId":props.personId,"assocCodes":datas.rel_checkList,"initPage":0}).then(res=>{
            console.log(res);
            if(res.data == null || res.data.customNodes == null ||res.data.customNodes.length==0){
                ElMessage.error('当前关系类型下没有数据.')
            }
            graphJsonData.value.rootId = props.personId
            graphJsonData.value.nodes = res.data.customNodes
            graphJsonData.value.lines = res.data.personLinks
            relationGraph$.value.setJsonData(graphJsonData.value, () => {
                console.log('relationGraph ready!');
            })
            relationGraph$.value.updateView()
        })
  }
 const showNodeMenus=(nodeObject, $event) {
      this.currentNode = nodeObject;
      const _base_position = this.$refs.myPage.getBoundingClientRect();
      console.log('showNodeMenus:', $event, _base_position);
      this.isShowNodeMenuPanel = true;
      this.nodeMenuPanelPosition.x = $event.clientX - _base_position.x;
      this.nodeMenuPanelPosition.y = $event.clientY - _base_position.y;
  }
//   const onNodeClick=(nodeObject, $event) =>{
//       console.log('onNodeClick:', nodeObject);
//     }
//   const onLineClick=(lineObject, linkObject, $event) boolean =>{
//       console.log('onLineClick:', lineObject);
//     }
  </script>
  <style lang="less">
  .c-mb-button svg{
    display: inline !important;
    vertical-align:baseline;
  }
  </style>