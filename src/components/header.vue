<template>
   <div class="flex pt-25px pb-25px">
        <img class="log" style="cursor: pointer;" src="@/assets/logo.png" @click="linkPage('home')">
        <div class="nav flex justify-center items-end ml-20px">
            <span :class="type === 1 && 'active'" @click="changeTopMenu(1)">诗词搜索</span>
            <span :class="type === 2 && 'active'" @click="changeTopMenu(2)">标签搜索</span>
            <span :class="type === 3 && 'active'" @click="changeTopMenu(3)">时间轴</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router';
const { currentRoute } = useRouter();
const router = useRouter();
const route = currentRoute.value;

const props = defineProps({
  type: Number
})

const changeTopMenu = (type: number) => {
    if(type==1) router.push({path: "home"});
    if(type==2) router.push({path: "tag"});
    if(type==3) router.push({path: "timeScroll"});
}

const linkPage = (routePage:any) =>{
    const to = router.resolve({
        name: routePage,
    });
    window.open(to.href, "_blank");
}
</script>
<style lang="less" scoped>
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
</style>
