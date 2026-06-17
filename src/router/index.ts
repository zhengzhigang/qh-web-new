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
    // honglou 相关路由
    {
        path: '/honglou/welcome',
        name: 'honglou-welcome',
        component: () => import('../views/honglou/Welcome.vue')
    },
    {
        path: '/honglou/search',
        name: 'honglou-search',
        component: () => import('../views/honglou/Search.vue')
    },
    {
        path: '/honglou/all-relation',
        name: 'honglou-all-relation',
        component: () => import('../views/honglou/AllRelation.vue')
    },
    {
        path: '/honglou/qa',
        name: 'honglou-qa',
        component: () => import('../views/honglou/Question.vue')
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
