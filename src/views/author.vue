<template>
    <div class="container" v-if="isShow">
        <div class="box leftbox">
            <h3>{{ datas.author.excelName }}</h3>

            <div class="description" v-if="datas.author.description">人物介绍: {{ datas.author.description }}</div>
            <div v-for="post in datas.postList">
                <h5>{{ post.title }}</h5>
                <p>{{ post.content }}</p>
                <hr>
            </div>
        </div>
        <div class="box rightbox">
            <h3 style="display: inline-block;">匹配信息</h3>
            <div style="float: right;"><el-button v-blur @click.prevent="logoutAction" type="info" plain>退出登录</el-button>
            </div>
            <template v-if="datas.author.handle == 0 || datas.author.handle == 1">
                <div class="people_div">
                    <p>
                        <span class="people_id_span">person_id: <label>{{ datas.author.person.personId }}</label></span>
                        <span class="people_name_span">名字: <label>{{ datas.author.person.name }}</label></span>
                        <span>朝代: <label>{{ computedDynasty(datas.author.person.dynastyCode) }}</label></span>
                    </p>
                    <p>
                        <span>出生年: <label>{{ datas.author.person.birthYear }}</label></span>
                        <span>出生年号: <label>{{ datas.author.person.byNianHaoDO?.nianHaoChn! }}
                                {{ datas.author.person.birthNianHaoYear }}</label></span>
                    </p>
                    <p>
                        <span>卒年: <label>{{ datas.author.person.deathYear }}</label></span>
                        <span>卒年年号: <label>{{ datas.author.person.dyNianHaoDO?.nianHaoChn! }}
                                {{ datas.author.person.deathNianHaoYear }}</label></span>
                    </p>
                    <p><span>别号:
                            <label>
                                <template v-for="altName in datas.author.person.altNameDOList">
                                    {{ altName.altNameChn }} &nbsp;&nbsp;
                                </template>
                            </label>
                        </span>
                    </p>
                    <div class="people_bottom_div">
                        <a :href="'http://47.94.219.248/basicinformation/' + datas.author.person.personId + '/edit'"
                            target="_blank">cbdb链接</a>
                    </div>
                </div>
            </template>
            <template v-else>
                <template v-if="datas.personList!=undefined && datas.personList!=null && datas.personList.length>0">
                    <div class="people_div" v-for="person in datas.personList">
                        <p>
                            <span class="people_id_span">person_id: <label>{{ person.personId }}</label></span>
                            <span class="people_name_span">名字: <label>{{ person.name }}</label></span>
                            <span>朝代: <label>{{ computedDynasty(person.dynastyCode) }}</label></span>
                        </p>
                        <p>
                            <span>出生年: <label>{{ person.birthYear }}</label></span>
                            <span>出生年号: <label>{{ person.byNianHaoDO?.nianHaoChn! }}
                                    {{ person.birthNianHaoYear }}</label></span>
                        </p>
                        <p>
                            <span>卒年: <label>{{ person.deathYear }}</label></span>
                            <span>卒年年号: <label>{{ person.dyNianHaoDO?.nianHaoChn! }}
                                    {{ person.deathNianHaoYear }}</label></span>
                        </p>
                        <p><span>别号:
                                <label>
                                    <template v-for="altName in person.altNameDOList">
                                        {{ altName.altNameChn }} &nbsp;&nbsp;
                                    </template>
                                </label>
                            </span>
                        </p>
                        <div class="people_bottom_div">
                            <a :href="'http://47.94.219.248/basicinformation/' + person.personId + '/edit'"
                                target="_blank">cbdb链接</a>
                            <el-button v-blur class="match_btn"
                                @click.prevent="confirmMatchPeople(datas.author.authorId, person.personId)" type="primary"
                                plain>匹配此人</el-button>
                        </div>
                        <hr>
                    </div>
                </template>
                <template v-else>
                  <h3>根据作者的名字,无法匹配到cbdb数据库的人物名字或者别名</h3>
                  <h3> <a href="http://47.94.219.248/basicinformation" target="_blank">cbdb链接</a></h3>
                  <el-input v-model="datas.cbdbPersonId" placeholder="输入cbdb的person_id" />
                  <el-button v-blur @click.prevent="queryCbdbPersonAction" type="primary" plain>查询校验</el-button>
                  <el-button v-blur @click.prevent="confirmMatchPeople(datas.author.authorId, datas.cbdbPersonId)" type="primary" plain>确认匹配</el-button>

                  <div class="people_div" v-show="isShowCbdbPerson">
                    <p>
                        <span class="people_id_span">person_id: <label>{{ datas.cbdbPerson.personId }}</label></span>
                        <span class="people_name_span">名字: <label>{{ datas.cbdbPerson.name }}</label></span>
                        <span>朝代: <label>{{ computedDynasty(datas.cbdbPerson.dynastyCode) }}</label></span>
                    </p>
                    <p>
                        <span>出生年: <label>{{ datas.cbdbPerson.birthYear }}</label></span>
                        <span>出生年号: <label>{{ datas.cbdbPerson.byNianHaoDO?.nianHaoChn! }}
                                {{ datas.cbdbPerson.birthNianHaoYear }}</label></span>
                    </p>
                    <p>
                        <span>卒年: <label>{{ datas.cbdbPerson.deathYear }}</label></span>
                        <span>卒年年号: <label>{{ datas.cbdbPerson.dyNianHaoDO?.nianHaoChn! }}
                                {{ datas.cbdbPerson.deathNianHaoYear }}</label></span>
                    </p>
                    <p><span>别号:
                            <label>
                                <template v-for="altName in datas.cbdbPerson.altNameDOList">
                                    {{ altName.altNameChn }} &nbsp;&nbsp;
                                </template>
                            </label>
                        </span>
                    </p>
                    <div class="people_bottom_div">
                        <a :href="'http://47.94.219.248/basicinformation/' + datas.cbdbPerson.personId + '/edit'"
                            target="_blank">cbdb链接</a>
                    </div>
                </div>

                </template>
            </template>
        </div>
    </div>
    <div class="bottom_div">
        <span v-for="author in datas.authorList">
            <span class="author_click" @click.prevent="getAuthorDetailById(author.authorId)"
                :style="{ 'color': (author.handle == 1 || author.handle == 0) ? 'green' : 'red' }">{{ author.excelName }}</span>
            &nbsp;&nbsp;&nbsp;
        </span>
    </div>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { findPersonByPersonId,findAuthorByAuthorId, doMatchAuthor, logout, listAllAuthor } from '@/api/common'
import router from '@/router'
var params = router.currentRoute.value.params

const isShow = ref(false)

const isShowCbdbPerson = ref(false)


const datas = reactive({
    cbdbPersonId:null,
    cbdbPerson: {} as any,
    matchAction: false,
    authorList: [] as any,
    postList: [] as any,
    personList: [] as any,
    author: {
        handle: -1,
        authorId: 0,
        excelName: '',
        description: '',
        matchType: -9,
        person: {} as any,
    }
})
const computedDynasty = computed(() => {
    return (v: any) => {
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
})
// const findOneData = () => {
//     findAuthorByAuthorId({}).then(res => {
//         console.log(res)
//         datas.author.authorId = res.data.author.authorId;
//         datas.author.name = res.data.author.name;
//         datas.author.matchType = res.data.author.matchType;
//         datas.author.person = res.data.author.person;
//         datas.author.handle = res.data.author.handle;
//         datas.postList = res.data.postList;
//         datas.personList = res.data.personList;
//     })
// }
const getAuthorDetailById = (authorId: any) => {
    reSetPage();
    findAuthorByAuthorId({ authorId: authorId.toString() }).then(res => {
        console.log(res)
        datas.author.authorId = res.data.author.authorId;
        datas.author.excelName = res.data.author.excelName;
        datas.author.description = res.data.author.description;
        datas.author.matchType = res.data.author.matchType;
        datas.author.person = res.data.author.person;
        datas.author.handle = res.data.author.handle;
        datas.postList = res.data.postList;
        datas.personList = res.data.personList;

        isShow.value = true;
        window.scrollTo(0, 0);
    })
}
const listAllAuthorAction = () => {
    listAllAuthor({}).then(res => {
        // console.log
        // console.log(res.data)
        datas.authorList = res.data;
    })
}
listAllAuthorAction();

const queryCbdbPersonAction = () =>{
    if(datas.cbdbPersonId == 0 || datas.cbdbPersonId == null){
        return;
    }
    findPersonByPersonId({"personId":datas.cbdbPersonId}).then(res=>{
        datas.cbdbPerson = res.data
        isShowCbdbPerson.value = true;
    })
}

const confirmMatchPeople = (authorId: any, personId: any) => {
    if(personId == 0 || personId == null){
        return;
    }

    var bln = window.confirm("确定要匹配此人吗?")
    if (bln == false) {
        return
    }
    doMatchAuthor({ authorId: authorId.toString(), personId: personId }).then(res => {
        ElMessage({ message: '成功匹配一个作家', type: 'success' })
        // findOneData();
        reSetPage()
        resetAuthorList();
        listAllAuthorAction();
        getAuthorDetailById(authorId)
    })
}
const reSetPage =() =>{
    isShow.value = false;
    isShowCbdbPerson.value = false;
    datas.cbdbPersonId = null;
    datas.cbdbPerson = {} as any;
    datas.matchAction = false;
    datas.postList = [] as any;
    datas.personList = [] as any;
}
const resetAuthorList = () => {
    datas.author ={
        handle: -1,
        authorId: 0,
        excelName: '',
        description: '',
        matchType: -9,
        person: {} as any,
    }
}
const logoutAction = () => {

    var bln = window.confirm("确定要退出登录吗?")
    if (bln == false) {
        return
    }
    logout({}).then((res: any) => {
        if (res.code == 0) {
            sessionStorage.removeItem('tokenName');
            sessionStorage.removeItem('tokenValue');
            router.push('/login');
        }
    })
}
</script>
<style lang="scss" scoped>
.container {
    display: flex;
    justify-content: center;
    /* 水平居中 */
}

hr {
    height: 1px;
    background-color: #ccccd8;
    border: none;
}

.box {
    width: 50%;
    padding: 10px;
}

.leftbox {
    border-right: 1px solid #ccccd8;

    h3 {
        text-align: center;
    }
    .description{
        font-size: 14px;
        margin-bottom: 20px;
    }

    h5 {
        text-align: left;
        margin-top: 0;
        margin-bottom: 0;
    }

    p {
        font-size: 12px;
    }
}

.rightbox {
    h3 {
        text-align: center;
    }
}

.people_div {
    text-align: left;

    span {
        margin-right: 50px;
        font-size: .83em;

        label {
            font-weight: bold;
        }
    }

    p {
        padding-top: 10px;
    }

    .people_bottom_div {
        display: flex;
        justify-content: space-between;
        align-items: center;

        // a{
        //     color: #409EFF;
        // }
        .match_btn {
            margin-right: 0;
        }
    }
}

.bottom_div {
    text-align: center;
    padding-left: 10px;
    margin-top: 20px;

    a {
        // color: #409EFF;
    }

    span {
        line-height: 30px;
        height: 50px;
    }
}

.author_click {
    cursor: pointer;
}</style>