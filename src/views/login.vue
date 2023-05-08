<template>
    <div class="logincontainer">
        <el-form class="loginForm" ref="loginFormRef" :inline="false">
            <el-form-item>
                <div class="loginTitle">系统登录</div>
            </el-form-item>
            <el-form-item prop="mobile">
                <el-input size="large" placeholder="请输入手机号码" v-model="loginModel.mobile"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input size="large" type="password" placeholder="请输入密码" v-model="loginModel.password"></el-input>
            </el-form-item>
            <el-form-item>
                <el-row>
                    <el-col :span="12" style="padding-right: 10px; padding-left: 0px">
                        <el-button @click="login_request" class="mybtn" type="primary" size="large">
                            登录
                        </el-button>
                    </el-col>
                </el-row>
            </el-form-item>
        </el-form>
    </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { login } from '@/api/common'
import { ElMessage } from 'element-plus'
const router = useRouter();
const loginModel = reactive({
    mobile: '',
    password: '',
})
const login_request = () => {
    if (loginModel.mobile == '') {
        ElMessage({ message: '请输入手机号码', type: 'error' })
        return
    }
    if (loginModel.password == '') {
        ElMessage({ message: '请输入密码', type: 'error' })
        return
    }
    login({ mobile: loginModel.mobile, password: loginModel.password }).then((res:any) => {
        sessionStorage.setItem('tokenName', res.data.tokenName)
        sessionStorage.setItem('tokenValue', res.data.tokenValue)
        router.push('/author')
    })
}

</script>
<style scoped lang="scss">
.logincontainer {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .loginForm {
        height: 320px;
        width: 400px;
        border-radius: 10px;
        padding: 20px 35px;
        box-shadow: 0 0 25px #cac6c6;

        .loginTitle {
            width: 100%;
            font-size: 24px;
            font-weight: 600;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .image {
            height: 40px;
            width: 100%;
        }

        .mybtn {
            width: 100%;
        }
    }
}

:deep(.el-row) {
    width: 100% !important;
}
</style>
