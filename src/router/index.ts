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
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
