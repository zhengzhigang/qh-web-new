<template>
    <div class="wrapper bg-white">
        <div class="header h-400px">
            <div class="w-1140px ml-auto mr-auto">
                <!-- <div class="flex pt-25px pb-25px">
                    <img class="log" style="cursor: pointer;" src="@/assets/logo.png" @click="linkPage('home')">
                    <div class="nav flex justify-center items-end ml-20px">
                        <span class="active">语义搜索</span>
                        <span @click="changeTopMenu(2)">标签搜索</span>
                        <span @click="changeTopMenu(3)">时间轴</span>
                    </div>
                </div> -->
                <Header :type="1"></Header>
                <div class="search-wrapper pl-170px pt-66px">
                    <div class="search-type flex">
                        <span :class="poemTabActive[0] == true ? 'active' : ''" @click="changePoemTab(true,false,false)">诗人</span>
                        <span :class="poemTabActive[1] == true ? 'active' : ''" @click="changePoemTab(false,true,false)">诗题</span>
                        <span :class="poemTabActive[2] == true ? 'active' : ''" @click="changePoemTab(false,false,true)">诗文</span>
                    </div>
                    <div class="search mt-10px mb-1px">

                        <el-select v-show="poemTabActive[0] == true" v-model="datas.index" placeholder="">
                            <el-option label="模糊查找" value="-1" />
                            <el-option label="第1个字" value="1" />
                            <el-option label="第2个字" value="2" />
                            <el-option label="第3个字" value="3" />
                            <el-option label="第4个字" value="4" />
                            <el-option label="最后一个字" value="99" />
                        </el-select>


                        <input type="text" v-model="datas.searchStr" :style="{ width: poemTabActive[0] ? '400px' : '602px' }" @keyup.enter="searchAction"/>
                        <!-- <el-input v-model="datas.searchStr" placeholder="" class="input-with-select">
                            <template #prepend>
                                <el-select v-model="datas.index" placeholder="" style="width: 115px">
                                <el-option label="模糊查找" value="-1" />
                                <el-option label="第1个字" value="1" />
                                <el-option label="第2个字" value="2" />
                                <el-option label="第3个字" value="3" />
                                <el-option label="第4个字" value="4" />
                                </el-select>
                            </template>
                        </el-input> -->
                        <span class="searchBtn" @click="searchAction">语义搜索</span>
                    </div>
                    <div class="search-guid flex items-center" style="display: none;">
                        搜索示例：
                        <span>杜甫跟谁相唱和</span>
                        <span>李白跟谁互赠诗词</span>
                        <span>白居易的好友都是谁</span>
                        <span>谁得罪过李白</span>
                        <span>白居易反对过谁</span>
                    </div>
                </div>
            </div>
        </div>

        <section class="content w-1140px ml-auto mr-auto pt-28px pb-28px pl-28px pr-28px">
            <template v-if="datas.singleMatch==1">
                <div class="details">
                    <div class="item">
                        <p class="text-18px">基本信息：</p>
                        <p class="text-14px leading-24px">
                            {{ getDynasty(datas.authorInfo.personInfo?.dynastyCode) }}&nbsp;
                            {{ datas.authorInfo.personInfo?.female==1?"女":"男" }}&nbsp;
                            生卒：{{datas.authorInfo.personInfo?.birthYear==0?'?':datas.authorInfo.personInfo?.birthYear}}-{{datas.authorInfo.personInfo?.deathYear==0?'?':datas.authorInfo.personInfo?.deathYear}}&nbsp;&nbsp;
                            年号：{{datas.authorInfo.personInfo?.byNianHaoDO==null?'?':datas.authorInfo.personInfo?.byNianHaoDO.nianHaoChn}}-{{datas.authorInfo.personInfo?.dyNianHaoDO==null?'?':datas.authorInfo.personInfo?.dyNianHaoDO.nianHaoChn}}&nbsp;&nbsp;
                            <span v-if="datas.authorInfo.personInfo?.altNameDOList!=undefined && datas.authorInfo.personInfo?.altNameDOList!=null && datas.authorInfo.personInfo?.altNameDOList.length >0 ">别名：</span>
                            <template v-for="(item,index) in datas.authorInfo.personInfo?.altNameDOList">
                                <span v-if="index==datas.authorInfo.personInfo?.altNameDOList.length-1">{{item.altNameChn}}</span>
                                <span v-if="index<datas.authorInfo.personInfo?.altNameDOList.length-1">{{item.altNameChn}}、</span>
                            </template>

                        </p>
                        <p class="text-14px leading-24px">
                            <template v-for="(item,index) in datas.authorInfo.personInfo?.personAddrList">
                                {{ computedAddrType(item.addrType) }}：{{item.addrName}}&nbsp;
                            </template>
                        </p>

                        <p class="text-14px leading-24px">
                            <span v-if="datas.authorInfo.personInfo?.kinList!=undefined && datas.authorInfo.personInfo?.kinList!=null && datas.authorInfo.personInfo?.kinList.length >0 ">亲属：</span>
                            <template v-for="(item,index) in datas.authorInfo.personInfo?.kinList">
                                <span v-if="index==datas.authorInfo.personInfo?.kinList.length-1">{{item.kinPerson.name}}({{ item.kinRelChn }})</span>
                                <span v-if="index<datas.authorInfo.personInfo?.kinList.length-1">{{item.kinPerson.name}}({{ item.kinRelChn }})、</span>
                            </template>
                        </p>
                        <p class="text-14px leading-24px" v-if="datas.authorInfo.personInfo?.personStatusList!=undefined && datas.authorInfo.personInfo?.personStatusList!=null && datas.authorInfo.personInfo?.personStatusList.length >0 ">
                            <span>标签：</span>
                            <template v-for="(item,index) in datas.authorInfo.personInfo?.personStatusList">
                                <span @click="onClickTag(item.statusCode)" style="cursor: pointer;">#{{item.statusDescChn}}&nbsp;&nbsp;</span>
                            </template>
                        </p>
                    </div>
                    <div class="item" v-if="false">
                        <p class="text-18px">介绍:</p>
                        <p class="text-14px leading-24px">唐隴西成紀人，其先人隋末流寓西域，故生于安西都護府所屬碎葉城。中宗神龍初，遷居蜀之綿州昌隆縣青蓮鄉，又嘗寓居山東，故亦稱山東人。字太白，號青蓮居士。少有逸才，志氣宏放，飄然有超世之心。十歲通詩書，被稱為“天才英特”。喜縱橫術，擊劍任俠，輕財重施。青年時離蜀漫游，玄宗天寶初，入長安，經賀知章、吳筠推薦，詔供奉翰林。但政治上不受重視，又受權貴讒毀，僅一年余即離開長安。天寶三載在洛陽結識杜甫。二人于詩壇齊名，并稱“李杜”。安史亂起，白為永王李璘府僚，參與平亂。因永王兵敗，坐流夜郎，中途遇赦東還，依族人當涂令李陽冰。不久病卒。其詩風雄奇豪放、清新飄逸，代表作有《蜀道難》、《行路難》、《夢游天姥吟留別》等。有《李太白集》。</p>
                    </div>
                    <div class="item">
                        <!-- <p>人脉图谱:</p>
                        <img src="@/assets/demo.png" > -->
                        <canvasPage :personId="datas.personId"/>
                    </div>
                    <div class="item" v-if="datas.authorId!='0'">
                        
                        <p class="text-18px">作品  :&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-button @click="exportByAuthorIdAction(datas.authorId)">导出</el-button></p>
                        <template v-for="(item,index) in datas.postListPage.list">
                            <div class="production">
                                <span class="title">{{item.title}}</span>
                                <p>{{item.content}}</p>
                            </div>
                        </template>
                    </div>
                </div>
            </template>
            <template v-else>
                <ul>
                    <template v-if="postListPageFlag">
                        <li v-for="item in datas.postListPage.list" :key="item.authorId" v-html="item.name"></li>
                    </template>
                    <template v-else-if="poemTabActive[0]">
                        <li v-for="item in datas.esPage.records"><a href="javascript:void(0)" @click="linkToAuthor(item.personId)" v-html="item.name"></a></li>
                    </template>
                    <template v-else>
                        <li v-for="item in datas.esPage.records">
                            <div class="production">
                                <span class="title" v-html="item.title"></span>
                                <p v-html="item.content"></p>
                            </div>
                        </li>
                    </template>
                </ul>
            </template>
            <el-pagination
            v-if="datas.authorId!='0'"
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 50]"
            :small="false"
            :disabled="false"
            :background="true"
            layout="total, sizes,prev, pager, next,jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
    />
            <!-- <Pagination :pageSize="20" :total="datas.esAuthorEsPage.total"></Pagination> -->
        </section>

        <div class="footer">
            <div class="w-1140px ml-auto mr-auto flex justify-center flex-col items-center">
                <p class="footerNav">
                    <span>关于</span>
                    <span>隐私</span>
                    <span>联系</span>
                    <span>导览</span>
                    <span>访问量</span>
                </p>
                <p>© 2023 中国数字人文 皖ICP备19020276号-4</p>
                <p>本网站为学术公益性网站，若有侵权，请联系删除。</p>
                <p>知识共享许可协议本网站采用知识共享署名-非商业性使用-禁止演绎 4.0 国际许可协议进行许可。</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// import Pagination from '@/components/Pagination.vue'
import Header from '@/components/header.vue';
import canvasPage from './canvas.vue'
import { computed, reactive, ref,onMounted } from 'vue'
import {useRouter} from 'vue-router';
import { ElMessage } from 'element-plus'
import { searchAuthor,searchPoetAuthorId,listPostPage,searchPostTitle,searchPostContent,findAuthorIdByPersonId } from '@/api/common'
import JSONBig from 'json-bigint';
const { currentRoute } = useRouter();
const router = useRouter();
const route = currentRoute.value;

const changeTopMenu = (type: number) => {
    if(type==1) router.push({path: "home"});
    if(type==2) router.push({path: "tag"});
    if(type==3) router.push({path: "timeScroll"});
}

const poemTabActive = ref([true, false, false])
const changePoemTab = async (active1: boolean,active2:boolean,active3:boolean) => {
    datas.searchStr = ""
    poemTabActive.value = [active1, active2, active3]
}
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
  if(poemTabActive.value[0]){
        if(postListPageFlag.value == true){
            listPostPageAction(datas.authorInfo.authorId,1,val)
        }else{
            searchAuthorAction(1,val)
        }
    }
    if(poemTabActive.value[1]){
        searchPostTitleAction(1,val)
    }
    if(poemTabActive.value[2]){
        searchPostContentAction(1,val)
    }
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  if(poemTabActive.value[0]){
        if(postListPageFlag.value == true){
            listPostPageAction(datas.authorInfo.authorId,val,pageSize.value)
        }else{
            searchAuthorAction(val)
        }
    }
    if(poemTabActive.value[1]){
        searchPostTitleAction(val)
    }
    if(poemTabActive.value[2]){
        searchPostContentAction(val)
    }
}
const postListPageFlag = ref(true)
const datas = reactive({
    cbdbPersonId: null,
    searchStr: "",
    //首页是否显示一个作者的信息
    authorId: "0",
    personId: "0",
    singleMatch: 1,
    esPage:{} as any,
    authorInfo: {} as any,
    personInfo: {} as any,
    postListPage: [] as any,
    index: "-1",
})
onMounted(async ()=>{
    if(!route.query.authorId){
        //如果没有传authorId，如果没有传personId就默认是李白，如果传了personid就用传的personid,authorid就没有了
        if(!route.query.personId){
            datas.personId = JSONBig.parse("32540")
            datas.authorId = JSONBig.parse("1656658312757964828")
        } else{
            datas.personId = JSONBig.parse(route.query.personId)
            await findAuthorIdByPersonId({"personId":datas.personId}).then(res=>{
                datas.authorId = res.data.toString()
            })
        }
     } else {
        datas.authorId = JSONBig.parse(route.query.authorId)
        datas.personId = JSONBig.parse(route.query.personId)
     }

     searchPoetAuthorId({"authorId":datas.authorId.toString(),"personId":datas.personId.toString(),"pageSize":pageSize.value,"pageNo":currentPage.value}).then(res=>{
        if (res.data.singleMatch == 1) {
            datas.singleMatch = 1
            datas.authorInfo = res.data.authorInfo
            datas.searchStr = res.data.authorInfo.name
            listPostPageAction(datas.authorInfo.authorId)
        } else {
            postListPageFlag.value = false;
            datas.singleMatch = 0
            datas.esPage = res.data.esAuthorEsPage
            total.value= res.data.esAuthorEsPage.total
            currentPage.value = res.data.esAuthorEsPage.current
            pageSize.value = res.data.esAuthorEsPage.pageSize
        }
    })

})
const listPostPageAction = async (authorId:any,currentPage:number=1,pageSize:number=10) =>{
    listPostPage({"authorId":authorId.toString(),"pageSize":pageSize,"pageNo":currentPage}).then(res=>{
        postListPageFlag.value = true;
        datas.postListPage = res.data
        total.value = res.data.total
    })
}
const searchAction = async () => {
    if (datas.searchStr == "") {
        return
    }
    if(poemTabActive.value[0]){
        searchAuthorAction()
    }
    if(poemTabActive.value[1]){
        searchPostTitleAction()
    }
    if(poemTabActive.value[2]){
        searchPostContentAction()
    }
}
const searchAuthorAction = async (pageNo:number=1,pageSizeParam:number=20) =>{
     searchAuthor({"authorName":datas.searchStr,"index":datas.index,"pageSize":pageSizeParam,"pageNo":pageNo}).then(res=>{
        console.log(res.data)
        if (res.data.singleMatch == 1) {
            datas.singleMatch = 1
            datas.authorInfo = res.data.authorInfo
            datas.personId = res.data.authorInfo.personId
            listPostPageAction(datas.authorInfo.authorId,1,10)
        } else if (res.data.singleMatch == 0) {
            postListPageFlag.value = false;
            datas.singleMatch = 0
            datas.esPage = res.data.esAuthorEsPage
            total.value= res.data.esAuthorEsPage.total
            currentPage.value = res.data.esAuthorEsPage.current
            pageSize.value = res.data.esAuthorEsPage.pageSize
        } else if (res.data.singleMatch == -1) {
            ElMessage.error('没有找到匹配的人.')
        }
    })
}
const searchPostTitleAction = async (pageNo:number=1,pageSizeParam:number=20) =>{
    searchPostTitle({"postTitle":datas.searchStr,"pageSize":pageSizeParam,"pageNo":pageNo}).then(res=>{
        console.log(res.data)
        postListPageFlag.value = false;
        datas.esPage = res.data
        datas.singleMatch = 0
        total.value= res.data.total
        currentPage.value = res.data.current
        pageSize.value = res.data.pageSize
    })
}
const searchPostContentAction = async (pageNo:number=1,pageSizeParam:number=20) =>{
    searchPostContent({"postContent":datas.searchStr,"pageSize":pageSizeParam,"pageNo":pageNo}).then(res=>{
        console.log(res.data)
        postListPageFlag.value = false;
        datas.esPage = res.data
        datas.singleMatch = 0
        total.value= res.data.total
        currentPage.value = res.data.current
        pageSize.value = res.data.pageSize
    })
}

const exportByAuthorIdAction =   (authorId:any) =>{
      console.log('exportByAuthorIdAction:', authorId);
      //id text
    //   const to = router.resolve({
    //     name: "post/exportByAuthorId", //这里是跳转页面的name，要与路由设置保持一致
    //     query: {authorId:authorId },
    //   });
    const exportUrl = `${import.meta.env.VITE_URL}/post/exportByAuthorId?authorId=${authorId}`;
    window.open(exportUrl, "_blank");
    return true
}
// searchAuthorAction()
const onClickTag=(statusCode:any) =>{
    const to = router.resolve({
        name: "listStatusAuthorPageByStatusCode", //这里是跳转页面的name，要与路由设置保持一致
        query: { statusCode: statusCode},
      });
    window.open(to.href, "_blank");
    // window.open(router.resolve('/tag/listStatusAuthorPageByStatusCode?tagId=' + tag.statusCode).href, '_blank')
}
const linkToAuthor = (personId:any) =>{

    const to = router.resolve({
        name: "home", //这里是跳转页面的name，要与路由设置保持一致
        query: { personId:personId },
      });
    window.open(to.href, "_blank");

    // let routeData = router.resolve({ path: '/', query: {  personId: personId} });
    // window.open(routeData.href, '_blank');
}
const linkPage = (routePage:any) =>{
    const to = router.resolve({
        name: routePage,
    });
    window.open(to.href, "_blank");
}
const getDynasty = (v :any) =>{
        if (v == 6) {
            return '唐'
        } else if (v == 7) {
            return '五代'
        } else if (v == 8) {
            return '後蜀'
        } else if (v == 9) {
            return '吳'
        }else if (v == 10) {
            return '南唐'
        }else if (v == 11) {
            return '吳越'
        }else if (v == 12) {
            return '閩國'
        }else if (v == 13) {
            return '南漢'
        }else if (v == 14) {
            return '高麗'
        }else if (v == 15) {
            return '宋'
        }else if (v == 16) {
            return '遼'
        }
}

const computedAddrType = computed(() => {
    return (v: any) => {
        if (v == 1) {
            return '籍贯'
        } else if (v == 5) {
            return '祖籍'
        } else if (v == 8) {
            return '出生地'
        } else if (v == 9) {
            return '死所'
        }else if (v == 10) {
            return '葬地'
        }
    }
})

</script>
<style lang="less">
.elasticMatch{
    color: #F85650;
    font-size: 18px;
    font-style: normal;}
</style>
<style lang="less" scoped>
.el-pagination{
    margin-top: 20px;
    text-align: center;
}
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #2C3D50 !important; //修改默认的背景色
}
:deep(.el-select .el-input__wrapper ) {
    height:50px
}
.wrapper {
    background: #FAFBFC;
    .header {
        background: url("@/assets/bj.png") no-repeat center;
    }
    .nav {
        span {
            margin: 0 20px;
            color: #333;
            font-size: 18px;
            cursor: pointer;
            &.active {
                color: #F85650;
            }
        }
    }
    .search-wrapper {
        .search-type {
            span {
                padding: 8px 24px;
                font-size: 14px;
                color: #6F4D3A;
                border-radius: 4px;
                cursor: pointer;
                &.active {
                    position: relative;
                    background: #F85659;
                    color: #fff;
                    &::after {
                        content: '';
                        left: 50%;
                        transform: translateX(-50%);
                        bottom: -11px;
                        position: absolute;
                        width: 0;
                        height: 0;
                        border: 6px solid transparent;
                        border-top: 6px solid #F85659;
                    }
                }
            }
        }
        .search {
            width: 800px;
            height: 48px;
            overflow: hidden;
            border-radius: 100px;
            ::v-deep .el-input__inner {
                text-align: center;
            }
            ::v-deep .el-input.is-focus .el-input__wrapper {
                box-shadow: 0 0 0 1px transparent inset!important;
            }
            ::v-deep .el-select .el-input__wrapper.is-focus {
                box-shadow: 0 0 0 1px transparent inset!important;
            }
            >input {
                width: 400px;
                height: 100%;
                outline: none;
                text-indent: 30px;
                font-size: 14px;
            }
            .searchBtn {
                display: inline-block;
                background: #F85659;
                width: 120px;
                height: 100%;
                line-height: 48px;
                text-align: center;
                color: #fff;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
               }
            }
        .search-guid {
            padding-left: 60px;
            font-size: 14px;
            color: #333;
            span {
                margin-left: 20px;
                color: #6F4D3A;
            }
        }
    }
    .content {
        border-radius: 8px;
        transform: translateY(-80px);
        background: #fff;
        .details {
            .item {
                margin-bottom: 40px;
                >p {
                    color: #2C3D50;
                    &:first-of-type {
                        margin-bottom: 20px;
                        font-weight: 500;
                    }
                }

            }
        }
    }
    .production {
                    margin-bottom: 40px;
                    .title {
                        display: inline-block;
                        margin-bottom: 10px;
                        font-size: 16px;
                        color: #2C3D50;
                        font-weight: 500;
                    }
                    >p {
                        font-size: 14px;
                        color: #2C3D50;
                    }
                }
    .footer {
        padding: 40px 0 20px 0;
        background: linear-gradient(226deg, #C4B894 0%, #EDE4D3 100%);
        .footerNav {
            margin-bottom: 20px;
            >span {
                font-weight: 500;
                color: #6F4D3A;
                font-size: 14px;
            }
        }
        p {
            margin-bottom: 6px;
            font-size: 12px;
            color: #6F4D3A;
        }
    }
}
</style>
