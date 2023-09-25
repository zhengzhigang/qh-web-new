<template>
    <div class="wrapper bg-white">
        <div class="header h-220px">
            <div class="w-1140px ml-auto mr-auto">
                <Header :type="1"></Header>
            </div>
        </div>

        <section class="content w-1140px ml-auto mr-auto pt-28px pb-0px pl-28px pr-28px">
                <div class="details">
                    <div class="item">
                        <el-tag
                        :key="datas.tag.statusCode"
                         class="mx-1"
                         effect="dark"
                         type="warning"
                         round
                           >
                                {{ datas.tag.statusDescChn }}({{ datas.tag.num }})
                           </el-tag>
                    </div>
                </div>
        </section>
        <section class="content w-1140px ml-auto mr-auto pt-0px pb-28px pl-28px pr-28px">
                <div class="details">
                    <div class="item">
                        <el-tag v-for="item in datas.personsPage.list"
                        :key="item.statusCode"
                         class="mx-1"
                         style="cursor: pointer;"
                         effect="light"
                         type="info"
                         @click="onClickPerson(item)"
                         round
                           >
                                {{ item.personName }}
                           </el-tag>
                    </div>
                </div>
                <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 30, 50,100]"
            :small="false"
            :disabled="false"
            :background="true"
            layout="total, sizes,prev, pager, next,jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
    />
        </section>

        <Footer></Footer>
    </div>
</template>

<script lang="ts" setup>
import Header from '@/components/header.vue';
import Footer from '@/components/footer.vue';
import { computed, reactive, ref,onMounted } from 'vue'
import {useRouter} from 'vue-router';
import { findTag,listStatusAuthorPage } from '@/api/common'
import JSONBig from 'json-bigint';
const { currentRoute } = useRouter();
const router = useRouter();
const route = currentRoute.value;
const datas = reactive({
    tag: {} as any,
    personsPage: [] as any,
})
const currentPage = ref(1)
const pageSize = ref(100)
const total = ref(0)
onMounted(()=>{
    let statusCode = route.query.statusCode || ''
    findTag({statusCode: statusCode}).then(res=>{
        console.log(res);
        datas.tag = res.data;
        listTagAuthorPageAction(datas.tag.statusCode)
    })
})
const listTagAuthorPageAction = async (statusCode:any,currentPage:number=1,pageSize:number=100) =>{
    listStatusAuthorPage({"statusCode":statusCode,"pageSize":pageSize,"pageNo":currentPage}).then(res=>{
        datas.personsPage = res.data
        total.value = res.data.total
        console.log(datas.personsPage);
        console.log("总数量:" ,total.value);
    })
}
const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`)
  listTagAuthorPageAction(datas.tag.statusCode,1,val)
}
const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`)
  listTagAuthorPageAction(datas.tag.statusCode,val,pageSize.value)
}
const onClickPerson = (item:any) => {
    const to = router.resolve({
        name: "home", //这里是跳转页面的name，要与路由设置保持一致
        query: { authorId: item.authorSourceDO?.authorId,personId:item.personId },
      });
    window.open(to.href, "_blank");
}

</script>
<style lang="less" scoped>
:deep(.el-tag.el-tag--info ) {
    --el-tag-bg-color: #f5f5f5;
    --el-tag-text-color:#2C3D50;
}
:deep(.el-tag){
    padding: 13px 17px;
    font-size: 14px;
    height: 34px;
    margin-bottom: 15px;
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
