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
            :label="item.assocDescChn"
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
        <div style="border: #efefef solid 1px; height: calc(100vh - 100px);width: 100%;">
            <relation-graph ref="relationGraph$" :options="options">
            </relation-graph>
        </div>
    </div>
  </template>

  <script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue'
  import RelationGraph, {RGJsonData} from 'relation-graph/vue3'
  import { listAssocCode,listPersonByRelation} from '@/api/common'
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
  onMounted(() => {
    // const graphJsonData:RGJsonData = {
    //   rootId: 'N3',
    //   nodes: [
    //     { id: 'N4', text: '十4' },
    //     { id: 'N5', text: '十5' },
    //     { id: 'N6', text: '十6' },
    //     { id: 'N7', text: '十7' },
    //     { id: 'N3', text: '十三' },
    //     { id: 'N9', text: '152****3393' },
    //   ],
    //   lines: [
    //     { from: 'N3', to: 'N9', text: '分享' },
    //     { from: 'N3', to: 'N4', text: '分享444' },
    //     { from: 'N3', to: 'N5', text: '分享555' },
    //     { from: 'N3', to: 'N6', text: '分享666' },
    //     { from: 'N3', to: 'N7', text: '分享777' },
    //     { from: 'N9', to: 'N4', text: '分享x' }
    //   ],
    // };
    listPersonByRelation({"personId":props.personId,"assocCodes":[-1]}).then(res=>{
            console.log(res);
            graphJsonData.value.rootId = props.personId
            graphJsonData.value.nodes = res.data.customNodes
            graphJsonData.value.lines = res.data.personLinks
            relationGraph$.value.setJsonData(graphJsonData.value, () => {
                console.log('relationGraph ready!');
            })
        })
    listAssocCode({"roleType":datas.checked_role_type}).then(res=>{
            console.log(res);
            datas.all_rel_type = res.data
        })
  })
  const doFilterRoleType = () => {
    listAssocCode({"roleType":datas.checked_role_type}).then(res=>{
            datas.rel_checkList = [] as any
            datas.all_rel_type = res.data
        })
  }
  const doFilterNode = () => {
    console.log(datas.rel_checkList);
    listPersonByRelation({"personId":props.personId,"assocCodes":datas.rel_checkList}).then(res=>{
            console.log(res);
            debugger
            graphJsonData.value.rootId = props.personId
            graphJsonData.value.nodes = res.data.customNodes
            graphJsonData.value.lines = res.data.personLinks
            relationGraph$.value.setJsonData(graphJsonData.value, () => {
                console.log('relationGraph ready!');
            })
            relationGraph$.value.updateView()
        })
  }
//   const onNodeClick=(nodeObject, $event) =>{
//       console.log('onNodeClick:', nodeObject);
//     }
//   const onLineClick=(lineObject, linkObject, $event) boolean =>{
//       console.log('onLineClick:', lineObject);
//     }
  </script>