<template>
    <div class="wrapper bg-white">
        <div class="header h-220px">
            <div class="w-1140px ml-auto mr-auto">
                <div class="flex pt-25px pb-25px">
                    <img class="log" src="@/assets/logo.png">
                    <div class="nav flex justify-center items-end ml-20px">
                        <span @click="changeTopMenu(1)">语义搜索</span>
                        <span class="active">标签搜索</span>
                        <span @click="changeTopMenu(3)">时间轴</span>
                    </div>
                </div>
            </div>
        </div>

        <section class="content w-1140px ml-auto mr-auto pt-28px pb-28px pl-28px pr-28px">
                <div class="details">
                    <div class="item" >
                        <el-tag v-for="item in datas.tags"
                        :key="item.statusCode"
                        style="cursor: pointer;"
                         class="mx-1"
                         :effect="item.effect"
                         :type="item.type"
                         @click="onClickTag(item)"
                         round
                           >
                                {{ item.statusDescChn }}({{ item.num }})
                           </el-tag>
                    </div>
                </div>
        </section>

        <div class="footer">
            <div class="w-1140px ml-auto mr-auto flex justify-center flex-col items-center">
                <p>© 2023 中国数字人文 皖ICP备19020276号-4</p>
                <p>本网站为学术公益性网站，若有侵权，请联系删除。</p>
                <p>知识共享许可协议本网站采用知识共享署名-非商业性使用-禁止演绎 4.0 国际许可协议进行许可。</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref,onMounted } from 'vue'
import {useRouter} from 'vue-router';
import { listTag } from '@/api/common'
import JSONBig from 'json-bigint';
const { currentRoute } = useRouter();
const router = useRouter();
const route = currentRoute.value;
const datas = reactive({
    tags: [],
})

onMounted(()=>{
    listTag({}).then(res=>{
        console.log(res);
        datas.tags = res.data;
        datas.tags.forEach((item:any)=>{
            item.effect = "light";
            item.type = "info";
            // if(item.statusCode == 114) {
            //     item.effect = "dark";
            //     item.type = "warning";
            // } else {
            //     item.effect = "light";
            //     item.type = "info";
            // }
        })
    })
})
const changeTopMenu = (type: number) => {
    if(type==1) router.push({path: "home"});
    if(type==2) router.push({path: "tag"});
    if(type==3) router.push({path: "timeScroll"});
}
const onClickTag=(tag:any) =>{
    const to = router.resolve({
        name: "listStatusAuthorPageByStatusCode", //这里是跳转页面的name，要与路由设置保持一致
        query: { statusCode: tag.statusCode},
      });
    window.open(to.href, "_blank");
    // window.open(router.resolve('/tag/listStatusAuthorPageByStatusCode?tagId=' + tag.statusCode).href, '_blank')
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
