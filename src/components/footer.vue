<!--
 * @Author: ouyang
 * @Date: 2023-09-25 22:20:39
 * @LastEditors: ouyang
 * @LastEditTime: 2023-09-25 22:21:17
 * @FilePath: \qh-web\src\components\footer.vue
-->
<template>
   <div class="footer">
        <div class="w-1140px ml-auto mr-auto flex justify-center flex-col items-center">
            <p>© 2023 中国数字人文 皖ICP备19020276号-4</p>
            <p>本网站为学术公益性网站，若有侵权，请联系删除。</p>
            <p>知识共享许可协议本网站采用知识共享署名-非商业性使用-禁止演绎 4.0 国际许可协议进行许可。</p>
        </div>
    </div>
</template>

<style lang="less" scoped>
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
</style>
