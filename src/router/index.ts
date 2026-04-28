import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import Layout from '../components/HelloWorld.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        redirect: {
            name: 'home'
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../views/login.vue')
    },
    {
        path: '/home',
        name: 'home',
        component: () => import('../views/home/index.vue')
    },
    {
        path: '/canvas',
        name: 'canvas',
        component: () => import('../views/home/canvas.vue')
    },
    {
        path: '/home-new',
        name: 'home-new',
        component: () => import('../views/home-new/index.vue')
    },
    {
        path: '/experiment',
        name: 'experiment',
        component: () => import('../views/experiment/index.vue')
    },
    // KGQA 相关路由
    {
        path: '/kgqa/welcome',
        name: 'kgqa-welcome',
        component: () => import('../views/kgqa/Welcome.vue')
    },
    {
        path: '/kgqa/search',
        name: 'kgqa-search',
        component: () => import('../views/kgqa/Search.vue')
    },
    {
        path: '/kgqa/all-relation',
        name: 'kgqa-all-relation',
        component: () => import('../views/kgqa/AllRelation.vue')
    },
    {
        path: '/kgqa/qa',
        name: 'kgqa-qa',
        component: () => import('../views/kgqa/KGQA.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
