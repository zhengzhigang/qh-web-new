<template>
<div class="container">
  <div class="box leftbox">
    <h3>{{datas.author.name }}</h3>
    <div v-for="post in datas.postList">
        <h5>{{post.title}}</h5>
        <p>{{post.content}}</p>
        <hr>
   </div>
  </div>
  <div class="box rightbox">
    <h3 style="display: inline-block;">{{datas.author.matchType == -2 ? "人名" : "别名" }}匹配</h3>
    <div style="float: right;"><el-button v-blur  @click.prevent="logoutAction" type="info" plain>退出登录</el-button></div>
    <div class="people_div" v-for="person in datas.personList">
        <p>
            <span class="people_id_span">person_id: <label>{{person.personId}}</label></span>
            <span class="people_name_span">名字: <label>{{person.name}}</label></span>
            <span>朝代: <label>{{ person.dynastyChn}}</label></span>
        </p>
        <p>
            <span>出生年:  <label>{{person.birthYear}}</label></span>
            <span>出生年号: <label>{{person.byNianHaoDO?.nianHaoChn!}} {{person.birthNianHaoYear}}</label></span>
        </p>
        <p>
            <span>卒年:   <label>{{person.deathYear}}</label></span>
            <span>卒年年号: <label>{{person.dyNianHaoDO?.nianHaoChn!}} {{person.deathNianHaoYear}}</label></span>
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
            <a :href="'http://47.94.219.248/basicinformation/' + person.personId +'/edit'" target="_blank">cbdb链接</a>
            <el-button  v-blur class="match_btn" @click.prevent="confirmMatchPeople(datas.author.authorId,person.personId)" type="primary" plain>匹配此人</el-button></div>
        <hr>
    </div>

  </div>
</div>
</template>
<script lang="ts" setup>
import { reactive,ref } from 'vue'
import { ElMessage } from 'element-plus'
import { findUmatchAuthor,doMatchAuthor,logout } from '@/api/common'
import router from '@/router'
const datas = reactive({
    postList: [] as any,
    personList:[] as any,
    author: {
        authorId: 0,
        name: '',
        matchType:-9,
    }
})
const findOneData = () => {
    findUmatchAuthor({}).then(res => {
        console.log(res)
        datas.author.authorId = res.data.author.authorId;
        datas.author.name = res.data.author.name;
        datas.author.matchType = res.data.author.matchType;
        datas.postList = res.data.postList;
        datas.personList = res.data.personList;
    })
}
findOneData()
const confirmMatchPeople = (authorId: any, personId: any) => {

    var bln=window.confirm("确定要匹配此人吗?")
    if(bln==false){
        return
    }
    doMatchAuthor({ authorId: authorId.toString(), personId: personId }).then(res => {
        ElMessage({message:'成功匹配一个作家',type:'success'})
        findOneData();
    })
}
const logoutAction = () => {

    var bln=window.confirm("确定要退出登录吗?")
    if(bln==false){
        return
    }
    logout({}).then((res:any) => {
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
  justify-content: center; /* 水平居中 */
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
  h3{
    text-align: center;
  }
  h5{
    text-align: left;
    margin-top: 0;
    margin-bottom: 0;
  }
  p{
    font-size: 12px;
  }
}
.rightbox {
  h3{
    text-align: center;
  }
}
.people_div{
  text-align: left;
  span{
    margin-right: 50px;
    font-size: .83em;
    label{
        font-weight: bold;
    }
  }
  p{
    padding-top: 10px;
  }
  .people_bottom_div{
    display: flex;
    justify-content: space-between;
    align-items: center;
    a{
        color: #409EFF;
    }
    .match_btn{
      margin-right: 0;
    }
  }
}

</style>